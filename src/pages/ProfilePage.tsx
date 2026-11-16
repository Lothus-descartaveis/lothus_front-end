import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BEST_SELLER_PRODUCTS, FLASH_PRODUCTS } from '../data/mockData';
import { useSEO } from '../hooks/useSEO';
import { CorporateOrder, Product } from '../types';

export type ProfileTab =
  | 'visao-geral'
  | 'pedidos'
  | 'recompra'
  | 'empresa'
  | 'enderecos'
  | 'faturamento';

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

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  initialTab = 'visao-geral',
}) => {
  const {
    user,
    loginDemoCorporate,
    logout,
    updateProfile,
    addAddress,
    removeAddress,
    setDefaultAddress,
    addBuyer,
    toggleBuyer,
    requestCreditIncrease,
  } = useAuth();
  const { addItem, setIsDrawerOpen } = useCart();

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [feedbackBanner, setFeedbackBanner] = useState<string>('');

  // Orders filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'todos' | 'andamento' | 'entregues'>('todos');
  const [nfeModalOrder, setNfeModalOrder] = useState<CorporateOrder | null>(null);

  // Recompra quantities
  const [recompraQty, setRecompraQty] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    RECURRING_ESSENTIALS.forEach((p) => {
      map[p.id] = p.id === 'copos-descartaveis-ecocoppo-200ml' ? 10 : 2;
    });
    return map;
  });

  // Editable Company Data Form
  const [companyForm, setCompanyForm] = useState({
    razaoSocial: user?.razaoSocial || '',
    nomeFantasia: user?.nomeFantasia || '',
    inscricaoEstadual: user?.inscricaoEstadual || '',
    segment: user?.segment || '',
    buyerName: user?.buyerName || '',
    buyerRole: user?.buyerRole || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsappNotifications: user?.whatsappNotifications ?? true,
  });

  // New Address Form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    isDefault: false,
  });

  // New Buyer Form
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [newBuyer, setNewBuyer] = useState({
    name: '',
    role: '',
    email: '',
    monthlyLimit: '5000',
  });

  // Credit Limit Request
  const [requestedLimit, setRequestedLimit] = useState('50000');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setCompanyForm({
        razaoSocial: user.razaoSocial,
        nomeFantasia: user.nomeFantasia,
        inscricaoEstadual: user.inscricaoEstadual,
        segment: user.segment,
        buyerName: user.buyerName,
        buyerRole: user.buyerRole,
        email: user.email,
        phone: user.phone,
        whatsappNotifications: user.whatsappNotifications,
      });
    }
  }, [user]);

  useSEO({
    title: user
      ? `${user.nomeFantasia} — Minha Conta Corporativa | Lothus Descartáveis`
      : 'Minha Conta Corporativa — Lothus Descartáveis',
    description:
      'Painel B2B da Lothus Descartáveis para gestão de pedidos PJ, notas fiscais (DANFE/XML), unidades de entrega, compradores e recompra rápida.',
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
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs">
          <Building2 className="w-9 h-9 text-[#0F668E] mx-auto mb-4" />
          <h1 className="font-display font-bold text-xl text-[#041B38] mb-2">
            Acesse sua Conta Corporativa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Faça login ou cadastre o CNPJ da sua empresa para visualizar pedidos, notas fiscais, crédito PJ e unidades de entrega.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              className="px-6 py-3 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Ir para Login e Cadastro B2B
            </button>
            <button
              type="button"
              onClick={() => loginDemoCorporate()}
              className="px-6 py-3 border border-[#0F668E] text-[#0F668E] hover:bg-[#0F668E]/5 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Visualizar Perfil Demo B2B
            </button>
          </div>
        </div>
      </div>
    );
  }

  const creditAvailable = Math.max(0, user.creditLimit - user.creditUsed);
  const creditPercent =
    user.creditLimit > 0 ? Math.min(100, Math.round((user.creditUsed / user.creditLimit) * 100)) : 0;
  const latestOrder = user.orders[0];

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(companyForm);
    showNotice('Dados cadastrais e contatos da empresa atualizados com sucesso.');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      label: newAddress.label || 'Filial / Unidade',
      cep: newAddress.cep,
      street: newAddress.street,
      number: newAddress.number,
      complement: newAddress.complement,
      neighborhood: newAddress.neighborhood,
      city: newAddress.city,
      state: newAddress.state.toUpperCase(),
      isDefault: newAddress.isDefault,
    });
    setNewAddress({
      label: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: 'São Paulo',
      state: 'SP',
      isDefault: false,
    });
    setShowAddressForm(false);
    showNotice('Nova unidade de recebimento adicionada.');
  };

  const handleCreateBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    addBuyer({
      name: newBuyer.name,
      role: newBuyer.role || 'Comprador Autorizado',
      email: newBuyer.email,
      monthlyLimit: Number(newBuyer.monthlyLimit) || undefined,
      active: true,
    });
    setNewBuyer({ name: '', role: '', email: '', monthlyLimit: '5000' });
    setShowBuyerForm(false);
    showNotice('Comprador autorizado vinculado ao CNPJ.');
  };

  const handleCreditRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(requestedLimit) || user.creditLimit + 10000;
    requestCreditIncrease(num);
    showNotice(`Solicitação de limite para ${formatBRL(num)} registrada para análise financeira.`);
  };

  const initials = (user.nomeFantasia || user.razaoSocial || 'LP')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const navItems: { id: ProfileTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'visao-geral', label: 'Visão Geral B2B', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'pedidos', label: 'Meus Pedidos & NF-e', icon: <Package className="w-4 h-4" />, badge: user.orders.length },
    { id: 'recompra', label: 'Recompra Rápida', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'empresa', label: 'Dados da Empresa', icon: <Building2 className="w-4 h-4" /> },
    { id: 'enderecos', label: 'Unidades & Entregas', icon: <MapPin className="w-4 h-4" />, badge: user.addresses.length },
    { id: 'faturamento', label: 'Crédito PJ & Compradores', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 font-sans">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          className="hover:text-[#0F668E] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Loja</span>
        </button>
        <span>/</span>
        <span className="text-[#041B38] font-bold">Portal da Empresa & Perfil</span>
      </div>

      {/* Cabeçalho Corporativo do Perfil */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0F668E] text-white font-display font-black text-lg sm:text-xl flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-[#0F668E]/10 text-[#0F668E] text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {user.accountType === 'pj' ? 'Conta Empresarial PJ' : 'Pessoa Física'}
              </span>
              <span
                className={`text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full ${
                  user.creditStatus === 'Aprovado'
                    ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                Crédito B2B: {user.creditStatus}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {user.accountType === 'pj' ? `CNPJ ${user.cnpjCpf}` : `CPF ${user.cnpjCpf}`}
              </span>
            </div>

            <h1 className="font-display font-bold text-lg sm:text-2xl text-[#041B38] leading-tight">
              {user.nomeFantasia || user.razaoSocial}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {user.razaoSocial} • Responsável: <strong className="text-slate-700">{user.buyerName}</strong> ({user.buyerRole})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('cotacao-b2b')}
            className="px-4 py-2.5 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Nova Cotação em Lote</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              onNavigate && onNavigate('login');
            }}
            className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-red-600 font-display font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      {feedbackBanner && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MENU LATERAL / NAVEGAÇÃO DO PORTAL */}
        <aside className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl p-2.5 shadow-xs">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-[#0F668E] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#041B38]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Card Atendimento Dedicado */}
          <div className="hidden lg:block mt-4 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#0F668E] block mb-1">
              Consultor B2B Dedicado
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              Precisa de entrega programada, pallet fechado ou alteração cadastral de CNPJ?
            </p>
            <a
              href={`https://wa.me/5511977663741?text=${encodeURIComponent(
                `Olá! Falo em nome da empresa ${user.razaoSocial} (CNPJ: ${user.cnpjCpf}) pelo Portal B2B.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white text-[11px] font-display font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Atendimento WhatsApp PJ</span>
            </a>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="lg:col-span-9 space-y-6">
          {/* ========================================================== */}
          {/* ABA 1: VISÃO GERAL                                         */}
          {/* ========================================================== */}
          {activeTab === 'visao-geral' && (
            <>
              {/* KPIs Corporativos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Limite B2B Disponível
                  </span>
                  <span className="font-display font-black text-xl text-[#041B38] block mt-1">
                    {user.accountType === 'pj' ? formatBRL(creditAvailable) : 'PIX / Cartão'}
                  </span>
                  <span className="text-[10px] text-[#0F668E] font-semibold mt-1 block">
                    {user.paymentTerms}
                  </span>
                </div>

                <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Pedidos Registrados
                  </span>
                  <span className="font-display font-black text-xl text-[#041B38] block mt-1">
                    {user.orders.length} {user.orders.length === 1 ? 'pedido' : 'pedidos'}
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-semibold mt-1 block">
                    NF-e & XML disponíveis
                  </span>
                </div>

                <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Unidades de Recebimento
                  </span>
                  <span className="font-display font-black text-xl text-[#041B38] block mt-1">
                    {user.addresses.length} {user.addresses.length === 1 ? 'local' : 'locais'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block truncate">
                    Padrão: {user.addresses.find((a) => a.isDefault)?.label || user.addresses[0]?.label}
                  </span>
                </div>

                <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Compradores no CNPJ
                  </span>
                  <span className="font-display font-black text-xl text-[#041B38] block mt-1">
                    {user.buyers.filter((b) => b.active).length} ativos
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Controle por centro de custo
                  </span>
                </div>
              </div>

              {/* Último Pedido em Andamento */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                  <div>
                    <h2 className="font-display font-bold text-base text-[#041B38]">
                      Último Pedido & Rastreamento Logístico
                    </h2>
                    <p className="text-xs text-slate-500">
                      Acompanhe a emissão da nota fiscal e a entrega da frota na unidade selecionada.
                    </p>
                  </div>
                  {latestOrder && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('pedidos')}
                      className="text-xs font-display font-bold text-[#0F668E] hover:underline cursor-pointer self-start sm:self-center"
                    >
                      Ver histórico completo →
                    </button>
                  )}
                </div>

                {latestOrder ? (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#041B38]">
                            #{latestOrder.id}
                          </span>
                          <span className="bg-[#0F668E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {latestOrder.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Data: {latestOrder.date} • Unidade: <strong className="text-slate-700">{latestOrder.deliveryAddressLabel}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Valor Faturado</span>
                          <span className="font-display font-black text-base text-[#041B38]">
                            {formatBRL(latestOrder.total)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRepeatOrder(latestOrder)}
                          className="px-3.5 py-2 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Repetir Pedido</span>
                        </button>
                      </div>
                    </div>

                    {/* Stepper Logístico */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {ORDER_STEPS.map((step, idx) => {
                        const current = getStepIndex(latestOrder.status);
                        const done = idx <= current;
                        return (
                          <div
                            key={step}
                            className={`p-2.5 rounded-lg border text-center ${
                              done
                                ? 'bg-[#0F668E]/10 border-[#0F668E]/30 text-[#0F668E]'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="text-[10px] font-mono font-bold mb-0.5">
                              0{idx + 1}
                            </div>
                            <div className="text-[11px] font-display font-bold leading-tight">
                              {step}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-display font-bold text-sm text-[#041B38] mb-1">
                      Sua empresa ainda não possui pedidos faturados
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                      Explore o catálogo atacado ou monte sua primeira lista de reposição mensal com condições PJ.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('catalogo')}
                        className="px-5 py-2.5 rounded-lg bg-[#0F668E] text-white font-display font-bold text-xs cursor-pointer hover:bg-[#0B4F6E]"
                      >
                        Explorar Catálogo Atacado
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('recompra')}
                        className="px-5 py-2.5 rounded-lg border border-slate-200 text-[#041B38] font-display font-bold text-xs cursor-pointer hover:bg-slate-50"
                      >
                        Lista Sugerida para Empresas
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Atalhos Rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('recompra')}
                  className="bg-white border border-[#E2E8F0] hover:border-[#0F668E]/40 rounded-xl p-5 text-left transition-all cursor-pointer group"
                >
                  <RotateCcw className="w-5 h-5 text-[#0F668E] mb-2.5" />
                  <h3 className="font-display font-bold text-sm text-[#041B38] group-hover:text-[#0F668E]">
                    Abastecimento Mensal
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Monte seu pedido recorrente de papel toalha, sulfite, copos e limpeza em segundos.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('checkout')}
                  className="bg-white border border-[#E2E8F0] hover:border-[#0F668E]/40 rounded-xl p-5 text-left transition-all cursor-pointer group"
                >
                  <ShoppingCart className="w-5 h-5 text-[#FB8C00] mb-2.5" />
                  <h3 className="font-display font-bold text-sm text-[#041B38] group-hover:text-[#0F668E]">
                    Faturar Carrinho Atual
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Seus dados fiscais e endereço padrão já serão preenchidos automaticamente no checkout.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('enderecos')}
                  className="bg-white border border-[#E2E8F0] hover:border-[#0F668E]/40 rounded-xl p-5 text-left transition-all cursor-pointer group"
                >
                  <MapPin className="w-5 h-5 text-[#16A34A] mb-2.5" />
                  <h3 className="font-display font-bold text-sm text-[#041B38] group-hover:text-[#0F668E]">
                    Gerenciar Filiais e Docas
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Cadastre novos endereços de entrega para agilizar o recebimento do almoxarifado.
                  </p>
                </button>
              </div>
            </>
          )}

          {/* ========================================================== */}
          {/* ABA 2: MEUS PEDIDOS & NF-E                                 */}
          {/* ========================================================== */}
          {activeTab === 'pedidos' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-[#041B38]">
                    Histórico de Pedidos & Notas Fiscais
                  </h2>
                  <p className="text-xs text-slate-500">
                    Consulte faturamentos, baixe DANFE/XML e repita pedidos com 1 clique.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(['todos', 'andamento', 'entregues'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold cursor-pointer transition-colors ${
                        orderStatusFilter === status
                          ? 'bg-[#0F668E] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'todos'
                        ? 'Todos'
                        : status === 'andamento'
                        ? 'Em Andamento'
                        : 'Entregues'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Buscar por número do pedido (ex: LTS-2026), SKU ou nome do item..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                />
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-display font-bold text-sm text-[#041B38]">
                    Nenhum pedido encontrado com esse filtro
                  </p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Você pode criar um pedido finalizando o carrinho ou acessando a lista de Recompra Rápida.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('catalogo')}
                    className="px-4 py-2 rounded-lg bg-[#0F668E] text-white text-xs font-display font-bold cursor-pointer"
                  >
                    Ir para o Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      {/* Cabeçalho do Pedido */}
                      <div className="bg-[#F8FAFC] px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Pedido</span>
                            <span className="font-mono font-bold text-[#041B38]">#{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Data</span>
                            <span className="font-semibold text-slate-700">{order.date}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Pagamento</span>
                            <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Entrega</span>
                            <span className="font-semibold text-slate-700">{order.deliveryAddressLabel}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-display font-bold px-2.5 py-1 rounded-full ${
                              order.status === 'Entregue'
                                ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                                : 'bg-blue-50 text-[#0F668E] border border-[#0F668E]/20'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="font-display font-black text-sm text-[#041B38]">
                            {formatBRL(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="p-4 space-y-3 bg-white">
                        {order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.sku}`}
                            className="flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-11 h-11 rounded-lg object-contain border border-slate-100 bg-white p-1 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-[#041B38] truncate">
                                  {item.name}
                                </p>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  SKU: {item.sku} • {item.quantity}x {item.unit} ({formatBRL(item.unitPrice)}/un)
                                </span>
                              </div>
                            </div>
                            <span className="font-display font-bold text-[#041B38] shrink-0">
                              {formatBRL(item.quantity * item.unitPrice)}
                            </span>
                          </div>
                        ))}

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-[11px] text-slate-500 font-mono">
                            NF-e nº {order.nfeNumber || 'Em processamento'}
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setNfeModalOrder(order)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-[#0F668E]" />
                              <span>DANFE / XML</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRepeatOrder(order)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Comprar Novamente</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {nfeModalOrder && (
                <div className="p-4 rounded-xl bg-slate-50 border border-[#0F668E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-display font-bold text-[#041B38] block">
                      Espelho Fiscal DANFE • NF-e {nfeModalOrder.nfeNumber || '000.050.112'} (Pedido #{nfeModalOrder.id})
                    </span>
                    <span className="text-slate-500">
                      Destinatário: {user.razaoSocial} • CNPJ {user.cnpjCpf} • Valor: {formatBRL(nfeModalOrder.total)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/5511977663741?text=${encodeURIComponent(
                        `Olá! Gostaria da 2ª via do PDF/XML da NF-e do pedido #${nfeModalOrder.id} (${user.razaoSocial}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#0F668E] text-white font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Solicitar 2ª Via XML</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setNfeModalOrder(null)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 3: RECOMPRA RÁPIDA B2B                                 */}
          {/* ========================================================== */}
          {activeTab === 'recompra' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-[#041B38]">
                    Lista de Reposição Mensal da Empresa
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ajuste rapidamente as quantidades recorrentes de suprimentos e envie tudo ao carrinho em 1 clique.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddAllRecompra}
                  className="px-4 py-2.5 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs flex items-center gap-2 cursor-pointer self-start sm:self-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Adicionar Lista ao Carrinho</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {RECURRING_ESSENTIALS.map((prod) => {
                  const qty = recompraQty[prod.id] ?? 1;
                  return (
                    <div
                      key={prod.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded-xl object-contain border border-slate-100 bg-white p-1.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-slate-400 block">
                            SKU {prod.sku} • {prod.unit}
                          </span>
                          <h3 className="font-display font-bold text-xs sm:text-sm text-[#041B38] leading-snug">
                            {prod.name}
                          </h3>
                          <span className="text-xs font-bold text-[#0F668E]">
                            {formatBRL(prod.price)}
                          </span>
                          <span className="text-[11px] text-[#16A34A] ml-2 font-semibold">
                            (-5% no PIX: {formatBRL(prod.price * 0.95)})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden h-9">
                          <button
                            type="button"
                            onClick={() =>
                              setRecompraQty((prev) => ({
                                ...prev,
                                [prod.id]: Math.max(1, (prev[prod.id] || 1) - 1),
                              }))
                            }
                            aria-label="Diminuir quantidade"
                            className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-mono font-bold text-[#041B38]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRecompraQty((prev) => ({
                                ...prev,
                                [prod.id]: (prev[prod.id] || 1) + 1,
                              }))
                            }
                            aria-label="Aumentar quantidade"
                            className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            addItem(prod, qty);
                            showNotice(`${qty}x ${prod.sku} adicionado ao carrinho.`);
                          }}
                          className="px-3.5 h-9 rounded-lg border border-[#0F668E] text-[#0F668E] hover:bg-[#0F668E] hover:text-white font-display font-bold text-xs transition-colors cursor-pointer"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 4: DADOS DA EMPRESA                                    */}
          {/* ========================================================== */}
          {activeTab === 'empresa' && (
            <form
              onSubmit={handleSaveCompany}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5 text-xs"
            >
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-display font-bold text-lg text-[#041B38]">
                  Dados Fiscais & Responsável de Compras
                </h2>
                <p className="text-xs text-slate-500">
                  Mantenha os dados de faturamento atualizados para emissão automática de DANFE e XML.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {user.accountType === 'pj' ? 'CNPJ (Somente leitura)' : 'CPF'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.cnpjCpf}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    value={companyForm.inscricaoEstadual}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, inscricaoEstadual: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {user.accountType === 'pj' ? 'Razão Social *' : 'Nome Completo *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.razaoSocial}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, razaoSocial: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    value={companyForm.nomeFantasia}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, nomeFantasia: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Responsável de Compras *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.buyerName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, buyerName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cargo / Área
                  </label>
                  <input
                    type="text"
                    value={companyForm.buyerRole}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, buyerRole: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Segmento
                  </label>
                  <input
                    type="text"
                    value={companyForm.segment}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, segment: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    E-mail Corporativo (NF-e & XML) *
                  </label>
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp Comercial *
                  </label>
                  <input
                    type="tel"
                    required
                    value={companyForm.phone}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={companyForm.whatsappNotifications}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      whatsappNotifications: e.target.checked,
                    })
                  }
                />
                <span>Receber status de separação, NF-e emitida e entrega da frota via WhatsApp.</span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Salvar Dados da Empresa
                </button>
              </div>
            </form>
          )}

          {/* ========================================================== */}
          {/* ABA 5: UNIDADES & ENDEREÇOS DE ENTREGA                     */}
          {/* ========================================================== */}
          {activeTab === 'enderecos' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-[#041B38]">
                    Unidades & Endereços de Entrega
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gerencie matriz, filiais, centros de custo e docas de recebimento.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddressForm((prev) => !prev)}
                  className="px-4 py-2 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Unidade</span>
                </button>
              </div>

              {showAddressForm && (
                <form
                  onSubmit={handleCreateAddress}
                  className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3.5 text-xs"
                >
                  <h3 className="font-display font-bold text-sm text-[#041B38]">
                    Cadastrar Novo Ponto de Entrega
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nome da Unidade *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Filial Moema / Depósito"
                        value={newAddress.label}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, label: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CEP *</label>
                      <input
                        type="text"
                        required
                        placeholder="00000-000"
                        value={newAddress.cep}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, cep: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.neighborhood}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, neighborhood: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block font-bold text-slate-700 mb-1">Logradouro *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Número *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.number}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, number: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block font-bold text-slate-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        placeholder="Doca / Bloco / Sala"
                        value={newAddress.complement}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, complement: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-6">
                      <label className="block font-bold text-slate-700 mb-1">Cidade *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">UF *</label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white uppercase focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4 flex items-center gap-2 pb-1">
                      <input
                        type="checkbox"
                        id="defaultAddr"
                        checked={newAddress.isDefault}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, isDefault: e.target.checked })
                        }
                      />
                      <label htmlFor="defaultAddr" className="text-slate-700 font-semibold cursor-pointer">
                        Definir como endereço padrão
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#0F668E] text-white font-display font-bold cursor-pointer"
                    >
                      Salvar Unidade
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-display font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      addr.isDefault
                        ? 'border-[#0F668E] bg-[#0F668E]/[0.03]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-display font-bold text-sm text-[#041B38]">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-[#0F668E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.street}, {addr.number}
                        {addr.complement ? ` — ${addr.complement}` : ''}
                        <br />
                        {addr.neighborhood} • {addr.city}/{addr.state}
                        <br />
                        <span className="font-mono text-slate-500">CEP {addr.cep}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDefaultAddress(addr.id);
                            showNotice(`${addr.label} definido como endereço principal de entrega.`);
                          }}
                          className="font-display font-bold text-[#0F668E] hover:underline cursor-pointer"
                        >
                          Definir como padrão
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#16A34A] font-semibold">
                          Ativo para próximos pedidos
                        </span>
                      )}

                      {user.addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddress(addr.id)}
                          aria-label="Excluir endereço"
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 6: CRÉDITO PJ & COMPRADORES AUTORIZADOS                */}
          {/* ========================================================== */}
          {activeTab === 'faturamento' && (
            <div className="space-y-6">
              {/* Painel de Crédito & Faturamento */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#041B38]">
                      Limite de Crédito & Faturamento Boleto PJ
                    </h2>
                    <p className="text-xs text-slate-500">
                      Condição vigente: <strong className="text-[#041B38]">{user.paymentTerms}</strong>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-display font-bold px-3 py-1 rounded-full ${
                      user.creditStatus === 'Aprovado'
                        ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    Status: {user.creditStatus}
                  </span>
                </div>

                {user.accountType === 'pj' ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">
                          Utilizado em títulos abertos: <strong className="text-[#041B38]">{formatBRL(user.creditUsed)}</strong>
                        </span>
                        <span className="text-slate-500">
                          Limite Total: <strong className="text-[#041B38]">{formatBRL(user.creditLimit)}</strong>
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#0F668E] rounded-full transition-all duration-300"
                          style={{ width: `${creditPercent}%` }}
                        />
                      </div>
                      <p className="text-xs font-semibold text-[#16A34A]">
                        Disponível imediatamente para faturamento PJ: {formatBRL(creditAvailable)}
                      </p>
                    </div>

                    <form
                      onSubmit={handleCreditRequest}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-end gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <label className="block font-bold text-slate-700 mb-1">
                          Solicitar Ampliação de Limite B2B (R$)
                        </label>
                        <input
                          type="number"
                          min={5000}
                          step={1000}
                          value={requestedLimit}
                          onChange={(e) => setRequestedLimit(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg bg-white font-mono focus:border-[#0F668E] focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-[#041B38] hover:bg-slate-800 text-white font-display font-bold cursor-pointer shrink-0"
                      >
                        Solicitar Revisão de Crédito
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    Sua conta está cadastrada como Pessoa Física (CPF). Para habilitar faturamento no Boleto PJ 28dd e limite de crédito corporativo, cadastre um CNPJ ou fale com nosso consultor.
                  </div>
                )}
              </div>

              {/* Compradores Autorizados */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-[#0F668E]" />
                    <div>
                      <h2 className="font-display font-bold text-lg text-[#041B38]">
                        Compradores Autorizados no CNPJ
                      </h2>
                      <p className="text-xs text-slate-500">
                        Defina quais colaboradores podem solicitar pedidos pela conta da empresa.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBuyerForm((prev) => !prev)}
                    className="px-4 py-2 rounded-lg bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Autorizar Comprador</span>
                  </button>
                </div>

                {showBuyerForm && (
                  <form
                    onSubmit={handleCreateBuyer}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nome *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Fernanda Souza"
                          value={newBuyer.name}
                          onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Cargo / Unidade *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Supervisor Filial"
                          value={newBuyer.role}
                          onChange={(e) => setNewBuyer({ ...newBuyer, role: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">E-mail *</label>
                        <input
                          type="email"
                          required
                          placeholder="nome@empresa.com.br"
                          value={newBuyer.email}
                          onChange={(e) => setNewBuyer({ ...newBuyer, email: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Alçada Mensal (R$)</label>
                        <input
                          type="number"
                          min={500}
                          step={500}
                          value={newBuyer.monthlyLimit}
                          onChange={(e) =>
                            setNewBuyer({ ...newBuyer, monthlyLimit: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#0F668E] text-white font-display font-bold cursor-pointer"
                      >
                        Salvar Comprador
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBuyerForm(false)}
                        className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-display font-bold cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="divide-y divide-slate-100 text-xs">
                  {user.buyers.map((buyer) => (
                    <div
                      key={buyer.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-[#041B38]">
                            {buyer.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              buyer.active
                                ? 'bg-emerald-50 text-[#16A34A]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {buyer.active ? 'Ativo' : 'Suspenso'}
                          </span>
                        </div>
                        <span className="text-slate-500 block mt-0.5">
                          {buyer.role} • {buyer.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {buyer.monthlyLimit !== undefined && (
                          <span className="font-mono font-bold text-slate-700">
                            Alçada: {formatBRL(buyer.monthlyLimit)}/mês
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleBuyer(buyer.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-bold cursor-pointer"
                        >
                          {buyer.active ? 'Desativar' : 'Reativar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
