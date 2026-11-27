import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminDashboardOverview } from '../components/admin/AdminDashboardOverview';
import { AdminOrdersManagement } from '../components/admin/AdminOrdersManagement';
import { AdminProductsManagement } from '../components/admin/AdminProductsManagement';
import { AdminStockManagement } from '../components/admin/AdminStockManagement';
import { AdminCustomersManagement } from '../components/admin/AdminCustomersManagement';
import { AdminReportsView } from '../components/admin/AdminReportsView';
import { AdminSettingsAndUsers } from '../components/admin/AdminSettingsAndUsers';
import { useSEO } from '../hooks/useSEO';
import { Lock, Shield, ArrowRight } from '../components/ui/Icon';

interface AdminDashboardPageProps {
  onNavigateStore: () => void;
  initialTab?: AdminTab;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateStore,
  initialTab = 'dashboard',
}) => {
  useSEO({
    title: 'Painel Administrativo B2B | Lothus Descartáveis',
    description: 'Gestão comercial, controle de pedidos corporativos, catálogo de suprimentos e inteligência de vendas da Lothus Descartáveis.',
    canonical: 'https://lothusdescartaveis.com.br/admin',
  });

  const {
    currentAdmin,
    isAdminAuthenticated,
    loginAdmin,
    selectedPeriod,
  } = useAdmin();

  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedOrderIdForDetail, setSelectedOrderIdForDetail] = useState<string | undefined>();

  // Tela de Login Administrativo (se não autenticado)
  const [loginEmail, setLoginEmail] = useState('admin@lothusdescartaveis.com.br');
  const [loginPass, setLoginPass] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAdmin(loginEmail, loginPass);
    if (!res.ok) {
      setLoginError(res.error || 'Falha na autenticação administrativa.');
    } else {
      setLoginError('');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#041B38] flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#0F668E]/10 rounded-2xl flex items-center justify-center mx-auto text-[#0F668E]">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-display font-black text-2xl text-[#041B38]">
              Acesso Administrativo Lothus
            </h1>
            <p className="text-xs text-slate-500">
              Entre com suas credenciais corporativas autorizadas
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">E-mail Administrativo</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E] text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Senha de Acesso</label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E] text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Acessar Painel Lothus</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onNavigateStore}
              className="text-xs font-bold text-slate-500 hover:text-[#0F668E] transition-colors"
            >
              ← Voltar para a Loja Virtual
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Título e Subtítulo dinâmicos por aba
  const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
    'dashboard': {
      title: 'Visão Geral do E-commerce',
      subtitle: 'Indicadores de faturamento, pedidos e desempenho do negócio',
    },
    'pedidos': {
      title: 'Gestão de Pedidos & Faturamento B2B',
      subtitle: 'Acompanhamento do ciclo de pedidos, emissão e status de entrega',
    },
    'clientes': {
      title: 'Clientes Cadastrados & Compradores B2B',
      subtitle: 'Controle de contas PJ, limites de crédito e histórico de pedidos',
    },
    'mais-vendidos': {
      title: 'Ranking dos Produtos Mais Vendidos',
      subtitle: 'Curva de saída de estoque e demanda por suprimento',
    },
    'produtos': {
      title: 'Catálogo de Produtos & Suprimentos',
      subtitle: 'Cadastro, edição de preços e disponibilidade de itens da loja',
    },
    'categorias': {
      title: 'Departamentos e Linhas Comerciais',
      subtitle: 'Estruturação dos setores de suprimentos corporativos',
    },
    'estoque': {
      title: 'Controle e Monitoramento de Estoque',
      subtitle: 'Gestão de estoque mínimo, reposição ágil e prevenção de ruptura',
    },
    'relatorio-vendas': {
      title: 'Relatório Consolidado de Vendas',
      subtitle: 'Demonstrativo contábil e comercial por período',
    },
    'desempenho-produtos': {
      title: 'Desempenho Comercial de Produtos',
      subtitle: 'Volume de vendas e rentabilidade por linha de itens',
    },
    'desempenho-comercial': {
      title: 'Evolução Comercial B2B',
      subtitle: 'Métricas de escala e crescimento da carteira corporativa',
    },
    'usuarios': {
      title: 'Usuários e Permissões Administrativas',
      subtitle: 'Gestão de operadores, gerentes e administradores autorizados',
    },
    'configuracoes': {
      title: 'Configurações do Sistema e da Loja',
      subtitle: 'Parâmetros de entrega, frete, pedido mínimo e dados da empresa',
    },
  };

  const { title, subtitle } = TAB_TITLES[currentTab] || TAB_TITLES['dashboard'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      {/* 1. Sidebar Administrativa Lateral */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedOrderIdForDetail(undefined);
          setCurrentTab(tab);
        }}
        onNavigateStore={onNavigateStore}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Área Principal de Conteúdo */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Header Superior Fixo */}
        <AdminHeader
          pageTitle={title}
          pageSubtitle={subtitle}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateStore={onNavigateStore}
        />

        {/* Conteúdo Dinâmico por Aba */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1600px] w-full mx-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardOverview
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectOrderDetails={(orderId) => {
                setSelectedOrderIdForDetail(orderId);
                setCurrentTab('pedidos');
              }}
            />
          )}

          {currentTab === 'pedidos' && (
            <AdminOrdersManagement initialSelectedOrderId={selectedOrderIdForDetail} />
          )}

          {currentTab === 'clientes' && <AdminCustomersManagement />}

          {currentTab === 'mais-vendidos' && (
            <AdminReportsView type="produtos" />
          )}

          {currentTab === 'produtos' && <AdminProductsManagement />}

          {currentTab === 'categorias' && (
            <AdminReportsView type="comercial" />
          )}

          {currentTab === 'estoque' && <AdminStockManagement />}

          {currentTab === 'relatorio-vendas' && (
            <AdminReportsView type="vendas" />
          )}

          {currentTab === 'desempenho-produtos' && (
            <AdminReportsView type="produtos" />
          )}

          {currentTab === 'desempenho-comercial' && (
            <AdminReportsView type="comercial" />
          )}

          {currentTab === 'usuarios' && <AdminSettingsAndUsers view="usuarios" />}

          {currentTab === 'configuracoes' && <AdminSettingsAndUsers view="configuracoes" />}
        </main>
      </div>
    </div>
  );
};
