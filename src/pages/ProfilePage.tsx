import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  User,
} from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BEST_SELLER_PRODUCTS, FLASH_PRODUCTS } from '../data/mockData';
import { useSEO } from '../hooks/useSEO';
import { CorporateOrder, Product } from '../types';

export type ProfileTab =
  | 'visao-geral'
  | 'pedidos'
  | 'recompra';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
  initialTab?: ProfileTab;
}

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const ALL_CATALOG_PRODUCTS: Product[] = [...FLASH_PRODUCTS, ...BEST_SELLER_PRODUCTS];

const RECURRING_ESSENTIALS: Product[] = [
  FLASH_PRODUCTS[0], // Chamex A4
  BEST_SELLER_PRODUCTS[1], // Santher Eco ET100
  FLASH_PRODUCTS[1], // Copo EcoCoppo 200ml
  BEST_SELLER_PRODUCTS[0], // Caneta BIC Azul 50 un
  FLASH_PRODUCTS[2], // Kit Bralimpia 30L
].filter(Boolean);

const ORDER_STEPS = [
  'Pedido Recebido',
  'Separação CD',
  'NF-e Emitida',
  'Em Transporte',
  'Entregue',
];

const getStepIndex = (status: CorporateOrder['status']) => {
  switch (status) {
    case 'Em Separação':
      return 1;
    case 'Faturado • NF-e Emitida':
      return 2;
    case 'Em Transporte':
      return 3;
    case 'Entregue':
      return 4;
    default:
      return 0;
  }
};

