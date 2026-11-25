import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Boxes,
  TrendingUp,
  Receipt
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { SalesAreaChart } from './SalesAreaChart';
import { CategoryDonutChart } from './CategoryDonutChart';
import { MetricCard } from './MetricCard';

interface AdminReportsViewProps {
  type: 'vendas' | 'produtos' | 'comercial';
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({ type }) => {
  const { metrics, salesTimeline, categoryPerformance, topSellingProducts, products, orders } = useAdmin();

  const handleExportReportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `relatorio_${type}_lothus.csv`;

    if (type === 'vendas' || type === 'comercial') {
      headers = ['Data', 'Faturamento (R$)', 'Pedidos Faturados', 'Periodo Anterior (R$)'];
      rows = salesTimeline.map((d) => [d.date, d.revenue.toFixed(2), d.ordersCount, (d.previousRevenue || 0).toFixed(2)]);
    } else {
      headers = ['Produto', 'SKU', 'Departamento', 'Unidades Vendidas', 'Receita Gerada (R$)', 'Estoque'];
      rows = topSellingProducts.map((p) => [
        `"${p.name}"`,
        p.sku,
        `"${p.category}"`,
        p.salesCount,
        p.revenueGenerated.toFixed(2),
        p.stock ?? 0,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Topo do Relatório & Exportação */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F668E] bg-[#0F668E]/10 px-2.5 py-1 rounded-md">
            Módulo de Inteligência Comercial
          </span>
          <h2 className="font-display font-black text-xl text-[#041B38] mt-2">
            {type === 'vendas' && 'Relatório Detalhado de Vendas & Faturamento'}
            {type === 'produtos' && 'Desempenho Comercial de Produtos & Curva ABC'}
            {type === 'comercial' && 'Evolução Comercial & Análise de Demanda B2B'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas auditadas com base nos pedidos faturados e movimentação de estoque
          </p>
        </div>

        <button
          onClick={handleExportReportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F668E] hover:bg-[#0B4F6E] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório (CSV)</span>
        </button>
      </div>

      {/* Seção 1: Indicadores do Relatório */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Faturamento Consolidado"
          value={metrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          percentageChange={metrics.revenueGrowth}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
        <MetricCard
          title="Pedidos Emitidos"
          value={metrics.totalOrders}
          percentageChange={metrics.ordersGrowth}
          icon={ShoppingCart}
          iconColor="text-[#0F668E]"
          iconBgColor="bg-[#0F668E]/10"
        />
        <MetricCard
          title="Ticket Médio B2B"
          value={metrics.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          percentageChange={metrics.ticketGrowth}
          icon={Receipt}
          iconColor="text-[#1863DC]"
          iconBgColor="bg-[#1863DC]/10"
        />
        <MetricCard
          title="Itens Faturados"
          value={metrics.productsSold}
          percentageChange={metrics.productsSoldGrowth}
          icon={Boxes}
          iconColor="text-[#FB8C00]"
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* Seção 2: Visualização Gráfica */}
      {(type === 'vendas' || type === 'comercial') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SalesAreaChart data={salesTimeline} />
          </div>
          <div className="lg:col-span-4">
            <CategoryDonutChart data={categoryPerformance} />
          </div>
        </div>
      )}

      {/* Seção 3: Tabela Detalhada do Relatório */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="font-display font-extrabold text-base text-[#041B38]">
          {type === 'produtos' ? 'Detalhamento por Item de Suprimento' : 'Demonstrativo Diário de Vendas'}
        </h3>

        <div className="overflow-x-auto">
          {type === 'produtos' ? (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3 font-extrabold">Item / Produto</th>
                  <th className="pb-3 font-extrabold">Departamento</th>
                  <th className="pb-3 font-extrabold">Qtd Comercializada</th>
                  <th className="pb-3 font-extrabold">Preço Unitário</th>
                  <th className="pb-3 font-extrabold">Receita Gerada</th>
                  <th className="pb-3 font-extrabold">Estoque Remanescente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSellingProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-[#041B38] max-w-xs truncate">
                      {p.name}
                      <span className="block text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                    </td>
                    <td className="py-3 text-slate-600">{p.category}</td>
                    <td className="py-3 font-black text-[#041B38]">{p.salesCount} un.</td>
                    <td className="py-3 text-slate-600">
                      {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3 font-black text-emerald-600">
                      {p.revenueGenerated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3 text-slate-700 font-medium">{p.stock ?? 0} un.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3 font-extrabold">Data de Fechamento</th>
                  <th className="pb-3 font-extrabold">Pedidos Faturados</th>
                  <th className="pb-3 font-extrabold">Faturamento Realizado</th>
                  <th className="pb-3 font-extrabold">Ticket Médio do Dia</th>
                  <th className="pb-3 font-extrabold">Variação vs. Anterior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesTimeline.map((d, i) => {
                  const dayTicket = d.ordersCount > 0 ? d.revenue / d.ordersCount : 0;
                  const prev = d.previousRevenue || d.revenue * 0.9;
                  const growth = +(((d.revenue - prev) / prev) * 100).toFixed(1);

                  return (
                    <tr key={i} className="hover:bg-slate-50/70">
                      <td className="py-3 font-bold text-[#041B38] font-mono">{d.date} ({d.dayLabel})</td>
                      <td className="py-3 text-slate-700 font-medium">{d.ordersCount} pedidos</td>
                      <td className="py-3 font-black text-[#041B38]">
                        {d.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 text-slate-600">
                        {dayTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 font-bold">
                        <span className={growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {growth >= 0 ? `+${growth}%` : `${growth}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
