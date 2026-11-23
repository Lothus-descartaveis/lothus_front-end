import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Receipt,
  Boxes,
  Clock,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Truck,
  RotateCcw,
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { MetricCard } from './MetricCard';
import { SalesAreaChart } from './SalesAreaChart';
import { CategoryDonutChart } from './CategoryDonutChart';
import { AdminOrderStatus } from '../../types/admin';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: any) => void;
  onSelectOrderDetails?: (orderId: string) => void;
}

const STATUS_BADGES: Record<AdminOrderStatus, { bg: string; text: string; icon: React.ElementType }> = {
  'Aguardando Pagamento': { bg: 'bg-amber-50 border-amber-200 text-amber-700', text: 'Aguardando Pagamento', icon: Clock },
  'Pagamento Aprovado': { bg: 'bg-blue-50 border-blue-200 text-[#1863DC]', text: 'Pagamento Aprovado', icon: CheckCircle2 },
  'Em Separação': { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', text: 'Em Separação CD', icon: Boxes },
  'Enviado': { bg: 'bg-purple-50 border-purple-200 text-purple-700', text: 'Em Transporte', icon: Truck },
  'Entregue': { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', text: 'Entregue', icon: CheckCircle2 },
  'Cancelado': { bg: 'bg-rose-50 border-rose-200 text-rose-700', text: 'Cancelado', icon: RotateCcw },
};

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onSelectOrderDetails,
}) => {
  const {
    metrics,
    salesTimeline,
    categoryPerformance,
    topSellingProducts,
    orders,
    selectedPeriod,
  } = useAdmin();

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ======================================================================
          1. CARDS DE INDICADORES PRINCIPAIS (KPIS)
          ====================================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Faturamento Total"
          value={metrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          previousValue={metrics.previousRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          percentageChange={metrics.revenueGrowth}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />

        <MetricCard
          title="Total de Pedidos"
          value={metrics.totalOrders.toLocaleString('pt-BR')}
          previousValue={metrics.previousOrders.toLocaleString('pt-BR')}
          percentageChange={metrics.ordersGrowth}
          icon={ShoppingCart}
          iconColor="text-[#0F668E]"
          iconBgColor="bg-[#0F668E]/10"
        />

        <MetricCard
          title="Ticket Médio"
          value={metrics.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          previousValue={metrics.previousTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          percentageChange={metrics.ticketGrowth}
          icon={Receipt}
          iconColor="text-[#1863DC]"
          iconBgColor="bg-[#1863DC]/10"
        />

        <MetricCard
          title="Itens Faturados"
          value={metrics.productsSold.toLocaleString('pt-BR')}
          previousValue={metrics.previousProductsSold.toLocaleString('pt-BR')}
          percentageChange={metrics.productsSoldGrowth}
          icon={Boxes}
          iconColor="text-[#FB8C00]"
          iconBgColor="bg-amber-50"
        />

        <MetricCard
          title="Pedidos Pendentes"
          value={metrics.pendingOrdersCount}
          comparisonLabel="aguardando despacho"
          icon={Clock}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />

        <MetricCard
          title="Taxa de Conversão"
          value={`${metrics.conversionRate}%`}
          percentageChange={0.4}
          comparisonLabel="conversão B2B"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </section>

      {/* ======================================================================
          2. GRÁFICOS: FATURAMENTO CRONOLÓGICO & DISTRIBUIÇÃO POR CATEGORIA
          ====================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesAreaChart data={salesTimeline} />
        </div>

        <div className="lg:col-span-4">
          <CategoryDonutChart data={categoryPerformance} />
        </div>
      </section>

      {/* ======================================================================
          3. PRODUTOS MAIS VENDIDOS & ÚLTIMOS PEDIDOS
          ====================================================================== */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* RANKING: Top Produtos Mais Vendidos */}
        <div className="xl:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-extrabold text-base text-[#041B38]">
                Produtos Mais Vendidos
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ranking dos itens com maior saída no atacado
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('mais-vendidos')}
              className="text-xs font-bold text-[#0F668E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topSellingProducts.slice(0, 5).map((prod, index) => {
              const share = metrics.totalRevenue > 0
                ? ((prod.revenueGenerated / metrics.totalRevenue) * 100).toFixed(1)
                : '0';

              return (
                <div key={prod.id} className="py-3.5 flex items-center gap-3.5 first:pt-0 last:pb-0">
                  <span className="w-6 text-center font-display font-black text-sm text-slate-400">
                    #{index + 1}
                  </span>

                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#041B38] truncate leading-tight">
                      {prod.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {prod.category} • SKU: {prod.sku}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-black text-[#041B38]">
                      {prod.salesCount} un.
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      {prod.revenueGenerated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TABELA: Últimos Pedidos Realizados */}
        <div className="xl:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-extrabold text-base text-[#041B38]">
                Últimos Pedidos Comerciais
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Movimentação recente de compras corporativas e pedidos no portal
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('pedidos')}
              className="text-xs font-bold text-[#0F668E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos os pedidos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-extrabold">Pedido</th>
                  <th className="pb-3 font-extrabold">Cliente / Razão Social</th>
                  <th className="pb-3 font-extrabold">Data</th>
                  <th className="pb-3 font-extrabold">Total</th>
                  <th className="pb-3 font-extrabold">Status</th>
                  <th className="pb-3 font-extrabold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => {
                  const badge = STATUS_BADGES[ord.status] || STATUS_BADGES['Aguardando Pagamento'];
                  const Icon = badge.icon;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#041B38]">
                        #{ord.orderNumber}
                      </td>

                      <td className="py-3 max-w-[200px]">
                        <p className="font-bold text-[#041B38] truncate leading-tight">
                          {ord.customer.nomeFantasia || ord.customer.razaoSocial}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {ord.customer.cnpjCpf}
                        </span>
                      </td>

                      <td className="py-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {ord.date.split(' ')[0]}
                      </td>

                      <td className="py-3 font-black text-[#041B38] whitespace-nowrap">
                        {ord.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      <td className="py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          <Icon className="w-3 h-3 shrink-0" />
                          <span>{badge.text}</span>
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            if (onSelectOrderDetails) {
                              onSelectOrderDetails(ord.id);
                            } else {
                              onNavigateTab('pedidos');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F668E] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Detalhes do Pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
