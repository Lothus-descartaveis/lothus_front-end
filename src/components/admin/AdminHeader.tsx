import React from 'react';
import {
  Menu,
  Calendar,
  Bell,
  Search,
  RefreshCw,
  Store,
  ChevronDown,
  ShieldCheck,
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { PeriodFilter } from '../../types/admin';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  onNavigateStore?: () => void;
  pageTitle: string;
  pageSubtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  onNavigateStore,
  pageTitle,
  pageSubtitle,
}) => {
  const {
    currentAdmin,
    selectedPeriod,
    setSelectedPeriod,
    metrics,
  } = useAdmin();

  const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'ultimos-7-dias', label: 'Últimos 7 dias' },
    { value: 'ultimos-30-dias', label: 'Últimos 30 dias' },
    { value: 'este-mes', label: 'Este mês' },
    { value: 'mes-anterior', label: 'Mês anterior' },
    { value: 'ultimos-90-dias', label: 'Últimos 90 dias' },
    { value: 'este-ano', label: 'Este ano (2026)' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        {/* Lado Esquerdo: Menu Mobile + Título da Página */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-600 hover:text-[#041B38] hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Abrir menu lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-lg sm:text-xl text-[#041B38] leading-tight">
                {pageTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Operação Comercial
              </span>
            </div>
            {pageSubtitle && (
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                {pageSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Lado Direito: Filtro de Período Global + Notificações + Ações */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Seletor Global de Período */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus-within:ring-2 focus-within:ring-[#0F668E]/20 transition-all">
              <Calendar className="w-3.5 h-3.5 text-[#0F668E] shrink-0" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)}
                className="bg-transparent border-none outline-none text-xs font-bold text-[#041B38] cursor-pointer pr-1"
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Atalho: Voltar à Loja Comercial */}
          {onNavigateStore && (
            <button
              onClick={onNavigateStore}
              title="Visualizar loja Lothus"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#0F668E] hover:text-[#0F668E] text-slate-600 text-xs font-bold bg-white transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#FB8C00]" />
              <span>Ver Loja</span>
            </button>
          )}

          {/* Indicador de Pedidos Pendentes */}
          <div className="relative">
            <button
              className="p-2 rounded-xl text-slate-600 hover:text-[#041B38] hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Pedidos Pendentes"
            >
              <Bell className="w-4 h-4" />
              {metrics.pendingOrdersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FB8C00] ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>

          {/* Avatar e Perfil Administrador */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#041B38] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              {currentAdmin ? currentAdmin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-[#041B38] truncate max-w-[120px]">
                {currentAdmin?.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {currentAdmin?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
