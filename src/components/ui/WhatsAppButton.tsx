import React, { useState } from 'react';
import { WhatsApp } from './Icon';

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl =
    'https://wa.me/5511977663741?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20Lothus%20Descart%C3%A1veis.';

  return (
    <aside
      aria-label="Atendimento Comercial WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 select-none"
    >
      {/* Tooltip: Aparece unicamente no hover do botão com o texto 'Solicitar Orçamento' */}
      <div
        className={`hidden sm:flex items-center bg-white text-[#041B38] border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-xl text-xs font-bold transition-all duration-200 pointer-events-none relative ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="whitespace-nowrap">Solicitar Orçamento</span>
        {/* Biquinho apontando para o botão */}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-t border-r border-slate-200/90 rotate-45" />
      </div>

      {/* Botão Flutuante com Símbolo Clássico do WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Solicitar Orçamento no WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA56] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group shrink-0 ring-4 ring-white/80"
      >
        {/* Efeito de pulso de atenção */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />

        {/* Símbolo clássico oficial do WhatsApp */}
        <WhatsApp className="w-8 h-8 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
      </a>
    </aside>
  );
};

export default WhatsAppButton;
