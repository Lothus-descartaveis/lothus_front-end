import React from 'react';
import { DEPARTMENTS } from '../../data/mockData';
import { Sparkles, Utensils, Briefcase, Wrench, Palette } from '../ui/Icon';

interface DepartmentStoriesProps {
  onSelectDepartment?: (slug: string) => void;
}

export const DepartmentStories: React.FC<DepartmentStoriesProps> = ({ onSelectDepartment }) => {
  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    Utensils,
    Briefcase,
    Wrench,
    Palette
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-10 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
        <div>
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#041B38]">
            Categorias de Suprimentos
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Selecione o segmento e consulte produtos e condições comerciais para o seu estabelecimento
          </p>
        </div>
      </div>

      {/* Círculos Uniformes de Departamentos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
        {DEPARTMENTS.map((dept) => {
          const Icon = iconMap[dept.iconName] || Sparkles;

          return (
            <div
              key={dept.id}
              onClick={() => onSelectDepartment && onSelectDepartment(dept.slug)}
              className="flex flex-col items-center group cursor-pointer w-full max-w-[200px] text-center select-none"
            >
              {/* Círculo Uniforme (124px x 124px) */}
              <div className="w-[124px] h-[124px] rounded-full bg-white border-[2.5px] border-[#0F668E] shadow-sm flex flex-col items-center justify-center p-3 gap-1 hover:border-[#041B38] transition-colors duration-200">
                <Icon className="w-8 h-8 text-[#041B38] group-hover:text-[#0F668E] transition-colors" />
                <span className="font-display font-black text-xs text-[#FB8C00] tracking-tight">
                  {dept.discountBadge}
                </span>
              </div>

              {/* Título do Departamento */}
              <span className="font-display font-bold text-sm text-[#041B38] mt-3 group-hover:text-[#0F668E] transition-colors leading-tight min-h-[36px] flex items-center justify-center">
                {dept.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
