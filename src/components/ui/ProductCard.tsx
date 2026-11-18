import React, { useState, useCallback } from 'react';
import { Star, Heart } from './Icon';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onNavigate?: (page: string) => void;
  className?: string;
}

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
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onNavigate,
  className = '',
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleNavigate = useCallback(() => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onNavigate) {
      onNavigate('produto');
    }
  }, [onSelectProduct, onNavigate, product]);

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
            </span>
          </div>
        </div>
      </div>

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
      </button>
    </div>
  );
};

export default ProductCard;
