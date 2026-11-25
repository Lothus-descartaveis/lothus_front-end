import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from '../ui/Icon';

interface HeroBannerProps {
  onNavigate?: (page: string) => void;
  onOpenQuickQuote?: () => void;
}

interface SingleProductShowcase {
  name: string;
  image: string;
  alt: string;
  imageClasses: string;
}

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  product: SingleProductShowcase;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    title: 'Suprimentos e descartáveis para o abastecimento do seu negócio.',
    description:
      'Linha completa em produtos de limpeza profissional, descartáveis, papelaria corporativa e itens essenciais para empresas, escolas, condomínios e comércios.',
    product: {
      name: 'Balde com Espremedor Doblô 30L Bralimpia',
      image: '/assets/hero-showcase/balde-bralimpia.png',
      alt: 'Balde Espremedor Doblô 30 Litros Bralimpia Completo',
      imageClasses: 'max-h-[230px] sm:max-h-[260px] lg:max-h-[280px] w-auto object-contain hover:scale-[1.02] transition-transform duration-300',
    },
  },
  {
    id: 1,
    title: 'Higiene e conservação profissional para a rotina da sua empresa.',
    description:
      'Equipamentos e insumos para higienização de ambientes corporativos, clínicas, condomínios e estabelecimentos comerciais.',
    product: {
      name: 'Balde Doblô 30 Litros Duas Águas Bralimpia',
      image: '/assets/hero-showcase/balde-bralimpia.png',
      alt: 'Balde Doblô 30 Litros Bralimpia',
      imageClasses: 'max-h-[230px] sm:max-h-[260px] lg:max-h-[280px] w-auto object-contain hover:scale-[1.02] transition-transform duration-300',
    },
  },
  {
    id: 2,
    title: 'Papelaria e materiais de escritório para demandas corporativas.',
    description:
      'Papéis para impressão, cadernos, marcadores e materiais para escritório com opções de faturamento faturado e reposição contínua.',
    product: {
      name: 'Papel Sulfite A4 Report 75g 500 Folhas',
      image: '/assets/hero-showcase/papel-a4.png',
      alt: 'Caixa de Papel Sulfite A4 Report',
      imageClasses: 'max-h-[200px] sm:max-h-[230px] lg:max-h-[250px] w-auto object-contain hover:scale-[1.02] transition-transform duration-300',
    },
  },
  {
    id: 3,
    title: 'Artigos para projetos, personalização e demandas escolares.',
    description:
      'Insumos selecionados e materiais de suporte para atividades pedagógicas, oficinas, eventos e trabalhos manuais.',
    product: {
      name: 'Kit com 12 Marcadores de Quadro Branco Recarregáveis',
      image: '/assets/hero-showcase/canetas-marcador.png',
      alt: 'Kit Canetas Marcador Quadro Branco',
      imageClasses: 'max-h-[200px] sm:max-h-[230px] lg:max-h-[250px] w-auto object-contain hover:scale-[1.02] transition-transform duration-300',
    },
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveTab((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentSlide = HERO_SLIDES[activeTab];

  return (
    <section className="w-full font-sans pt-4 sm:pt-6 pb-2 sm:pb-3">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Container Flutuante com Cantos Arredondados */}
        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0F668E] border border-[#0D597D] shadow-xs min-h-[360px] lg:h-[400px] group">
          {/* Seta Lateral Esquerda */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Slide anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 sm:w-10 h-16 sm:h-20 bg-white/95 border-y border-r border-white/20 rounded-r-full flex items-center justify-center text-[#0F668E] hover:text-[#0A4866] hover:bg-white transition-all duration-200 cursor-pointer focus:outline-none select-none shadow-xs"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.4] -ml-1 sm:-ml-1.5" />
          </button>

          {/* Seta Lateral Direita */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Próximo slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 sm:w-10 h-16 sm:h-20 bg-white/95 border-y border-l border-white/20 rounded-l-full flex items-center justify-center text-[#0F668E] hover:text-[#0A4866] hover:bg-white transition-all duration-200 cursor-pointer focus:outline-none select-none shadow-xs"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.4] -mr-1 sm:-mr-1.5" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center px-8 sm:px-14 lg:px-20 py-8 lg:py-0">
            <div className="w-full max-w-[1080px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
              
              {/* COLUNA ESQUERDA: Título e Parágrafo Descritivo Centralizados Verticalmente */}
              <div className="w-full lg:flex-1 max-w-[480px] flex flex-col justify-center z-10 text-left">
                <div className="grid">
                  {HERO_SLIDES.map((slide, idx) => {
                    const isActive = idx === activeTab;
                    return (
                      <div
                        key={slide.id}
                        aria-hidden={!isActive}
                        className={`col-start-1 row-start-1 space-y-4 transition-opacity duration-300 ease-out flex flex-col justify-center ${
                          isActive
                            ? 'opacity-100'
                            : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <h1 className="font-display font-semibold text-2xl sm:text-3xl lg:text-[36px] leading-[1.2] tracking-tight text-white">
                          {slide.title}
                        </h1>

                        <p className="text-base sm:text-[15px] leading-relaxed text-white/85">
                          {slide.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUNA DIREITA: Produto Alinhado à Direita, Balanceando com o Bloco de Texto à Esquerda */}
              <div
                className="w-full lg:flex-1 flex items-center justify-center lg:justify-end cursor-pointer"
                onClick={() => onNavigate && onNavigate('catalogo')}
                title="Clique para ver o catálogo"
              >
                <img
                  src={currentSlide.product.image}
                  alt={currentSlide.product.alt}
                  className={`relative z-10 ${currentSlide.product.imageClasses}`}
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Indicadores de Traço Inferiores */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/15 backdrop-blur-xs">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(idx);
                }}
                aria-label={`Ir para o slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeTab === idx
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
