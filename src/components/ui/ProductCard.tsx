import React, { useState, useCallback } from 'react';
<<<<<<< Updated upstream
import { Star, Heart } from './Icon';
=======
import { Star, Heart, Check, Package } from './Icon';
>>>>>>> Stashed changes
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onNavigate?: (page: string) => void;
  className?: string;
  buttonText?: string;
}

<<<<<<< Updated upstream
function getCategoryLabel(category: string = ''): string {
  if (category.includes('Papelaria') || category.includes('Escritório')) return 'Escritório';
  if (category.includes('Descartáveis')) return 'Descartáveis';
  if (category.includes('Food Service')) return 'Food Service';
  if (category.includes('Equipamentos')) return 'Equipamentos';
  if (category.includes('Artesanato')) return 'Artesanato';
  if (category.includes('EPIs') || category.includes('Proteção')) return 'EPIs';
  if (category.includes('Embalagens')) return 'Embalagens';
  if (category.includes('Limpeza') || category.includes('Higiene')) return 'Limpeza';
  return category.split(' ')[0] || 'Limpeza';
=======
/** Placeholder SVG quando o produto não possui imagem */
const ImagePlaceholder: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
    <Package className="w-10 h-10 mb-1" />
    <span className="text-[10px] font-medium text-slate-400">Sem imagem</span>
  </div>
);

/** Extrai a categoria simplificada em conformidade com o Paper */
function shortCategory(cat: string): string {
  if (cat.includes('Papelaria') || cat.includes('Escritório')) return 'Papelaria';
  if (cat.includes('Descartáveis') || cat.includes('Food Service')) return 'Descartáveis';
  if (cat.includes('Equipamentos')) return 'Equipamentos';
  if (cat.includes('Artesanato')) return 'Artesanato';
  if (cat.includes('Limpeza') || cat.includes('Higiene')) return 'Limpeza';
  return cat;
>>>>>>> Stashed changes
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onNavigate,
  className = '',
  buttonText = 'Adicionar ao Pedido',
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
<<<<<<< Updated upstream

  const pixPrice = product.price * (1 - (product.discountPixPercent || 10) / 100);

  const discountLabel = (() => {
    if (product.originalPrice && product.originalPrice > pixPrice) {
      const pct = Math.round(((product.originalPrice - pixPrice) / product.originalPrice) * 100);
      if (pct > 0) return `${pct}% OFF`;
    }
    return '10% OFF';
  })();

  const badgeLabel = product.badge || (product.isBestSeller ? 'MAIS VENDIDO' : null);

  const badgeColorClass = (() => {
    if (product.badgeColor === 'green') return 'bg-[#16A34A]';
    if (product.badgeColor === 'orange') return 'bg-[#FB8C00]';
    if (product.badgeColor === 'blue') return 'bg-[#0F668E]';
    if (badgeLabel === 'MAIS VENDIDO') return 'bg-[#16A34A]';
    return 'bg-[#FB8C00]';
  })();
=======
  const [imgError, setImgError] = useState(false);

  const pixPrice = product.price * (1 - (product.discountPixPercent || 10) / 100);
  const installments = product.installmentsMax || 3;
  const installmentVal = product.price / installments;
>>>>>>> Stashed changes

  const handleNavigate = useCallback(() => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onNavigate) {
      onNavigate('produto');
    }
  }, [onSelectProduct, onNavigate, product]);

