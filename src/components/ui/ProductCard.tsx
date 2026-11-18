import React, { useState, useCallback } from 'react';
import { Star, Heart, ShoppingCart, Check, Layers, Package } from './Icon';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onNavigate?: (page: string) => void;
  className?: string;
}

/** Placeholder SVG exibido quando o produto não possui imagem. */
const ImagePlaceholder: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
    <Package className="w-10 h-10 mb-1" />
    <span className="text-[10px] font-medium text-slate-400">Sem imagem</span>
  </div>
);

/**
 * Extrai o nome resumido da categoria para exibição como badge.
 * Se já tiver um nome curto retorna ele diretamente.
 */
function shortCategory(cat: string): string {
  if (cat.includes('Papelaria')) return 'Papelaria';
  if (cat.includes('Descartáveis')) return 'Descartáveis';
  if (cat.includes('Food Service')) return 'Food Service';
  if (cat.includes('Equipamentos')) return 'Equipamentos';
  if (cat.includes('Artesanato')) return 'Artesanato';
  if (cat.includes('Limpeza') || cat.includes('Higiene')) return 'Limpeza';
  return cat;
}

/**
 * Calcula se existe desconto real entre `originalPrice` e `price`.
 * Retorna a porcentagem arredondada ou null se não houver desconto.
 */
