import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { BEST_SELLER_PRODUCTS } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface BestSellersProps {
  onNavigate?: (page: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ onNavigate, onSelectProduct }) => {
  const { addItem } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScroll - 8);

    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 20
      : el.clientWidth;
    if (cardWidth > 0) {
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(idx, BEST_SELLER_PRODUCTS.length - 1));
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = useCallback((direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 20 : el.clientWidth * 0.8;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction === 'next') {
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    } else {
      if (el.scrollLeft <= 8) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  }, []);

  // Passagem automática suave dos cards (pausa ao interagir)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      scrollByCard('next');
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, scrollByCard]);

  const scrollToCard = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 20 : 0;
    el.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  return (
    <section
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Cabeçalho da Vitrine */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#041B38]">
            Mais Vendidos
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Os itens essenciais mais repostos por empresas, escritórios e condomínios
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollByCard('prev')}
              aria-label="Produtos anteriores"
              className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white text-[#041B38] hover:border-[#1863DC] hover:text-[#1863DC] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard('next')}
              aria-label="Próximos produtos"
              className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white text-[#041B38] hover:border-[#1863DC] hover:text-[#1863DC] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('catalogo')}
            className="text-xs sm:text-sm font-display font-bold text-slate-500 hover:text-lothus-royal flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Carrossel Horizontal Estilo Gimba / Ortobom */}
      <div className="relative">
        {/* Seta Flutuante Esquerda (Desktop) */}
        <button
          type="button"
          onClick={() => scrollByCard('prev')}
          aria-label="Voltar carrossel"
          className={`hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-md items-center justify-center text-[#041B38] hover:text-[#1863DC] hover:border-[#1863DC] transition-colors cursor-pointer ${
            !canScrollLeft ? 'opacity-70' : 'opacity-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Seta Flutuante Direita (Desktop) */}
        <button
          type="button"
          onClick={() => scrollByCard('next')}
          aria-label="Avançar carrossel"
          className={`hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-md items-center justify-center text-[#041B38] hover:text-[#1863DC] hover:border-[#1863DC] transition-colors cursor-pointer ${
            !canScrollRight ? 'opacity-70' : 'opacity-100'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Trilha Horizontal com Snap */}
        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {BEST_SELLER_PRODUCTS.map((prod) => {
            const pixPrice = prod.price * (1 - prod.discountPixPercent / 100);
            const installmentVal = prod.price / prod.installmentsMax;

            return (
              <div
                key={prod.id}
                className="snap-start shrink-0 w-[82%] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:shadow-card hover:border-slate-300 transition-colors duration-200 relative"
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
                    <span
                      className={`text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide whitespace-nowrap ${
                        prod.badgeColor === 'orange' ? 'bg-[#FB8C00]' : 'bg-[#16A34A]'
                      }`}
                    >
                      {prod.badge || 'MAIS VENDIDO'}
                    </span>
                  </div>
                  <button
                    className="text-slate-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
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
                    loading="lazy"
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
                  Adicionar ao Carrinho
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicadores de Posição (Dots) */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {BEST_SELLER_PRODUCTS.map((prod, idx) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => scrollToCard(idx)}
            aria-label={`Ir para produto ${idx + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeIndex === idx
                ? 'w-6 bg-[#1863DC]'
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
