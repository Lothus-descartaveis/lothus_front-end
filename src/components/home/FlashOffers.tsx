import React from 'react';
import { ArrowRight, Star, Heart, Zap } from 'lucide-react';
import { FLASH_PRODUCTS } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface FlashOffersProps {
  onNavigate?: (page: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const FlashOffers: React.FC<FlashOffersProps> = ({ onNavigate, onSelectProduct }) => {
  const { addItem } = useCart();

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 sm:pt-10 pb-8">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-[#FB8C00] fill-[#FB8C00]" />
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#041B38]">
            Aproveite! Condições especiais para Grande São Paulo e Região
          </h2>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('catalogo')}
          className="text-xs sm:text-sm font-display font-bold text-slate-500 hover:text-lothus-royal flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grade: 3 Cards de Produtos em Flash Sale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FLASH_PRODUCTS.map((prod) => {
          const pixPrice = prod.price * (1 - prod.discountPixPercent / 100);
          const installmentVal = prod.price / prod.installmentsMax;

          return (
            <div
              key={prod.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200 group relative"
            >
              {/* Badges superiores: Categoria + Título Comercial */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#041B38] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide whitespace-nowrap">
                    {prod.category.includes('Papelaria')
                      ? 'Papelaria'
                      : prod.category.includes('Descartáveis')
                      ? 'Descartáveis'
                      : prod.category.includes('Equipamentos')
                      ? 'Equipamentos'
                      : prod.category.includes('Artesanato')
                      ? 'Artesanato'
                      : 'Limpeza'}
                  </span>
                  {prod.badge && (
                    <span className="bg-[#FB8C00] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide whitespace-nowrap">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <button 
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  title="Salvar nos Favoritos"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Imagem do Produto */}
              <div 
                onClick={() => onSelectProduct ? onSelectProduct(prod) : onNavigate && onNavigate('produto')}
                className="w-full h-44 flex items-center justify-center p-2 mb-3 overflow-hidden cursor-pointer"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Título & Avaliação */}
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-[#FB8C00] fill-[#FB8C00]"
                    />
                  ))}
                  <span className="text-[11px] font-bold text-slate-600 ml-1">
                    {prod.rating}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({prod.reviewsCount})
                  </span>
                </div>

                <h4 
                  onClick={() => onSelectProduct ? onSelectProduct(prod) : onNavigate && onNavigate('produto')}
                  className="font-display font-bold text-xs text-[#041B38] line-clamp-2 leading-relaxed mb-3 min-h-[36px] cursor-pointer hover:text-lothus-royal transition-colors" 
                  title={prod.name}
                >
                  {prod.name}
                </h4>

                {/* Preços */}
                <div className="mb-4">
                  {prod.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through block">
                      De {prod.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-display font-extrabold text-lg text-[#041B38]">
                      {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-xs font-bold text-[#16A34A]">
                      {prod.discountPixPercent || 10}% OFF
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    ou {prod.installmentsMax}x de {installmentVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros
                  </span>
                </div>
              </div>

              {/* Botão de Compra */}
              <button
                onClick={() => addItem(prod, 1)}
                className="w-full py-2.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs hover:shadow"
              >
                Adicionar ao Pedido
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
