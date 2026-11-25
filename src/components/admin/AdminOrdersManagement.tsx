import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  X,
  Clock,
  Boxes,
  Truck,
  RotateCcw,
  Receipt,
  Download,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowUpDown
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { AdminOrder, AdminOrderStatus } from '../../types/admin';

interface AdminOrdersManagementProps {
  initialSelectedOrderId?: string;
}

const ALL_STATUSES: AdminOrderStatus[] = [
  'Aguardando Pagamento',
  'Pagamento Aprovado',
  'Em Separação',
  'Enviado',
  'Entregue',
  'Cancelado',
];

const STATUS_BADGES: Record<AdminOrderStatus, { bg: string; text: string; icon: React.ElementType }> = {
  'Aguardando Pagamento': { bg: 'bg-amber-50 border-amber-200 text-amber-700', text: 'Aguardando Pagamento', icon: Clock },
  'Pagamento Aprovado': { bg: 'bg-blue-50 border-blue-200 text-[#1863DC]', text: 'Pagamento Aprovado', icon: CheckCircle2 },
  'Em Separação': { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', text: 'Em Separação CD', icon: Boxes },
  'Enviado': { bg: 'bg-purple-50 border-purple-200 text-purple-700', text: 'Em Transporte', icon: Truck },
  'Entregue': { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', text: 'Entregue', icon: CheckCircle2 },
  'Cancelado': { bg: 'bg-rose-50 border-rose-200 text-rose-700', text: 'Cancelado', icon: RotateCcw },
};

export const AdminOrdersManagement: React.FC<AdminOrdersManagementProps> = ({
  initialSelectedOrderId,
}) => {
  const { orders, updateOrderStatus } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(() => {
    if (initialSelectedOrderId) {
      return orders.find((o) => o.id === initialSelectedOrderId) || null;
    }
    return null;
  });

  // Filtragem e Ordenação
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesStatus = selectedStatus === 'todos' || o.status === selectedStatus;
        const matchesSearch =
          o.orderNumber.includes(search) ||
          o.customer.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.cnpjCpf.includes(search);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'total-desc') return b.total - a.total;
        if (sortBy === 'total-asc') return a.total - b.total;
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [orders, search, selectedStatus, sortBy]);

  const handleExportCSV = () => {
    const headers = ['Pedido', 'Data', 'Razao Social', 'CNPJ', 'Valor Total', 'Status', 'Forma Pagamento'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      o.date,
      `"${o.customer.razaoSocial}"`,
      o.customer.cnpjCpf,
      o.total.toFixed(2),
      o.status,
      `"${o.paymentMethod}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pedidos_lothus_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Barra de Filtros e Busca */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nº do pedido, razão social, CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0F668E] focus:ring-2 focus:ring-[#0F668E]/15"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ações: Exportar CSV */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#0F668E] text-slate-700 hover:text-[#0F668E] text-xs font-bold bg-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Linha 2 de Filtros: Status & Ordenação */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#0F668E]" />
              Status:
            </span>
            <button
              onClick={() => setSelectedStatus('todos')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                selectedStatus === 'todos'
                  ? 'bg-[#041B38] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({orders.length})
            </button>
            {ALL_STATUSES.map((st) => {
              const count = orders.filter((o) => o.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-[#0F668E] text-white font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer outline-none"
            >
              <option value="date-desc">Mais Recentes</option>
              <option value="date-asc">Mais Antigos</option>
              <option value="total-desc">Maior Valor</option>
              <option value="total-asc">Menor Valor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 font-extrabold">Pedido</th>
                <th className="py-3.5 px-4 font-extrabold">Cliente / Empresa</th>
                <th className="py-3.5 px-4 font-extrabold">Data / Horário</th>
                <th className="py-3.5 px-4 font-extrabold">Forma de Pagamento</th>
                <th className="py-3.5 px-4 font-extrabold">Total Faturado</th>
                <th className="py-3.5 px-4 font-extrabold">Status Atual</th>
                <th className="py-3.5 px-5 font-extrabold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Nenhum pedido localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const badge = STATUS_BADGES[ord.status] || STATUS_BADGES['Aguardando Pagamento'];
                  const Icon = badge.icon;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-[#041B38]">
                        #{ord.orderNumber}
                        {ord.nfeNumber && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            NF-e: {ord.nfeNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-[240px]">
                        <p className="font-bold text-[#041B38] truncate leading-tight">
                          {ord.customer.nomeFantasia || ord.customer.razaoSocial}
                        </p>
                        <span className="text-[11px] text-slate-400">
                          {ord.customer.cnpjCpf} • {ord.customer.city}/{ord.customer.state}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        {ord.date}
                      </td>

                      <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {ord.paymentMethod}
                      </td>

                      <td className="py-4 px-4 font-black text-sm text-[#041B38] whitespace-nowrap">
                        {ord.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {ord.itemsCount} {ord.itemsCount === 1 ? 'item' : 'itens'}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as AdminOrderStatus)}
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer outline-none ${badge.bg}`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0F668E] hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Gaveta de Detalhes do Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#FB8C00] uppercase tracking-wider">
                  Detalhes do Pedido Comercial
                </span>
                <h3 className="font-display font-black text-xl text-[#041B38]">
                  Pedido #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informações do Cliente */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Dados Cadastrais da Empresa
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Razão Social:</span>
                  <strong className="text-slate-800">{selectedOrder.customer.razaoSocial}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CNPJ:</span>
                  <strong className="text-slate-800">{selectedOrder.customer.cnpjCpf}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Contato Comercial:</span>
                  <span className="text-slate-700">{selectedOrder.customer.email} • {selectedOrder.customer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Localização:</span>
                  <span className="text-slate-700">{selectedOrder.customer.city} / {selectedOrder.customer.state}</span>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Suprimentos Solicitados
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center gap-3 bg-white">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                      <img src={it.image} alt={it.productName} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-[#041B38] truncate">{it.productName}</h5>
                      <span className="text-[10px] text-slate-400">SKU: {it.sku} • Qtd: {it.quantity} un.</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#041B38]">
                        {it.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {it.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} /un
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atualização de Status & Total */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-600">Alterar Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newSt = e.target.value as AdminOrderStatus;
                    updateOrderStatus(selectedOrder.id, newSt);
                    setSelectedOrder((prev) => prev ? { ...prev, status: newSt } : null);
                  }}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-[#041B38] outline-none"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total do Pedido Faturado:</span>
                <span className="font-display font-black text-xl text-[#041B38]">
                  {selectedOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
