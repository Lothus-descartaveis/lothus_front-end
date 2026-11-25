import React, { useState } from 'react';
import { SalesReportDay } from '../../types/admin';

interface SalesAreaChartProps {
  data: SalesReportDay[];
  title?: string;
  subtitle?: string;
}

export const SalesAreaChart: React.FC<SalesAreaChartProps> = ({
  data,
  title = 'Evolução de Faturamento Comercial',
  subtitle = 'Acompanhamento cronológico de vendas faturadas no período',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center text-slate-400">
        Nenhum dado disponível para o período selecionado.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.previousRevenue || 0))) * 1.15 || 1000;
  const height = 240;
  const width = 760;
  const paddingX = 40;
  const paddingY = 24;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Gerador de pontos para SVG
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.revenue / maxVal) * chartHeight;
    return { x, y, data: d };
  });

  const prevPoints = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const prevRev = d.previousRevenue || d.revenue * 0.85;
    const y = height - paddingY - (prevRev / maxVal) * chartHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const prevPathD = prevPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const hoveredItem = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
      {/* Cabeçalho do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-display font-extrabold text-base text-[#041B38]">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0F668E]" />
            <span className="text-slate-700">Período Atual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-300 border-dashed" />
            <span className="text-slate-400">Período Anterior</span>
          </div>
        </div>
      </div>

      {/* Área do Gráfico SVG Interativo */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="lothusRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F668E" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0F668E" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Linhas de Grade Horizontais */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = height - paddingY - pct * chartHeight;
            const gridVal = Math.round(pct * maxVal);
            return (
              <g key={pct}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  R$ {gridVal >= 1000 ? `${Math.round(gridVal / 1000)}k` : gridVal}
                </text>
              </g>
            );
          })}

          {/* Área preenchida do período atual */}
          <path d={areaD} fill="url(#lothusRevenueGradient)" />

          {/* Linha tracejada do período anterior */}
          <path
            d={prevPathD}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Linha principal sólida do período atual */}
          <path
            d={pathD}
            fill="none"
            stroke="#0F668E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Marcadores e pontos interativos */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 3.5}
                className={`transition-all duration-150 ${
                  hoveredIndex === idx
                    ? 'fill-[#FB8C00] stroke-white stroke-2'
                    : 'fill-[#0F668E] stroke-white stroke-1'
                }`}
              />

              {/* Linha vertical ao focar */}
              {hoveredIndex === idx && (
                <line
                  x1={p.x}
                  y1={paddingY}
                  x2={p.x}
                  y2={height - paddingY}
                  stroke="#FB8C00"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}

              {/* Rótulo da data no eixo X */}
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                className={`text-[10px] font-medium transition-colors ${
                  hoveredIndex === idx ? 'fill-[#041B38] font-bold' : 'fill-slate-400'
                }`}
              >
                {p.data.dayLabel}
              </text>
            </g>
          ))}
        </svg>

        {/* Tooltip Dinâmico */}
        {hoveredItem && (
          <div
            className="absolute z-20 pointer-events-none bg-[#041B38] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${(hoveredItem.x / width) * 100}%`,
              top: `${(hoveredItem.y / height) * 100}%`,
            }}
          >
            <div className="font-bold text-slate-300 border-b border-white/10 pb-1 flex justify-between gap-3">
              <span>{hoveredItem.data.dayLabel}</span>
              <span className="text-[#FB8C00] font-black">{hoveredItem.data.ordersCount} pedidos</span>
            </div>
            <div className="pt-0.5">
              <span className="text-slate-400 block text-[10px]">Faturamento do dia:</span>
              <span className="font-display font-black text-sm text-white">
                {hoveredItem.data.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            {hoveredItem.data.previousRevenue && (
              <div className="text-[10px] text-slate-400">
                Anterior: {hoveredItem.data.previousRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
