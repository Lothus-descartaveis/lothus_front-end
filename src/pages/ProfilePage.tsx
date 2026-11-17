import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  User,
  Phone,
  Mail,
  Briefcase
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
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans text-slate-800">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 py-8 space-y-6">

        {/* ===================================================================
            1. BREADCRUMB (IDÊNTICO AO PAPER)
            =================================================================== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px]">
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

          {/* Abas Sutis de Navegação: Dados do Perfil vs Meus Pedidos */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveTab('visao-geral')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'visao-geral'
                  ? 'bg-white text-[#041B38] shadow-xs'
                  : 'text-slate-600 hover:text-[#041B38]'
              }`}
            >
              Dados do Perfil (Paper)
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pedidos'
                  ? 'bg-white text-[#041B38] shadow-xs'
                  : 'text-slate-600 hover:text-[#041B38]'
              }`}
            >
              <span>Meus Pedidos</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
                {user.orders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('recompra')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'recompra'
                  ? 'bg-white text-[#041B38] shadow-xs'
                  : 'text-slate-600 hover:text-[#041B38]'
              }`}
            >
              Recompra Rápida
            </button>
            <button
              onClick={() => {
                logout();
                onNavigate && onNavigate('login');
              }}
              title="Sair da Conta"
              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner se houver */}
        {feedbackBanner && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
        )}

        {/* ===================================================================
            2. HEADER DO PERFIL (IDÊNTICO AO PAPER — COMPONENT AUQ-0)
            =================================================================== */}
        <div className="flex items-center gap-5 pt-1 pb-2">
          {/* Avatar com Gradiente Lothus & Iniciais JA */}
          <div
            className="flex items-center justify-center shrink-0 rounded-full shadow-md border-[3px] border-white w-16 h-16 sm:w-17 sm:h-17"
            style={{ backgroundImage: 'linear-gradient(135deg, #0F668E 0%, #041B38 100%)' }}
          >
            <span className="text-[22px] font-display font-extrabold text-white">
              JA
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[20px] sm:text-[22px] font-display font-extrabold text-[#041B38] leading-tight">
                {user.buyerName || 'José Antonio Rodrigues Feitosa'}
              </h1>
              <span className="py-0.5 px-2 rounded bg-emerald-50 text-[11px] font-bold text-[#16A34A] border border-emerald-100">
                COMPRADOR MASTER B2B
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-slate-500">
              <span>{user.email || 'jose.antonio.220507@gmail.com'}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-[#0F668E]">
                {user.razaoSocial || 'Grupo Paulista Saúde LTDA'} (CNPJ {user.cnpjCpf || '42.198.341/0001-90'})
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SE ABA FOR "VISAO-GERAL" (TELA IDÊNTICA AO PAPER — ARTBOARD AT4-0)
            =================================================================== */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-6">

            {/* SEÇÃO 1: INFORMAÇÕES PESSOAIS */}
            <div className="space-y-2">
              <h2 className="text-[16px] font-display font-extrabold text-[#041B38]">
                Informações pessoais
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F9] overflow-hidden">
                {/* Linha 1: Nome e Sobrenome */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <CreditCard className="w-4.5 h-4.5" />
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-[#16A34A] text-white w-4.5 h-4.5 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-slate-400 text-base font-light">›</span>
                  </div>
                </div>

                {/* Linha 2: CPF / Responsável Legal */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[14px] font-mono font-bold text-[#041B38]">
                        54496086832
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Número do CPF / Responsável legal.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-[#16A34A] text-white w-4.5 h-4.5 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-slate-400 text-base font-light">›</span>
                  </div>
                </div>

                {/* Linha 3: Nome de Preferência */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <User className="w-4.5 h-4.5" />
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
                  <span className="text-slate-400 text-base font-light">›</span>
                </div>

                {/* Linha 4: Endereço Fiscal Principal */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#041B38]">
                        Avenida Sargento Geraldo Sant&apos;Ana, 683 — Jurubatuba, São Paulo / SP — CEP 04674-225
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Endereço fiscal principal cadastrado.
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-base font-light">›</span>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: OCUPAÇÃO E ATIVIDADE */}
            <div className="space-y-2">
              <h2 className="text-[16px] font-display font-extrabold text-[#041B38]">
                Ocupação e atividade
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs overflow-hidden">
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <Briefcase className="w-4.5 h-4.5" />
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
                  <span className="text-slate-400 text-base font-light">›</span>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: DADOS DA CONTA */}
            <div className="space-y-2">
              <h2 className="text-[16px] font-display font-extrabold text-[#041B38]">
                Dados da conta
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F9] overflow-hidden">
                {/* Linha 1: E-mail */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <Mail className="w-4.5 h-4.5" />
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-[#16A34A] text-white w-4.5 h-4.5 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-slate-400 text-base font-light">›</span>
                  </div>
                </div>

                {/* Linha 2: Telefone */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <Phone className="w-4.5 h-4.5" />
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-[#16A34A] text-white w-4.5 h-4.5 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-slate-400 text-base font-light">›</span>
                  </div>
                </div>

                {/* Linha 3: Código de Usuário */}
                <div className="flex justify-between items-center py-4 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-slate-400 shrink-0 flex items-center justify-center">
                      <User className="w-4.5 h-4.5" />
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
                  <span className="text-slate-400 text-base font-light">›</span>
                </div>
              </div>

              {/* Rodapé de Proteção de Dados LGPD */}
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

            {/* SEÇÃO 4: ENDEREÇOS (EXATAMENTE COMO NO PAPER — COMPONENT AZX-0) */}
            <div className="space-y-3.5 pt-2">
              <div className="flex justify-between items-center">
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

              {/* Card 1: Endereço Residencial e Fiscal */}
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-1.5 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#041B38] leading-snug">
                      Avenida Sargento Geraldo Sant&apos;Ana 683 Ap 41 BL 4
                    </h3>
                    <p className="text-[13px] text-slate-600">
                      CEP 04674225 - São Paulo - São Paulo
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 text-lg p-1">⋮</button>
                </div>
                <p className="text-[12px] text-slate-500">
                  Endereço residencial e fiscal
                </p>
                <p className="text-[12px] text-slate-500">
                  Jose Antonio Rodrigues Feitosa - 11992527640
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => showNotice('Editar informações adicionais')}
                    className="text-[13px] font-bold text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Incluir informações adicionais →
                  </button>
                </div>
              </div>

              {/* Card 2: Endereço Cadastral Adicional */}
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-1.5 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#041B38] leading-snug">
                      Avenida Sargento Geraldo Sant&apos;Ana 683 Apto 41 Bloco 4
                    </h3>
                    <p className="text-[13px] text-slate-600">
                      CEP 04674225 - São Paulo - São Paulo
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 text-lg p-1">⋮</button>
                </div>
                <p className="text-[12px] text-slate-500">
                  Endereço cadastral adicional
                </p>
                <p className="text-[12px] text-slate-500">
                  José Antonio Rodrigues Feitosa - 11992527640
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => showNotice('Editar informações adicionais')}
                    className="text-[13px] font-bold text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Incluir informações adicionais →
                  </button>
                </div>
              </div>

              {/* Card 3: Endereço Comercial / Entrega Rápida */}
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-1.5 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#041B38] leading-snug">
                      Avenida Rubens Montanaro de Borba 477
                    </h3>
                    <p className="text-[13px] text-slate-600">
                      CEP 04811120 - São Paulo - São Paulo
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 text-lg p-1">⋮</button>
                </div>
                <p className="text-[12px] text-slate-500">
                  Endereço comercial / Entrega rápida
                </p>
                <p className="text-[12px] text-slate-500">
                  Jose Antonio Rodrigues Feitosa - 11992527640
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => showNotice('Editar informações adicionais')}
                    className="text-[13px] font-bold text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Incluir informações adicionais →
                  </button>
                </div>
              </div>

              {/* Nota de Cancelamento */}
              <div className="py-2 text-[12px] text-slate-400">
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
            SE ABA FOR "PEDIDOS" (GESTÃO DE PEDIDOS & NF-E)
            =================================================================== */}
        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0F668E]" />
                <h2 className="font-display font-bold text-base text-[#041B38]">
                  Meus Pedidos Corporativos ({user.orders.length})
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por número ou produto..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer"
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
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-[#041B38]">
                            Pedido #{order.id}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{order.date}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-[#0F668E]">
                            {order.paymentMethod}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-[#041B38]">
                            {formatBRL(order.total)}
                          </span>
                          <button
                            onClick={() => setNfeModalOrder(order)}
                            className="px-2.5 py-1 text-xs font-bold text-[#0F668E] bg-blue-50 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            Ver Danfe
                          </button>
                        </div>
                      </div>

                      {/* Timeline do Pedido */}
                      <div className="grid grid-cols-5 gap-2 text-center text-[11px] py-1">
                        {ORDER_STEPS.map((stepName, sIdx) => {
                          const isDone = sIdx <= stepIdx;
                          return (
                            <div key={stepName} className="flex flex-col items-center">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                                  isDone
                                    ? 'bg-[#16A34A] text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isDone ? '✓' : sIdx + 1}
                              </div>
                              <span className={`text-[10px] ${isDone ? 'font-bold text-[#041B38]' : 'text-slate-400'}`}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lista resumida de itens */}
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

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500">
                          Entrega: <strong className="text-slate-700">{order.deliveryAddressLabel}</strong>
                        </span>
                        <button
                          onClick={() => handleRepeatOrder(order)}
                          className="px-3 py-1.5 bg-[#0F668E] text-white font-bold rounded hover:bg-[#0B4F6E] transition-colors cursor-pointer flex items-center gap-1"
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
            SE ABA FOR "RECOMPRA RÁPIDA"
            =================================================================== */}
        {activeTab === 'recompra' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E2E8F0]">
              <div>
                <h2 className="font-display font-bold text-base text-[#041B38]">
                  Itens de Reposição Recorrente
                </h2>
                <p className="text-xs text-slate-500">Produtos mais solicitados pela sua empresa com preço especial.</p>
              </div>
              <button
                onClick={handleAddAllRecompra}
                className="px-4 py-2 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Adicionar Todos ao Carrinho
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RECURRING_ESSENTIALS.map((prod) => (
                <div key={prod.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 object-contain rounded border border-slate-100" />
                    <div>
                      <p className="font-bold text-[#041B38] line-clamp-1">{prod.name}</p>
                      <p className="text-slate-500">{formatBRL(prod.price)} / {prod.unit}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addItem(prod, 1);
                      setIsDrawerOpen(true);
                      showNotice(`${prod.name} adicionado ao carrinho.`);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#041B38] font-bold rounded transition-colors cursor-pointer shrink-0"
                  >
                    + Comprar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal Danfe Preliminar se clicado */}
      {nfeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-[#041B38]">
                Nota Fiscal Eletrônica (Danfe) • #{nfeModalOrder.id}
              </h3>
              <button
                onClick={() => setNfeModalOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
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
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Baixar XML
              </button>
              <button
                onClick={() => {
                  alert('Download do PDF do Danfe realizado.');
                  setNfeModalOrder(null);
                }}
                className="px-4 py-2 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold rounded-lg"
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