<<<<<<< Updated upstream
  const handleAddToCart = useCallback(() => {
    if (added) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [added, addItem, product]);

  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200 group ${className}`}
    >
      <div>
        {/* Topo: Categoria + Badges + Favorito */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-[#041B38] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide whitespace-nowrap">
              {getCategoryLabel(product.category)}
            </span>
            {badgeLabel && (
              <span
                className={`text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide whitespace-nowrap ${badgeColorClass}`}
              >
                {badgeLabel}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(prev => !prev);
            }}
            aria-label="Salvar nos favoritos"
            className={`transition-colors p-1 cursor-pointer ${
              isFavorite ? 'text-red-500' : 'text-slate-300 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Imagem do Produto */}
        <div
          onClick={handleNavigate}
          className="w-full h-44 flex items-center justify-center p-2 mb-3 cursor-pointer overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Avaliação em Estrelas */}
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 text-[#FB8C00] fill-[#FB8C00]"
            />
          ))}
          <span className="text-[11px] font-bold text-slate-600 ml-1">
            {product.rating}
          </span>
        </div>

        {/* Nome do Produto */}
        <h4
          onClick={handleNavigate}
          className="font-display font-bold text-xs text-[#041B38] line-clamp-2 leading-relaxed mb-3 cursor-pointer hover:text-[#0F668E] transition-colors"
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Preços */}
        <div className="mb-4">
          {product.originalPrice && product.originalPrice > pixPrice && (
            <span className="text-[11px] text-slate-400 line-through block">
              De {product.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg text-[#041B38]">
              {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-xs font-bold text-[#16A34A]">
              {discountLabel}
=======
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (added) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [added, addItem, product]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  }, []);

  // Determinação do badge secundário conforme o Paper (Flash Sale, Mais Vendida/Mais Vendido, Últimas Unidades)
  const promoBadge = (() => {
    if (product.badge) return product.badge;
    if (product.isBestSeller) return 'Mais Vendido';
    if (product.isFlashDeal) return 'Flash Sale';
    return null;
  })();

  const promoBadgeBg = (() => {
    if (product.badgeColor === 'green' || promoBadge?.includes('Mais Vendid')) return 'bg-[#16A34A]';
    return 'bg-[#FB8C00]';
  })();

  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between gap-3 shadow-xs hover:border-slate-300 hover:shadow-card transition-all duration-200 group relative ${className}`}
    >
      <div>
        {/* ───── Topo: Badges & Favorito (Conforme Paper) ───── */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Tag de Departamento */}
            <span className="bg-[#041B38] text-white text-[9px] font-bold font-display px-2 py-0.5 rounded uppercase leading-tight whitespace-nowrap">
              {shortCategory(product.category)}
            </span>

            {/* Tag Promocional */}
            {promoBadge && (
              <span
                className={`${promoBadgeBg} text-white text-[9px] font-black font-display px-2 py-0.5 rounded uppercase leading-tight whitespace-nowrap`}
              >
                {promoBadge}
              </span>
            )}
          </div>

          {/* Botão Favorito */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label="Salvar nos favoritos"
            className="text-slate-300 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* ───── Imagem do Produto ───── */}
        <div
          onClick={handleNavigate}
          className="w-full h-44 flex items-center justify-center p-2 mb-2 cursor-pointer overflow-hidden"
        >
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="max-h-40 max-w-40 object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {/* ───── Informações e Preço ───── */}
        <div className="flex flex-col gap-1.5">
          {/* Avaliação em estrelas douradas */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 text-[#FB8C00] fill-[#FB8C00]"
                />
              ))}
            </div>
            <span className="text-[11px] font-bold font-sans text-slate-600 ml-1">
              {product.rating ? product.rating.toFixed(product.rating % 1 === 0 ? 0 : 1) : '5'}
            </span>
            {product.reviewsCount !== undefined && (
              <span className="text-[11px] text-slate-400 font-sans">
                ({product.reviewsCount})
              </span>
            )}
          </div>

          {/* Nome do Produto com 2 linhas e corte limpo */}
          <h4
            onClick={handleNavigate}
            className="font-display font-bold text-xs text-[#041B38] leading-[19px] h-[38px] line-clamp-2 cursor-pointer hover:text-[#0F668E] transition-colors"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Bloco de Preços */}
          <div className="pt-1 flex flex-col gap-0.5">
            {/* Preço original riscado */}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through font-sans">
                De {product.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            )}

            {/* Preço principal e selo de desconto */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-lg text-[#041B38]">
                {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-[10px] font-bold text-[#16A34A] uppercase font-sans">
                {product.discountPixPercent || 10}% OFF
              </span>
            </div>

            {/* Parcelamento */}
            <span className="text-[11px] text-slate-500 font-sans">
              ou {installments}x de{' '}
              {installmentVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}{' '}
              sem juros
>>>>>>> Stashed changes
            </span>
          </div>
        </div>
      </div>

<<<<<<< Updated upstream
      {/* Botão Adicionar ao Pedido */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full py-2.5 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
          added
            ? 'bg-[#16A34A] text-white'
            : 'bg-[#0F668E] hover:bg-[#0B4F6E] text-white'
        }`}
      >
        {added ? 'Adicionado!' : 'Adicionar ao Pedido'}
=======
      {/* ───── Botão Oficial do Paper ───── */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full h-10 rounded-lg font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer mt-1 ${
          added
            ? 'bg-[#16A34A] text-white'
            : 'bg-[#0F668E] hover:bg-[#0B4F6E] text-white shadow-xs'
        }`}
      >
        {added ? (
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            Adicionado!
          </span>
        ) : (
          <span>{buttonText}</span>
        )}
>>>>>>> Stashed changes
      </button>
    </div>
  );
};

export default ProductCard;
