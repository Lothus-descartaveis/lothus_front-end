import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { FlashOffers } from '../components/home/FlashOffers';
import { DepartmentStories } from '../components/home/DepartmentStories';
import { BenefitsBar } from '../components/home/BenefitsBar';
import { MosaicBanners } from '../components/home/MosaicBanners';
import { BestSellers } from '../components/home/BestSellers';
import { KitsB2B } from '../components/home/KitsB2B';
import { useSEO } from '../hooks/useSEO';
import { Product } from '../types';

interface HomePageProps {
  onNavigate?: (page: string) => void;
  onOpenQuickQuote?: () => void;
  onSelectCategory?: (slug: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenQuickQuote,
  onSelectCategory,
  onSelectProduct
}) => {
  useSEO({
    title: 'Distribuidora B2B de Descartáveis, Limpeza e Papelaria em SP',
    description: 'Abasteça sua empresa com preços de atacado direto da distribuidora. Descartáveis, higiene profissional e papelaria com entrega expressa para São Paulo.',
    canonical: 'https://lothusdescartaveis.com.br/',
    keywords: ['descartáveis atacado', 'distribuidora descartáveis sp', 'limpeza profissional', 'papelaria corporativa']
  });
  return (
    <main className="min-h-screen">
      {/* 1. Hero Banner Principal */}
      <HeroBanner onNavigate={onNavigate} onOpenQuickQuote={onOpenQuickQuote} />

      {/* 2. Vitrine de Ofertas / Cards de Produto Meio Aparentes (Incentiva a Rolagem) */}
      <FlashOffers onNavigate={onNavigate} onSelectProduct={onSelectProduct} />

      {/* 3. Escolha seu Desconto por Departamento (Círculos Uniformes) */}
      <DepartmentStories onSelectDepartment={onSelectCategory} />

      {/* 4. Faixa Institucional (Posicionada abaixo das categorias) */}
      <BenefitsBar />

      {/* 5. Mais Vendidos */}
      <BestSellers onNavigate={onNavigate} onSelectProduct={onSelectProduct} />

      {/* 6. Mosaico de 3 Banners Verticais */}
      <MosaicBanners onNavigate={onNavigate} onOpenQuickQuote={onOpenQuickQuote} />

      {/* 7. Kits & Combos B2B (A Dupla Perfeita) */}
      <KitsB2B />
    </main>
  );
};
