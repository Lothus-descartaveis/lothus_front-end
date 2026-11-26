import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Users,
  BarChart3,
  Settings,
  Shield,
  Layers,
  FileSpreadsheet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  X,
  Package
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';

export type AdminTab =
  // Visão geral
  | 'dashboard'
  // Comercial
  | 'pedidos'
  | 'clientes'
  | 'mais-vendidos'
  // Catálogo
  | 'produtos'
  | 'categorias'
  | 'estoque'
  // Relatórios
  | 'relatorio-vendas'
  | 'desempenho-produtos'
  | 'desempenho-comercial'
  // Sistema
  | 'usuarios'
  | 'configuracoes';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateStore?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: 'info' | 'warning';
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

interface FloatingTooltip {
  label: string;
  sublabel?: string;
  badge?: number | string;
  top: number;
  left: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigateStore,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { currentAdmin, logoutAdmin, metrics, products } = useAdmin();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState<FloatingTooltip | null>(null);

  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    setTooltip(null);
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!collapsed) {
      setTooltip(null);
    }
  }, [collapsed]);

  const showTooltip = (
    e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
    label: string,
    badge?: number | string,
    sublabel?: string
  ) => {
    if (!collapsed || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      badge,
      sublabel,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  const lowStockCount = products.filter((p) => (p.stock ?? 0) <= (p.minStockAlert || 15)).length;

  const NAV_GROUPS: NavGroup[] = [
    {
      groupTitle: 'VISÃO GERAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'COMERCIAL',
      items: [
        {
          id: 'pedidos',
          label: 'Pedidos & Vendas',
          icon: ShoppingCart,
          badge: metrics.pendingOrdersCount,
          badgeVariant: 'info',
        },
        { id: 'clientes', label: 'Clientes B2B', icon: Users },
        { id: 'mais-vendidos', label: 'Produtos Mais Vendidos', icon: BarChart3 },
      ],
    },
    {
      groupTitle: 'CATÁLOGO & SUPRIMENTOS',
      items: [
        { id: 'produtos', label: 'Produtos', icon: Boxes },
        { id: 'categorias', label: 'Departamentos', icon: Layers },
        {
          id: 'estoque',
          label: 'Controle de Estoque',
          icon: Package,
          badge: lowStockCount > 0 ? `${lowStockCount} crit.` : undefined,
          badgeVariant: 'warning',
        },
      ],
    },
    {
      groupTitle: 'RELATÓRIOS',
      items: [
        { id: 'relatorio-vendas', label: 'Relatório de Vendas', icon: FileSpreadsheet },
        { id: 'desempenho-produtos', label: 'Desempenho de Produtos', icon: BarChart3 },
        { id: 'desempenho-comercial', label: 'Desempenho Comercial', icon: BarChart3 },
      ],
    },
    {
      groupTitle: 'SISTEMA',
      items: [
        { id: 'usuarios', label: 'Usuários & Acesso', icon: Shield },
        { id: 'configuracoes', label: 'Configurações', icon: Settings },
      ],
    },
  ];

  const adminName = currentAdmin?.name || 'Administrador Lothus';
  const adminRole = currentAdmin?.role || 'Super Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#041B38]/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navegação administrativa"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } bg-white text-[#041B38] border-r border-[#E2E8F0] flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Botão Desktop de Recolher / Expandir */}
        <button
          type="button"
          onClick={handleToggleCollapse}
          onMouseEnter={(e) => showTooltip(e, collapsed ? 'Expandir menu' : 'Recolher menu')}
          onMouseLeave={hideTooltip}
          aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          className="hidden lg:flex absolute -right-3 top-6 z-50 w-6 h-6 rounded-full bg-white border border-[#E2E8F0] text-slate-400 hover:text-[#0F668E] hover:border-[#0F668E]/40 hover:bg-[#F0F7FA] items-center justify-center shadow-subtle transition-colors duration-150 cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Topo / Marca Lothus Admin */}
        <div
          className={`h-[72px] flex items-center border-b border-slate-200/80 shrink-0 transition-all duration-300 ${
            collapsed ? 'px-5 justify-between lg:justify-center lg:px-2' : 'px-5 justify-between'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-center p-1 shrink-0">
              <img
                src="/assets/logo-lothus-header.png"
                alt="Lothus Admin"
                className="h-full w-full object-contain"
              />
            </div>
            <div className={`flex flex-col min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <span className="font-display font-black text-base tracking-wide text-[#041B38] leading-tight truncate">
                LOTHUS
              </span>
              <span className="text-[10px] font-bold text-[#0F668E] uppercase tracking-wider leading-tight truncate">
                Painel Administrativo
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Fechar menu lateral"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#041B38] hover:bg-slate-100 lg:hidden cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Perfil do Administrador */}
        <div className="px-3 py-3 border-b border-slate-100 shrink-0">
          <div
            tabIndex={collapsed ? 0 : -1}
            onMouseEnter={(e) => showTooltip(e, adminName, undefined, adminRole)}
            onMouseLeave={hideTooltip}
            onFocus={(e) => showTooltip(e, adminName, undefined, adminRole)}
            onBlur={hideTooltip}
            className={`flex items-center gap-2.5 rounded-xl transition-colors duration-150 ${
              collapsed
                ? 'px-2.5 py-2 bg-slate-50/90 border border-slate-200/70 lg:justify-center lg:px-0 lg:py-1 lg:bg-transparent lg:border-transparent'
                : 'px-2.5 py-2 bg-slate-50/90 border border-slate-200/70'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#041B38] text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
              {adminInitial}
            </div>
            <div className={`flex-1 min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="text-xs font-bold text-[#041B38] truncate leading-tight">
                {adminName}
              </p>
              <span className="inline-block text-[10px] font-semibold text-[#0F668E] leading-tight mt-0.5 truncate">
                {adminRole}
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Navegação por Grupos */}
        <nav
          onScroll={hideTooltip}
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-5"
        >
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Divisor discreto quando recolhida no desktop */}
              {gIdx > 0 && collapsed && (
                <div className="hidden lg:block h-px bg-slate-100 mx-2 my-2" />
              )}

              <span
                className={`block px-3 pb-1 text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group.groupTitle}
              </span>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentTab === item.id;
                  const isWarning = item.badgeVariant === 'warning';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                        hideTooltip();
                      }}
                      onMouseEnter={(e) => showTooltip(e, item.label, item.badge)}
                      onMouseLeave={hideTooltip}
                      onFocus={(e) => showTooltip(e, item.label, item.badge)}
                      onBlur={hideTooltip}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors duration-150 cursor-pointer ${
                        collapsed ? 'lg:justify-center lg:px-0 lg:w-11 lg:h-10 lg:mx-auto' : ''
                      } ${
                        isActive
                          ? 'bg-[#E7EDF7] text-[#041B38] font-bold'
                          : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#041B38]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <IconComponent
                          className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                            isActive
                              ? 'text-[#0F668E]'
                              : 'text-slate-400 group-hover:text-[#0F668E]'
                          }`}
                        />
                        <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>
                          {item.label}
                        </span>
                      </div>

                      {/* Badge expandido */}
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                            collapsed ? 'lg:hidden' : ''
                          } ${
                            isWarning
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                              : isActive
                              ? 'bg-[#0F668E] text-white'
                              : 'bg-[#E7EDF7] text-[#041B38]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Indicador compacto quando recolhido */}
                      {item.badge !== undefined && collapsed && (
                        <span
                          className={`hidden lg:block absolute top-1.5 right-2 w-2 h-2 rounded-full ring-2 ring-white ${
                            isWarning ? 'bg-[#FB8C00]' : 'bg-[#0F668E]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Rodapé da Sidebar: Acessar Loja & Encerrar Sessão */}
        <div className="p-3 border-t border-slate-200/80 space-y-1.5 bg-white shrink-0">
          {onNavigateStore && (
            <button
              type="button"
              onClick={onNavigateStore}
              onMouseEnter={(e) => showTooltip(e, 'Acessar Loja Lothus')}
              onMouseLeave={hideTooltip}
              onFocus={(e) => showTooltip(e, 'Acessar Loja Lothus')}
              onBlur={hideTooltip}
              aria-label="Acessar Loja Lothus"
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#E7EDF7]/60 text-[#041B38] border border-slate-200 hover:border-[#0F668E]/30 text-xs font-bold transition-colors duration-150 cursor-pointer ${
                collapsed ? 'lg:w-11 lg:h-10 lg:px-0 lg:mx-auto' : ''
              }`}
            >
              <Store className="w-4 h-4 text-[#0F668E] shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>Acessar Loja Lothus</span>
            </button>
          )}

          <button
            type="button"
            onClick={logoutAdmin}
            onMouseEnter={(e) => showTooltip(e, 'Encerrar Sessão')}
            onMouseLeave={hideTooltip}
            onFocus={(e) => showTooltip(e, 'Encerrar Sessão')}
            onBlur={hideTooltip}
            aria-label="Encerrar Sessão"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
              collapsed ? 'lg:w-11 lg:h-10 lg:px-0 lg:mx-auto' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Tooltip Flutuante para Sidebar Recolhida (Desktop) */}
      {collapsed && tooltip && (
        <div
          role="tooltip"
          style={{ top: tooltip.top, left: tooltip.left }}
          className="fixed z-[70] pointer-events-none -translate-y-1/2 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#041B38] text-white text-xs font-semibold shadow-card whitespace-nowrap"
        >
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#041B38] rotate-45" />
          <span className="relative">{tooltip.label}</span>
          {tooltip.sublabel && (
            <span className="relative text-[10px] font-medium text-slate-300 border-l border-white/15 pl-2">
              {tooltip.sublabel}
            </span>
          )}
          {tooltip.badge !== undefined && (
            <span className="relative text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0F668E] text-white">
              {tooltip.badge}
            </span>
          )}
        </div>
      )}
    </>
  );
};
