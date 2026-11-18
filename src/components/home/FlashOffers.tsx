import React from 'react';
import { ArrowRight, Zap } from '../ui/Icon';
import { ProductCard } from '../ui/ProductCard';
import { FLASH_PRODUCTS } from '../../data/mockData';
import { Product } from '../../types';

interface FlashOffersProps {
  onNavigate?: (page: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const FlashOffers: React.FC<FlashOffersProps> = ({ onNavigate, onSelectProduct }) => {
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
        {FLASH_PRODUCTS.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onSelectProduct={onSelectProduct}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
};
