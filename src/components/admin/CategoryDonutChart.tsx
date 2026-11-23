import React, { useState } from 'react';
import { CategorySalesSummary } from '../../types/admin';

interface CategoryDonutChartProps {
  data: CategorySalesSummary[];
  title?: string;
  subtitle?: string;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  data,
  title = 'Vendas por Departamento',
  subtitle = 'Participação percentual na receita comercial',
}) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.revenue, 0) || 1;

  // Renderização em barras de progresso balanceadas e indicadores circulares
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-display font-extrabold text-base text-[#041B38]">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        {/* Barra Composta de Distribuição */}
        <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 mb-6 p-0.5 gap-0.5 shadow-inner">
          {data.map((cat) => (
            <div
              key={cat.categorySlug}
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
              }}
              title={`${cat.categoryName}: ${cat.percentage}%`}
              className={`h-full rounded-sm transition-all duration-200 cursor-pointer ${
                hoveredSlug && hoveredSlug !== cat.categorySlug ? 'opacity-40' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSlug(cat.categorySlug)}
              onMouseLeave={() => setHoveredSlug(null)}
            />
          ))}
        </div>

        {/* Lista Detalhada das Categorias Reais */}
        <div className="space-y-3.5">
          {data.map((cat) => {
            const isHovered = hoveredSlug === cat.categorySlug;

            return (
              <div
                key={cat.categorySlug}
                onMouseEnter={() => setHoveredSlug(cat.categorySlug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className={`p-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  isHovered ? 'bg-slate-50 ring-1 ring-slate-200' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-bold text-[#041B38]">{cat.categoryName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-[#041B38]">
                      {cat.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 min-w-[42px] text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
