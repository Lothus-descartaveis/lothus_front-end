import React from 'react';
import { Sparkles, Tag } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (page: string) => void;
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeCategory, onSelectCategory }) => {
  const categories = [
    { name: 'Limpeza e Higiene', slug: 'limpeza-e-higiene' },
    { name: 'Food Service e Descartáveis', slug: 'food-service-e-descartaveis' },
    { name: 'Escritório e Papelaria', slug: 'escritorio-e-papelaria' },
    { name: 'Equipamentos de Limpeza', slug: 'equipamentos-de-limpeza' },
    { name: 'Artesanato', slug: 'artesanato-tecidos-festas' },
    { name: 'Saldão B2B', slug: 'saldao-b2b', isPromo: true },
    { name: 'Ofertas da Semana', slug: 'ofertas-da-semana', isHighlight: true }
  ];

  const handleClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    if (onNavigate) {
      onNavigate('catalogo');
    }
  };

  return (
    <nav className="bg-[#F8FAFC] text-xs font-semibold overflow-x-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 h-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleClick(cat.slug)}
                className={`whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer font-display text-xs ${
                  cat.isHighlight
                    ? 'text-[#FB8C00] font-extrabold hover:text-amber-600'
                    : cat.isPromo
                    ? 'text-red-600 font-bold hover:text-red-700'
                    : isActive
                    ? 'text-[#1863DC] font-extrabold border-b-2 border-[#1863DC]'
                    : 'text-[#585858] hover:text-[#1863DC]'
                }`}
              >
                {cat.isHighlight && <Tag className="w-3.5 h-3.5" />}
                {cat.isPromo && <Sparkles className="w-3.5 h-3.5" />}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
