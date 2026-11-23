import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Eye,
  CheckCircle2,
  Download,
  ArrowUpDown
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { CustomerStats } from '../../types/admin';

export const AdminCustomersManagement: React.FC = () => {
  const { customers, orders } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Ativo' | 'Em Análise'>('todos');
  const [sortBy, setSortBy] = useState<'total-desc' | 'orders-desc' | 'name'>('total-desc');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerStats | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
          c.cnpjCpf.includes(search) ||
          c.email.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'total-desc') return b.totalSpent - a.totalSpent;
        if (sortBy === 'orders-desc') return b.ordersCount - a.ordersCount;
        return a.razaoSocial.localeCompare(b.razaoSocial);
      });
  }, [customers, search, statusFilter, sortBy]);

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.customer.cnpjCpf === selectedCustomer.cnpjCpf ||
        o.customer.email.toLowerCase() === selectedCustomer.email.toLowerCase()
    );
  }, [selectedCustomer, orders]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Filtros e Busca */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por razão social, comprador, CNPJ ou e-mail..."
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

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer outline-none"
            >
              <option value="total-desc">Maior Faturamento</option>
              <option value="orders-desc">Mais Pedidos</option>
              <option value="name">Razão Social (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Clientes Corporativos */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 font-extrabold">Razão Social / CNPJ</th>
                <th className="py-3.5 px-4 font-extrabold">Comprador Responsável</th>
                <th className="py-3.5 px-4 font-extrabold">Contato Direto</th>
                <th className="py-3.5 px-4 font-extrabold">Pedidos Realizados</th>
                <th className="py-3.5 px-4 font-extrabold">Total Acumulado</th>
                <th className="py-3.5 px-4 font-extrabold">Última Compra</th>
                <th className="py-3.5 px-5 font-extrabold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 max-w-xs">
                    <p className="font-bold text-[#041B38] truncate leading-tight">
                      {cust.razaoSocial}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      CNPJ: {cust.cnpjCpf}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {cust.name}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="block text-slate-700">{cust.email}</span>
                    <span className="text-[10px] text-slate-400">{cust.phone}</span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-black text-[#041B38]">
                      {cust.ordersCount} pedidos
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-sm text-[#041B38] whitespace-nowrap">
                    {cust.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>

                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                    {cust.lastOrderDate}
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0F668E] hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Histórico</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Histórico do Cliente */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#0F668E] uppercase tracking-wider">
                  Ficha do Cliente PJ
                </span>
                <h3 className="font-display font-black text-xl text-[#041B38]">
                  {selectedCustomer.razaoSocial}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">CNPJ Cadastral:</span>
                <strong className="text-slate-800 font-mono">{selectedCustomer.cnpjCpf}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Comprador(a):</span>
                <strong className="text-slate-800">{selectedCustomer.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">E-mail Contábil/Comercial:</span>
                <span className="text-slate-700">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Telefone de Contato:</span>
                <span className="text-slate-700">{selectedCustomer.phone}</span>
              </div>
            </div>

            {/* Pedidos Recentes do Cliente */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Histórico Recente de Compras no Portal
              </h4>
              {customerOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Nenhum pedido recente registrado no sistema para este cliente.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3.5 flex items-center justify-between bg-white text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#041B38]">Pedido #{ord.orderNumber}</span>
                        <span className="text-slate-400 block text-[10px]">{ord.date} • {ord.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-[#041B38] block">
                          {ord.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-[10px] font-bold text-[#0F668E]">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