function computeDiscount(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Determina o estado de disponibilidade com base no estoque.
 * - undefined/null → "available" (sem informação, tratar como disponível)
 * - 0 → "unavailable"
 * - 1-10 → "low"
 * - >10 → "available"
 */
type StockStatus = 'available' | 'low' | 'unavailable';

function getStockStatus(stock?: number): StockStatus {
  if (stock === undefined || stock === null) return 'available';
  if (stock <= 0) return 'unavailable';
  if (stock <= 10) return 'low';
  return 'available';
}

/** Formato de moeda BRL */
const toBRL = (val: number) =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onNavigate,
  className = '',
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const pixPrice = product.price * (1 - product.discountPixPercent / 100);
  const installmentVal = product.installmentsMax > 1
    ? product.price / product.installmentsMax
    : null;
  const discountPercent = computeDiscount(product.price, product.originalPrice);
  const stockStatus = getStockStatus(product.stock);
  const isUnavailable = stockStatus === 'unavailable';

  // Determinar o badge promocional a exibir
  const promoBadge = (() => {
    if (discountPercent && discountPercent >= 15) return `-${discountPercent}%`;
    if (product.badge) return product.badge;
    if (product.isBestSeller) return 'Mais Vendido';
    return null;
  })();

  const promoBadgeColor = (() => {
    if (product.badgeColor === 'green') return 'bg-lothus-green';
    if (product.badgeColor === 'orange') return 'bg-lothus-orange';
    if (product.badgeColor === 'blue') return 'bg-lothus-royal';
    return 'bg-lothus-orange';
  })();

  const handleNavigate = useCallback(() => {
    if (isUnavailable) return;
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onNavigate) {
      onNavigate('produto');
    }
  }, [isUnavailable, onSelectProduct, onNavigate, product]);

  const handleAddToCart = useCallback(() => {
    if (isUnavailable || added) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [isUnavailable, added, addItem, product]);

  return (
    <div
      className={`bg-white border border-lothus-border rounded-xl flex flex-col justify-between
        shadow-subtle hover:shadow-card-hover hover:border-slate-300
        transition-all duration-300 group relative overflow-hidden
        ${isUnavailable ? 'opacity-75' : ''}
        ${className}`}
    >
      {/* ───── Badges & Favorito ───── */}
      <div className="relative">
        {/* Badges (top-left) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {promoBadge && (
            <span
              className={`${promoBadgeColor} text-white text-[10px] font-black uppercase
                px-2.5 py-1 rounded-md tracking-wide whitespace-nowrap
                shadow-sm leading-none`}
            >
              {promoBadge}
            </span>
          )}
          {discountPercent && discountPercent >= 5 && promoBadge !== `-${discountPercent}%` && (
            <span
              className="bg-lothus-green text-white text-[10px] font-black uppercase
                px-2.5 py-1 rounded-md tracking-wide whitespace-nowrap
                shadow-sm leading-none"
            >
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorito (top-right) */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full
            bg-white/80 backdrop-blur-sm border border-slate-100
            flex items-center justify-center
            text-slate-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50/80
            transition-all duration-200 cursor-pointer shadow-sm"
          title="Salvar nos Favoritos"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* ───── Imagem ───── */}
        <div
          onClick={handleNavigate}
          className={`w-full aspect-[4/3] flex items-center justify-center p-4 bg-slate-50/60
            overflow-hidden ${!isUnavailable ? 'cursor-pointer' : 'cursor-default'}
            group-hover:bg-slate-50 transition-colors duration-300`}
        >
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain
                group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>

      {/* ───── Conteúdo do Card ───── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Marca + Categoria */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-lothus-text-slate uppercase tracking-wider">
            {product.brand}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {shortCategory(product.category)}
          </span>
        </div>

        {/* Nome do produto */}
        <h4
          onClick={handleNavigate}
          className={`font-display font-bold text-[13px] text-lothus-navy leading-snug
            line-clamp-2 mb-1.5 min-h-[36px]
            ${!isUnavailable ? 'cursor-pointer hover:text-lothus-royal' : ''}
            transition-colors duration-200`}
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Unidade de venda */}
        <span className="text-[10px] text-slate-400 font-medium mb-2">
          {product.unit}
        </span>

        {/* Avaliação */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(product.rating)
                      ? 'text-lothus-orange fill-lothus-orange'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {product.rating}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.reviewsCount})
            </span>
          </div>
        )}

        {/* ───── Preços ───── */}
        <div className="mt-auto">
          {/* Preço original riscado */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] text-slate-400 line-through">
                {toBRL(product.originalPrice)}
              </span>
              {discountPercent && (
                <span className="text-[10px] font-bold text-lothus-green bg-lothus-green-tint px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
            </div>
          )}

          {/* Preço principal no PIX */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-display font-extrabold text-xl text-lothus-navy leading-none">
              {toBRL(pixPrice)}
            </span>
            <span className="text-[11px] font-semibold text-lothus-green">
              no Pix
            </span>
          </div>

          {/* Preço a prazo / parcelas */}
          <div className="mt-1">
            <span className="text-[11px] text-slate-500">
              ou <span className="font-semibold text-slate-600">{toBRL(product.price)}</span>
              {installmentVal && (
                <> em {product.installmentsMax}x de{' '}
                  <span className="font-semibold">{toBRL(installmentVal)}</span> sem juros</>
              )}
            </span>
          </div>

          {/* B2B Preços progressivos */}
          {product.b2bPrices && product.b2bPrices.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
              <Layers className="w-3.5 h-3.5 text-lothus-royal shrink-0" />
              <span className="text-[10px] text-lothus-royal font-semibold leading-tight">
                A partir de {product.b2bPrices[0].minQty} un.:{' '}
                <span className="font-bold">{toBRL(product.b2bPrices[0].price)}</span>/un.
              </span>
            </div>
          )}

          {/* Disponibilidade */}
          {stockStatus === 'low' && product.stock !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lothus-orange opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lothus-orange"></span>
              </span>
              <span className="text-[11px] font-semibold text-lothus-orange">
                {product.stock <= 3 ? `Últimas ${product.stock} unidades` : 'Últimas unidades'}
              </span>
            </div>
          )}

          {isUnavailable && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
              <span className="text-[11px] font-semibold text-slate-500">
                Indisponível
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ───── Botão Adicionar ao Carrinho ───── */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isUnavailable}
          className={`w-full py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider
            flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer
            shadow-sm hover:shadow-md
            ${isUnavailable
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none hover:shadow-none'
              : added
                ? 'bg-lothus-green text-white scale-[0.98]'
                : 'bg-lothus-royal hover:bg-blue-700 text-white active:scale-[0.97]'
            }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Adicionado!</span>
            </>
          ) : isUnavailable ? (
            <span>Indisponível</span>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Adicionar ao Pedido</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
