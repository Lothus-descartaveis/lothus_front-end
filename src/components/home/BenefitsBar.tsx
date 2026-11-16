import React from 'react';
import { Building2, Layers, MapPin } from 'lucide-react';

export const BenefitsBar: React.FC = () => {
  const infoItems = [
    {
      icon: MapPin,
      title: 'REGIÃO DE ATUAÇÃO',
      subtitle: 'Atendimento e logística ágil para São Paulo, Grande SP e região.',
    },
    {
      icon: Layers,
      title: 'SEGMENTO & ATUAÇÃO',
      subtitle: 'Descartáveis, limpeza profissional, higiene e papelaria no atacado B2B e varejo.',
    },
    {
      icon: Building2,
      title: 'SOBRE A LOTHUS',
      subtitle: 'Distribuidora especializada em suprimentos corporativos e comerciais.',
    },
  ];

  return (
    <section
      aria-label="Informações institucionais da Lothus"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-8"
    >
      <div className="w-full bg-gradient-to-r from-[#0B3D66] via-[#0E4A7D] to-[#0B3D66] rounded-2xl px-6 sm:px-8 lg:px-10 py-5 sm:py-6 border border-[#145691]/80 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {infoItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 ${
                idx < infoItems.length - 1
                  ? 'md:border-r md:border-white/15 md:pr-6 lg:pr-8'
                  : ''
              }`}
            >
              <Icon className="w-8 h-8 text-white stroke-[1.8] shrink-0" />
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xs sm:text-[13px] tracking-wide text-white leading-tight">
                  {item.title}
                </span>
                <span className="text-white/85 text-xs leading-snug mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
