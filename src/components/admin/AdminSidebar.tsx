import React from 'react';
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
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigateStore,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentAdmin, logoutAdmin, metrics, products } = useAdmin();

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
        { id: 'pedidos', label: 'Pedidos & Vendas', icon: ShoppingCart, badge: metrics.pendingOrdersCount },
        { id: 'clientes', label: 'Clientes B2B', icon: Users },
        { id: 'mais-vendidos', label: 'Produtos Mais Vendidos', icon: BarChart3 },
      ],
    },
    {
      groupTitle: 'CATÁLOGO & SUPRIMENTOS',
      items: [
        { id: 'produtos', label: 'Produtos', icon: Boxes },
        { id: 'categorias', label: 'Departamentos', icon: Layers },
        { id: 'estoque', label: 'Controle de Estoque', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} crit.` : undefined },
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

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#041B38] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Topo / Marca Lothus Admin */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-lothus-header.png"
              alt="Lothus Admin"
              className="h-10 w-auto object-contain bg-white rounded-md p-1"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wide text-white leading-tight">
                LOTHUS
              </span>
              <span className="text-[10px] font-bold text-[#FB8C00] uppercase tracking-wider">
                Painel Administrativo
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações do Administrador Conectado */}
        <div className="px-5 py-4 bg-[#0A264A] border-b border-white/5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F668E] to-[#1863DC] flex items-center justify-center font-bold text-sm text-white shadow-inner">
            {currentAdmin ? currentAdmin.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">
              {currentAdmin?.name || 'Administrador Lothus'}
            </p>
            <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full mt-0.5 border border-emerald-500/20">
              {currentAdmin?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        {/* Lista de Navegação por Grupos */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                {group.groupTitle}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#0F668E] text-white shadow-md shadow-[#0F668E]/30 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-[#FB8C00]' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white text-[#041B38]'
                              : 'bg-[#FB8C00] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé da Sidebar: Ir para a Loja & Desconectar */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#03152C] shrink-0">
          {onNavigateStore && (
            <button
              onClick={onNavigateStore}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#FB8C00]" />
              <span>Acessar Loja Lothus</span>
            </button>
          )}

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>
    </>
  );
};
