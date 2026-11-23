import React, { useState, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  Search,
  Filter,
  RefreshCw,
  X,
  ArrowUpDown
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { MetricCard } from './MetricCard';

export const AdminStockManagement: React.FC = () => {
  const { products, updateProductStock, updateProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'baixo' | 'zerado' | 'adequado'>('todos');
  const [sortBy, setSortBy] = useState<'stock-asc' | 'stock-desc' | 'name'>('stock-asc');

  // Indicadores de Estoque
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => (p.stock ?? 0) > (p.minStockAlert || 15)).length;
  const lowStockCount = products.filter((p) => (p.stock ?? 0) <= (p.minStockAlert || 15) && (p.stock ?? 0) > 0).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase());

        const stock = p.stock ?? 0;
        const minAlert = p.minStockAlert || 15;

        if (statusFilter === 'baixo') return matchesSearch && stock > 0 && stock <= minAlert;
        if (statusFilter === 'zerado') return matchesSearch && stock === 0;
        if (statusFilter === 'adequado') return matchesSearch && stock > minAlert;
        return matchesSearch;
      })
      .sort((a, b) => {
        const stockA = a.stock ?? 0;
        const stockB = b.stock ?? 0;
        if (sortBy === 'stock-asc') return stockA - stockB;
        if (sortBy === 'stock-desc') return stockB - stockA;
        return a.name.localeCompare(b.name);
      });
  }, [products, search, statusFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 4 Cards de Resumo de Estoque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Produtos"
          value={totalProducts}
          comparisonLabel="cadastrados no catálogo"
          icon={Boxes}
          iconColor="text-[#041B38]"
          iconBgColor="bg-slate-100"
        />

        <MetricCard
          title="Estoque Adequado"
          value={inStockCount}
          comparisonLabel="itens com reposição em dia"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />

        <MetricCard
          title="Estoque Baixo"
          value={lowStockCount}
          comparisonLabel="abaixo do limite de segurança"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />

        <MetricCard
          title="Sem Estoque"
          value={outOfStockCount}
          comparisonLabel="itens esgotados"
          icon={Package}
          iconColor="text-rose-600"
          iconBgColor="bg-rose-50"
        />
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por produto, código SKU ou categoria..."
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

          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'todos'
                  ? 'bg-[#041B38] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({totalProducts})
            </button>
            <button
              onClick={() => setStatusFilter('baixo')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'baixo'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Estoque Baixo ({lowStockCount})
            </button>
            <button
              onClick={() => setStatusFilter('zerado')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === 'zerado'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              Esgotados ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Monitoramento & Atualização Direta de Estoque */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 font-extrabold">Item / Produto</th>
                <th className="py-3.5 px-4 font-extrabold">Categoria</th>
                <th className="py-3.5 px-4 font-extrabold">Qtd em Estoque</th>
                <th className="py-3.5 px-4 font-extrabold">Estoque Mínimo</th>
                <th className="py-3.5 px-4 font-extrabold">Status Operacional</th>
                <th className="py-3.5 px-4 font-extrabold">Última Revisão</th>
                <th className="py-3.5 px-5 font-extrabold text-right">Reposição Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const stock = prod.stock ?? 0;
                const minAlert = prod.minStockAlert || 15;
                const isLow = stock <= minAlert && stock > 0;
                const isOut = stock === 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <h4 className="font-bold text-[#041B38] truncate leading-tight">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          SKU: {prod.sku} • {prod.brand}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {prod.category}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => updateProductStock(prod.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-black text-[#041B38] text-center focus:border-[#0F668E] outline-none"
                      />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-500">
                      {minAlert} un.
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          Sem Estoque
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                          Estoque Crítico
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Regular
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {prod.updatedAt}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => updateProductStock(prod.id, stock + 20)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0F668E] hover:text-white text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                          title="Adicionar 20 unidades ao estoque"
                        >
                          +20 un
                        </button>
                        <button
                          onClick={() => updateProductStock(prod.id, stock + 50)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0F668E] hover:text-white text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                          title="Adicionar 50 unidades ao estoque"
                        >
                          +50 un
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
