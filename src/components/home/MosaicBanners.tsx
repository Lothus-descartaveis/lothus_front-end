import React from 'react';
import { ArrowRight, Sparkles, Building2, Briefcase } from '../ui/Icon';

interface MosaicBannersProps {
  onNavigate?: (page: string) => void;
  onOpenQuickQuote?: () => void;
}

export const MosaicBanners: React.FC<MosaicBannersProps> = ({ onNavigate, onOpenQuickQuote }) => {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner 1: Higiene & Limpeza Profissional */}
        <div className="relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 bg-[#041B38] text-white shadow-card group">
          {/* Imagem de Fundo com Overlay */}
          <img
            src="/assets_site_atual/equipamentos-de-limpeza.jpg"
            alt="Higiene e Limpeza Profissional"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041B38] via-[#041B38]/60 to-transparent"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#FB8C00] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              ALTA EFICIÊNCIA SANITÁRIA
            </span>
            <h3 className="font-display font-black text-2xl text-white leading-tight mb-2">
              Higiene & Limpeza Profissional
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Químicos de diluição, papéis toalha interfolha, sacos de lixo industriais e dispensadores.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('catalogo')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#041B38] font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              <span>Ver todos os itens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Banner 2: Escritório & Papelaria Corporativa */}
        <div className="relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 bg-[#0F668E] text-white shadow-card group">
          <img
            src="/assets_site_atual/escritorio-papelaria.jpg"
            alt="Escritório e Papelaria Corporativa"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E4A7D] via-[#0F668E]/60 to-transparent"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white text-[#0F668E] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wider mb-3">
              <Briefcase className="w-3 h-3" />
              LINHA CORPORATIVA COMPLETA
            </span>
            <h3 className="font-display font-black text-2xl text-white leading-tight mb-2">
              Escritório & Papelaria Corporativa
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm mb-6 leading-relaxed">
              Sulfite Chamex A4/A3, pastas organizadoras, quadros magnéticos, canetas e toners.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('catalogo')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0F668E] font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
              <span>Ver todos os itens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Banner 3: Abastecimento para Empresas (B2B) */}
        <div className="relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 bg-[#121A2B] text-white shadow-card group">
          <img
            src="/assets_site_atual/produtos-para-sua-empresa.jpg"
            alt="Abastecimento para Empresas B2B"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-[#121A2B]/70 to-transparent"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#16A34A] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wider mb-3">
              <Building2 className="w-3 h-3" />
              FATURAMENTO EM ATÉ 42 DIAS
            </span>
            <h3 className="font-display font-black text-2xl text-white leading-tight mb-2">
              Abastecimento para Empresas (B2B)
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Reposição mensal programada com faturamento em boleto PJ e desconto agressivo em fardos.
            </p>
            <button
              onClick={() => onOpenQuickQuote ? onOpenQuickQuote() : onNavigate && onNavigate('cotacao-b2b')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FB8C00] hover:bg-amber-500 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <span>Solicitar Cotação B2B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