/** Returns Tailwind color classes for each order status */
const getStatusColors = (status: CorporateOrder['status']) => {
  switch (status) {
    case 'Em Separação':
      return {
        badge: 'bg-amber-50 text-amber-700 border border-amber-200',
        border: 'border-l-amber-400',
      };
    case 'Faturado • NF-e Emitida':
      return {
        badge: 'bg-blue-50 text-blue-700 border border-blue-200',
        border: 'border-l-blue-400',
      };
    case 'Em Transporte':
      return {
        badge: 'bg-orange-50 text-orange-700 border border-orange-200',
        border: 'border-l-orange-400',
      };
    case 'Entregue':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        border: 'border-l-emerald-400',
      };
    default:
      return {
        badge: 'bg-slate-50 text-slate-600 border border-slate-200',
        border: 'border-l-slate-300',
      };
  }
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  initialTab = 'visao-geral',
}) => {
  const {
    user,
    loginDemoCorporate,
    logout,
  } = useAuth();
  const { addItem, setIsDrawerOpen } = useCart();

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [feedbackBanner, setFeedbackBanner] = useState<string>('');

  // Orders filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'todos' | 'andamento' | 'entregues'>('todos');
  const [nfeModalOrder, setNfeModalOrder] = useState<CorporateOrder | null>(null);

  // Address dropdown state
  const [openAddressMenu, setOpenAddressMenu] = useState<number | null>(null);

  // Recompra quantities
  const [recompraQty, setRecompraQty] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    RECURRING_ESSENTIALS.forEach((p) => {
      map[p.id] = p.id === 'copos-descartaveis-ecocoppo-200ml' ? 10 : 2;
    });
    return map;
  });

  useSEO({
    title: user
      ? `Meu Perfil Corporativo | ${user.buyerName || user.razaoSocial} | Lothus Descartáveis`
      : 'Meu Perfil Corporativo | Lothus Descartáveis',
    description:
      'Meu Perfil Corporativo e Central do Cliente Lothus Descartáveis. Informações pessoais, dados fiscais, unidades de entrega e gestão de compras.',
    canonical: 'https://lothusdescartaveis.com.br/minha-conta',
  });

  const showNotice = (msg: string) => {
    setFeedbackBanner(msg);
    setTimeout(() => setFeedbackBanner(''), 4000);
  };

  const handleRepeatOrder = (order: CorporateOrder) => {
    order.items.forEach((item) => {
      const found = ALL_CATALOG_PRODUCTS.find((p) => p.id === item.productId || p.sku === item.sku);
      const productToAdd: Product = found || {
        id: item.productId,
        name: item.name,
        category: 'Fornecimento B2B',
        categorySlug: 'limpeza-e-higiene',
        price: item.unitPrice,
        discountPixPercent: 5,
        installmentsMax: 3,
        image: item.image,
        rating: 5,
        reviewsCount: 1,
        sku: item.sku,
        brand: 'Lothus B2B',
        unit: item.unit,
      };
      addItem(productToAdd, item.quantity);
    });
    setIsDrawerOpen(true);
    showNotice(`Itens do pedido ${order.id} adicionados ao carrinho para recompra.`);
  };

  const handleAddAllRecompra = () => {
    RECURRING_ESSENTIALS.forEach((prod) => {
      const qty = recompraQty[prod.id] || 1;
      if (qty > 0) {
        addItem(prod, qty);
      }
    });
    setIsDrawerOpen(true);
    showNotice('Lista de reposição mensal adicionada ao carrinho.');
  };

  const filteredOrders = useMemo(() => {
    if (!user) return [];
    return user.orders.filter((ord) => {
      const matchesStatus =
        orderStatusFilter === 'todos'
          ? true
          : orderStatusFilter === 'entregues'
          ? ord.status === 'Entregue'
          : ord.status !== 'Entregue';
      const q = orderSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        ord.id.toLowerCase().includes(q) ||
        ord.items.some(
          (i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
        );
      return matchesStatus && matchesQuery;
    });
  }, [user, orderStatusFilter, orderSearch]);

  if (!user) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 sm:p-10 shadow-xs">
          <Building2 className="w-10 h-10 text-[#0F668E] mx-auto mb-4" />
          <h1 className="font-display font-bold text-xl text-[#041B38] mb-2">
            Acesse seu Perfil Corporativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Conecte-se para visualizar suas informações pessoais, endereços cadastrados, pedidos e dados fiscais.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              className="px-6 py-2.5 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Ir para Login
            </button>
            <button
              type="button"
              onClick={() => loginDemoCorporate()}
              className="px-6 py-2.5 border border-[#0F668E] text-[#0F668E] hover:bg-[#0F668E]/5 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Acessar Perfil (José Antonio)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] pb-16 font-sans text-slate-800"
      onClick={() => openAddressMenu !== null && setOpenAddressMenu(null)}
    >
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 py-8 space-y-0">

        {/* ===================================================================
            1. BREADCRUMB
            =================================================================== */}
        <div className="flex items-center gap-2 text-[13px] pb-6">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="font-medium text-[#0F668E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Voltar para Início
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-[#041B38]">Meu Perfil Corporativo</span>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
        )}

        {/* ===================================================================
            2. HEADER DO PERFIL — EXATAMENTE CONFORME O DESIGN DO PAPER
            =================================================================== */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-7 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Oficial com Gradiente e Borda 3px Branca */}
            <div
              className="flex items-center justify-center shrink-0 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-[68px] h-[68px]"
              style={{ backgroundImage: 'linear-gradient(135deg, #0F668E 0%, #041B38 100%)' }}
            >
              <span className="text-[22px] font-display font-extrabold text-white select-none">
                JA
              </span>
            </div>

            {/* Informações do Usuário */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[22px] font-display font-extrabold text-[#041B38] leading-tight">
                  {user.buyerName || 'José Antonio Rodrigues Feitosa'}
                </h1>
                {/* Badge Oficial COMPRADOR MASTER B2B */}
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded bg-[#DCFCE7] text-[11px] font-bold text-[#16A34A] border border-[#BBF7D0] tracking-wide uppercase">
                  <span>✓</span>
                  <span>COMPRADOR MASTER B2B</span>
                </span>
              </div>

              {/* E-mail, separador e Razão Social / CNPJ */}
              <div className="flex flex-wrap items-center gap-2.5 text-sm">
                <span className="text-[#64748B] text-[14px]">
                  {user.email || 'jose.antonio.220507@gmail.com'}
                </span>
                <span className="text-[#CBD5E1] text-[16px] select-none">•</span>
                <span className="text-[#0F668E] text-[13px] font-semibold">
                  {user.razaoSocial || 'Grupo Paulista Saúde LTDA'}{' '}
                  <span className="font-normal">
                    (CNPJ {user.cnpjCpf || '42.198.341/0001-90'})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. NAVEGAÇÃO POR ABAS — underline style, proeminente
            =================================================================== */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs px-6 sm:px-8 mb-6">
          <nav className="flex items-center overflow-x-auto scrollbar-none">
              {/* Dados do Perfil */}
              <button
                onClick={() => setActiveTab('visao-geral')}
                className={`shrink-0 flex items-center gap-2 px-1 py-4 mr-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'visao-geral'
                    ? 'border-[#0F668E] text-[#041B38]'
                    : 'border-transparent text-slate-500 hover:text-[#041B38] hover:border-slate-300'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                Dados do Perfil
              </button>

              {/* Meus Pedidos */}
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`shrink-0 flex items-center gap-2 px-1 py-4 mr-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'pedidos'
                    ? 'border-[#0F668E] text-[#041B38]'
                    : 'border-transparent text-slate-500 hover:text-[#041B38] hover:border-slate-300'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                Meus Pedidos
                <span className="text-[10px] bg-[#0F668E]/10 text-[#0F668E] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none">
                  {user.orders.length}
                </span>
              </button>

              {/* Recompra Rápida */}
              <button
                onClick={() => setActiveTab('recompra')}
                className={`shrink-0 flex items-center gap-2 px-1 py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'recompra'
                    ? 'border-[#0F668E] text-[#041B38]'
                    : 'border-transparent text-slate-500 hover:text-[#041B38] hover:border-slate-300'
                }`}
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                Recompra Rápida
              </button>

              {/* Spacer + Sair */}
              <div className="ml-auto shrink-0 pl-4">
                <button
                  onClick={() => {
                    logout();
                    onNavigate && onNavigate('login');
                  }}
                  title="Sair da Conta"
                  className="flex items-center gap-1.5 py-4 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* ===================================================================
            ABA: VISÃO GERAL
            =================================================================== */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-6 pt-6">

            {/* SEÇÃO 1: INFORMAÇÕES PESSOAIS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 px-1">
                Informações Pessoais
              </p>
              <h2 className="text-[16px] font-display font-extrabold text-[#041B38] px-1">
                Dados do Comprador
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F9] overflow-hidden">

                {/* Linha 1: Nome e Sobrenome */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <CreditCard className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        {user.buyerName || 'Jose Antonio Rodrigues Feitosa'}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Nome e sobrenome.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A]" />
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {/* Linha 2: CPF / Responsável Legal */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-mono font-bold text-[#041B38]">
                        544.960.868-32
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Número do CPF / Responsável legal.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A]" />
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {/* Linha 3: Nome de Preferência */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        José Antonio
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Nome de preferência no atendimento.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>

                {/* Linha 4: Endereço Fiscal Principal */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <MapPin className="w-4 h-4 text-[#0F668E]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        Av. Sargento Geraldo Sant&apos;Ana, 683 — Jurubatuba, São Paulo/SP — CEP 04674-225
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Endereço fiscal principal cadastrado.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: OCUPAÇÃO E ATIVIDADE */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 px-1">
                Função &amp; Atividade
              </p>
              <h2 className="text-[16px] font-display font-extrabold text-[#041B38] px-1">
                Ocupação e atividade
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs overflow-hidden">
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        Analista sistemas, desenvolvedor de software
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Ocupação principal / Gestor de tecnologia e suprimentos.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: DADOS DA CONTA */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 px-1">
                Acesso &amp; Segurança
              </p>
              <h2 className="text-[16px] font-display font-extrabold text-[#041B38] px-1">
                Dados da conta
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F9] overflow-hidden">

                {/* E-mail */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        {user.email || 'jose.antonio.220507@gmail.com'}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        E-mail pelo qual você recebe as comunicações fiscais e Danfe.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A]" />
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        {user.phone || '+55 11 99252-7640'}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Número pelo qual você recebe os códigos de verificação e WhatsApp.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A]" />
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {/* Código de Usuário */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-md shrink-0">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-[14px] font-mono font-bold text-[#041B38]">
                        {user.id || 'JA20260317122747'}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Código identificador do usuário na plataforma.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              </div>

              {/* Rodapé LGPD */}
              <div className="flex items-center py-2 px-1 gap-2.5 text-slate-500 text-xs">
                <ShieldCheck className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span>
                  Suas informações fiscais e pessoais estão sempre protegidas. Consulte nossa{' '}
                  <span className="text-[#0F668E] font-semibold underline cursor-pointer">
                    Política de Privacidade e LGPD
                  </span>.
                </span>
              </div>
            </div>

            {/* SEÇÃO 4: ENDEREÇOS */}
            <div className="space-y-3.5 pt-2">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 px-1">
                Locais de Entrega
              </p>
              <div className="flex justify-between items-center px-1">
                <h2 className="text-[16px] font-display font-extrabold text-[#041B38]">
                  Endereços
                </h2>
                <button
                  type="button"
                  onClick={() => showNotice('Modal para inclusão de novo endereço corporativo.')}
                  className="px-4 py-2 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  + Adicionar Endereço
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Card 1: Principal */}
                <div className="relative bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-2 hover:border-[#0F668E]/40 hover:shadow-md transition-all">
                  {/* Badge Principal */}
                  <span className="absolute top-4 right-12 inline-flex items-center gap-1 text-[10px] font-bold text-[#16A34A] bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" />
                    Principal
                  </span>

                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 shrink-0">
                        <MapPin className="w-5 h-5 text-[#0F668E]" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-[#041B38] leading-snug">
                          Av. Sargento Geraldo Sant&apos;Ana, 683 Ap 41 Bl 4
                        </h3>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          CEP 04674-225 · São Paulo – SP
                        </p>
                      </div>
                    </div>
                    {/* Dropdown menu */}
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenAddressMenu(openAddressMenu === 0 ? null : 0); }}
                        className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded cursor-pointer"
                        aria-label="Opções do endereço"
                      >
                        ⋮
                      </button>
                      {openAddressMenu === 0 && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { showNotice('Editar endereço'); setOpenAddressMenu(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Editar</button>
                          <button onClick={() => { showNotice('Endereço removido.'); setOpenAddressMenu(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 cursor-pointer">Remover</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[12px] text-slate-500">Endereço residencial e fiscal</p>
                  <p className="text-[12px] text-slate-500">Jose Antonio Rodrigues Feitosa · (11) 99252-7640</p>
                  <div className="pt-1">
                    <button
                      onClick={() => showNotice('Editar informações adicionais')}
                      className="text-[13px] font-bold text-[#0F668E] hover:underline cursor-pointer"
                    >
                      Incluir informações adicionais →
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="relative bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-2 hover:border-[#0F668E]/40 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 shrink-0">
                        <MapPin className="w-5 h-5 text-[#0F668E]" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-[#041B38] leading-snug">
                          Av. Sargento Geraldo Sant&apos;Ana, 683 Apto 41 Bloco 4
                        </h3>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          CEP 04674-225 · São Paulo – SP
                        </p>
                      </div>
                    </div>
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenAddressMenu(openAddressMenu === 1 ? null : 1); }}
                        className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded cursor-pointer"
                        aria-label="Opções do endereço"
                      >
                        ⋮
                      </button>
                      {openAddressMenu === 1 && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { showNotice('Editar endereço'); setOpenAddressMenu(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Editar</button>
                          <button onClick={() => { showNotice('Endereço removido.'); setOpenAddressMenu(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 cursor-pointer">Remover</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-500">Endereço cadastral adicional</p>
                  <p className="text-[12px] text-slate-500">José Antonio Rodrigues Feitosa · (11) 99252-7640</p>
                  <div className="pt-1">
                    <button
                      onClick={() => showNotice('Editar informações adicionais')}
                      className="text-[13px] font-bold text-[#0F668E] hover:underline cursor-pointer"
                    >
                      Incluir informações adicionais →
                    </button>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="relative bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-2 hover:border-[#0F668E]/40 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 shrink-0">
                        <MapPin className="w-5 h-5 text-[#0F668E]" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-[#041B38] leading-snug">
                          Av. Rubens Montanaro de Borba, 477
                        </h3>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          CEP 04811-120 · São Paulo – SP
                        </p>
                      </div>
                    </div>
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenAddressMenu(openAddressMenu === 2 ? null : 2); }}
                        className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded cursor-pointer"
                        aria-label="Opções do endereço"
                      >
                        ⋮
                      </button>
                      {openAddressMenu === 2 && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { showNotice('Editar endereço'); setOpenAddressMenu(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Editar</button>
                          <button onClick={() => { showNotice('Endereço removido.'); setOpenAddressMenu(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 cursor-pointer">Remover</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-500">Endereço comercial / Entrega rápida</p>
                  <p className="text-[12px] text-slate-500">Jose Antonio Rodrigues Feitosa · (11) 99252-7640</p>
                  <div className="pt-1">
                    <button
                      onClick={() => showNotice('Editar informações adicionais')}
                      className="text-[13px] font-bold text-[#0F668E] hover:underline cursor-pointer"
                    >
                      Incluir informações adicionais →
                    </button>
                  </div>
                </div>
              </div>

              {/* Nota de Cancelamento */}
              <div className="py-2 text-[12px] text-slate-400 px-1">
                Você pode{' '}
                <span className="text-[#0F668E] underline cursor-pointer">
                  cancelar sua conta
                </span>{' '}
                quando quiser.
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
            ABA: PEDIDOS
            =================================================================== */}
        {activeTab === 'pedidos' && (
          <div className="space-y-4 pt-6">
            {/* Header de filtros — mais limpo */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#0F668E]/10 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-[#0F668E]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-[#041B38] leading-tight">
                    Meus Pedidos Corporativos
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {filteredOrders.length} de {user.orders.length} pedidos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por número ou produto..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0F668E] transition-colors"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer focus:outline-none focus:border-[#0F668E] transition-colors"
                >
                  <option value="todos">Todos os status</option>
                  <option value="andamento">Em andamento</option>
                  <option value="entregues">Entregues</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center text-slate-500">
                <p className="font-bold text-slate-700 mb-1">Nenhum pedido encontrado</p>
                <p className="text-xs">Faça sua primeira compra ou cotação para acompanhar aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const stepIdx = getStepIndex(order.status);
                  const statusColors = getStatusColors(order.status);
                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-xl border border-[#E2E8F0] border-l-4 ${statusColors.border} shadow-xs p-5 space-y-4`}
                    >
                      {/* Cabeçalho do card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-[#041B38]">
                            Pedido #{order.id}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{order.date}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-[#0F668E]">
                            {order.paymentMethod}
                          </span>
                          {/* Status badge colorido */}
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColors.badge}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-[#041B38]">
                            {formatBRL(order.total)}
                          </span>
                          <button
                            onClick={() => setNfeModalOrder(order)}
                            className="px-2.5 py-1 text-xs font-bold text-[#0F668E] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
                          >
                            Ver Danfe
                          </button>
                        </div>
                      </div>

                      {/* Timeline do Pedido com linha conectora */}
                      <div className="relative grid grid-cols-5 gap-2 text-center text-[11px] py-1">
                        {/* Linha conectora de fundo */}
                        <div className="absolute top-[10px] left-[10%] right-[10%] h-px bg-slate-200 z-0" />
                        {ORDER_STEPS.map((stepName, sIdx) => {
                          const isDone = sIdx <= stepIdx;
                          return (
                            <div key={stepName} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 border-2 ${
                                  isDone
                                    ? 'bg-[#16A34A] border-[#16A34A] text-white'
                                    : 'bg-white border-slate-200 text-slate-400'
                                }`}
                              >
                                {isDone ? '✓' : sIdx + 1}
                              </div>
                              <span className={`text-[10px] leading-tight ${isDone ? 'font-bold text-[#041B38]' : 'text-slate-400'}`}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lista de itens */}
                      <div className="divide-y divide-slate-100 pt-1">
                        {order.items.map((it) => (
                          <div key={it.productId} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img src={it.image} alt={it.name} className="w-8 h-8 object-contain rounded border border-slate-100" />
                              <span className="font-medium text-slate-800 line-clamp-1">{it.name}</span>
                              <span className="text-slate-400">({it.quantity}x)</span>
                            </div>
                            <span className="font-mono font-bold text-slate-800">
                              {formatBRL(it.unitPrice * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Rodapé do card */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500">
                          Entrega: <strong className="text-slate-700">{order.deliveryAddressLabel}</strong>
                        </span>
                        <button
                          onClick={() => handleRepeatOrder(order)}
                          className="px-3 py-1.5 bg-[#0F668E] text-white font-bold rounded-lg hover:bg-[#0B4F6E] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Repetir Pedido</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ABA: RECOMPRA RÁPIDA
            =================================================================== */}
        {activeTab === 'recompra' && (
          <div className="space-y-4 pt-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <div>
                <h2 className="font-display font-bold text-base text-[#041B38]">
                  Itens de Reposição Recorrente
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Produtos mais solicitados pela sua empresa com preço especial.
                </p>
              </div>
              <button
                onClick={handleAddAllRecompra}
                className="px-4 py-2.5 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Adicionar Todos ao Carrinho
              </button>
            </div>

            {/* Grid de produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RECURRING_ESSENTIALS.map((prod) => {
                const qty = recompraQty[prod.id] || 1;
                const itemTotal = prod.price * qty;
                return (
                  <div
                    key={prod.id}
                    className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#0F668E]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 object-contain rounded-lg border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] text-[#041B38] line-clamp-2 leading-snug">
                          {prod.name}
                        </p>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          {formatBRL(prod.price)} / {prod.unit}
                        </p>
                      </div>
                    </div>

                    {/* Controle de quantidade + total + botão */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                      {/* Botão -/+ */}
                      <div className="flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            setRecompraQty((prev) => ({
                              ...prev,
                              [prod.id]: Math.max(1, (prev[prod.id] || 1) - 1),
                            }))
                          }
                          className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 text-sm font-mono font-bold text-[#041B38] border-x border-slate-200 min-w-[2.5rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() =>
                            setRecompraQty((prev) => ({
                              ...prev,
                              [prod.id]: (prev[prod.id] || 1) + 1,
                            }))
                          }
                          className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>

                      {/* Total calculado */}
                      <span className="text-[13px] font-mono font-bold text-[#041B38]">
                        {formatBRL(itemTotal)}
                      </span>

                      {/* Botão Comprar */}
                      <button
                        onClick={() => {
                          addItem(prod, qty);
                          setIsDrawerOpen(true);
                          showNotice(`${prod.name} (${qty}x) adicionado ao carrinho.`);
                        }}
                        className="px-4 py-1.5 bg-[#0F668E] hover:bg-[#0B4F6E] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Modal Danfe */}
      {nfeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-[#041B38]">
                Nota Fiscal Eletrônica (Danfe) • #{nfeModalOrder.id}
              </h3>
              <button
                onClick={() => setNfeModalOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <p>Chave NFe: 3526.0842.1983.4100.0190.5500.1000.0498.2110.1234.5678</p>
              <p>Destinatário: Grupo Paulista Saúde LTDA</p>
              <p>CNPJ: 42.198.341/0001-90 • IE: 148.920.311.114</p>
              <p>Valor Total: {formatBRL(nfeModalOrder.total)}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert('Download do XML da NF-e realizado.');
                  setNfeModalOrder(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
              >
                Baixar XML
              </button>
              <button
                onClick={() => {
                  alert('Download do PDF do Danfe realizado.');
                  setNfeModalOrder(null);
                }}
                className="px-4 py-2 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold rounded-lg cursor-pointer"
              >
                Baixar Danfe PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
