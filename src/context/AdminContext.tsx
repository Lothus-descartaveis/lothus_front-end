import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AdminOrder,
  AdminOrderStatus,
  AdminProduct,
  AdminUser,
  CustomerStats,
  PeriodFilter,
  AdminSystemSettings,
  SalesReportDay,
  CategorySalesSummary
} from '../types/admin';
import { FLASH_PRODUCTS, BEST_SELLER_PRODUCTS, DEPARTMENTS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface AdminContextType {
  // Autenticação Admin
  currentAdmin: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminUsers: AdminUser[];
  loginAdmin: (email: string, pass: string) => { ok: boolean; error?: string };
  logoutAdmin: () => void;
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  toggleAdminUserStatus: (id: string) => void;

  // Pedidos
  orders: AdminOrder[];
  updateOrderStatus: (orderId: string, newStatus: AdminOrderStatus) => void;
  addOrderFromStore: (order: AdminOrder) => void;

  // Produtos e Estoque
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, 'id' | 'salesCount' | 'revenueGenerated' | 'updatedAt'>) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Clientes
  customers: CustomerStats[];

  // Configurações
  settings: AdminSystemSettings;
  updateSettings: (patch: Partial<AdminSystemSettings>) => void;

  // Filtros Globais & Período
  selectedPeriod: PeriodFilter;
  setSelectedPeriod: (period: PeriodFilter) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;

  // KPIs e Métricas Calculadas
  metrics: {
    totalRevenue: number;
    previousRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    previousOrders: number;
    ordersGrowth: number;
    averageTicket: number;
    previousTicket: number;
    ticketGrowth: number;
    productsSold: number;
    previousProductsSold: number;
    productsSoldGrowth: number;
    pendingOrdersCount: number;
    conversionRate: number;
  };

  // Gráficos e Relatórios
  salesTimeline: SalesReportDay[];
  categoryPerformance: CategorySalesSummary[];
  topSellingProducts: AdminProduct[];
}

const ADMIN_STORAGE_KEY = 'lothus_admin_state_v1';
const ADMIN_SESSION_KEY = 'lothus_admin_session_v1';

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'José Antonio Rodrigues',
    email: 'admin@lothusdescartaveis.com.br',
    role: 'Super Admin',
    status: 'Ativo',
    lastLogin: 'Hoje, 14:32',
  },
  {
    id: 'adm-2',
    name: 'Mariana Alencar',
    email: 'mariana.comercial@lothus.com.br',
    role: 'Gerente Comercial',
    status: 'Ativo',
    lastLogin: 'Ontem, 18:15',
  },
  {
    id: 'adm-3',
    name: 'Carlos Alberto Silveira',
    email: 'carlos.expedicao@lothus.com.br',
    role: 'Operador de Logística',
    status: 'Ativo',
    lastLogin: '22/11/2026, 09:40',
  },
];

const INITIAL_SETTINGS: AdminSystemSettings = {
  storeName: 'Lothus Descartáveis & Suprimentos',
  cnpj: '42.198.341/0001-90',
  corporateEmail: 'contato@lothusdescartaveis.com.br',
  supportPhone: '(11) 5641-1015',
  minOrderB2B: 350.00,
  freeShippingThreshold: 350.00,
  notifyLowStock: true,
  lowStockThreshold: 15,
  autoApprovePix: true,
  maintenanceMode: false,
};

// Conversão inicial do catálogo base para AdminProduct
function generateInitialProducts(): AdminProduct[] {
  const combined: Product[] = [...FLASH_PRODUCTS, ...BEST_SELLER_PRODUCTS];
  const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());

  return unique.map((p, idx) => {
    const stock = p.stock ?? (idx % 2 === 0 ? 45 : 12);
    const salesCount = 40 + (idx * 17) % 180;
    const revenueGenerated = salesCount * p.price;

    return {
      ...p,
      published: true,
      minStockAlert: 15,
      salesCount,
      revenueGenerated,
      updatedAt: '2026-11-20',
      stock,
    };
  });
}

function generateInitialOrders(): AdminOrder[] {
  return [
    {
      id: 'LTS-2026-9104',
      orderNumber: '9104',
      date: '2026-11-23 11:20',
      customer: {
        id: 'cust-1',
        razaoSocial: 'Hospital Santa Cruz de São Paulo Ltda',
        nomeFantasia: 'Hospital Santa Cruz',
        cnpjCpf: '60.448.243/0001-56',
        email: 'compras@santacruz.med.br',
        phone: '(11) 98765-4321',
        city: 'São Paulo',
        state: 'SP',
      },
      status: 'Em Separação',
      paymentMethod: 'Boleto PJ 28 Dias',
      total: 3840.00,
      itemsCount: 18,
      nfeNumber: '000.052.118',
      items: [
        {
          productId: 'papel-chamex-a4',
          productName: 'Papel Sulfite A4 75g/m² Chamex Branco (Caixa Master 10 Resmas)',
          sku: 'PAP-CHAMEX-CX10',
          quantity: 10,
          unitPrice: 249.90,
          total: 2499.00,
          image: '/produtos/papelaria/papel-chamex-a4.png',
        },
        {
          productId: 'copos-descartaveis-ecocoppo-200ml',
          productName: 'Copo Plástico Descartável 200ml Branco EcoCoppo (Tira c/ 100)',
          sku: 'DESC-COPO-ECO200',
          quantity: 50,
          unitPrice: 4.80,
          total: 240.00,
          image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
        },
        {
          productId: 'kit-profissional-limpeza-bralimpia',
          productName: 'Kit Profissional de Higienização Bralimpia 30L',
          sku: 'EQUIP-KIT-BRA30L',
          quantity: 3,
          unitPrice: 367.00,
          total: 1101.00,
          image: '/produtos/limpeza/kit-limpeza-bralimpia.png',
        },
      ],
    },
    {
      id: 'LTS-2026-9103',
      orderNumber: '9103',
      date: '2026-11-23 09:45',
      customer: {
        id: 'cust-2',
        razaoSocial: 'Grupo Paulista Saúde LTDA',
        nomeFantasia: 'Grupo Paulista Saúde',
        cnpjCpf: '42.198.341/0001-90',
        email: 'compras@grupopaulista.com.br',
        phone: '(11) 99252-7640',
        city: 'São Paulo',
        state: 'SP',
      },
      status: 'Pagamento Aprovado',
      paymentMethod: 'PIX à Vista',
      total: 1477.50,
      itemsCount: 8,
      nfeNumber: '000.052.117',
      items: [
        {
          productId: 'papel-toalha-santher-eco-et100',
          productName: 'Papel Toalha Interfolhado Santher Eco ET100 (Fardo 1.000 Fls)',
          sku: 'PAP-TOALHA-SAN100',
          quantity: 20,
          unitPrice: 38.90,
          total: 778.00,
          image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
        },
        {
          productId: 'caneta-bic-cristal-azul-50un',
          productName: 'Caneta Esferográfica BIC Cristal Azul 1.0mm (Caixa c/ 50)',
          sku: 'ESC-BIC-AZUL50',
          quantity: 10,
          unitPrice: 48.90,
          total: 489.00,
          image: '/produtos/papelaria/canetas-bic-cristal.png',
        },
        {
          productId: 'copos-descartaveis-ecocoppo-200ml',
          productName: 'Copo Plástico Descartável 200ml Branco EcoCoppo (Tira c/ 100)',
          sku: 'DESC-COPO-ECO200',
          quantity: 40,
          unitPrice: 5.26,
          total: 210.50,
          image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
        },
      ],
    },
    {
      id: 'LTS-2026-9099',
      orderNumber: '9099',
      date: '2026-11-22 16:15',
      customer: {
        id: 'cust-3',
        razaoSocial: 'Condomínio Edifício Mirante Panamby',
        nomeFantasia: 'Condomínio Mirante Panamby',
        cnpjCpf: '08.912.445/0001-12',
        email: 'sindico@mirantepanamby.com.br',
        phone: '(11) 3744-8890',
        city: 'São Paulo',
        state: 'SP',
      },
      status: 'Enviado',
      paymentMethod: 'Boleto PJ 28 Dias',
      total: 2650.00,
      itemsCount: 12,
      nfeNumber: '000.052.105',
      items: [
        {
          productId: 'sacos-lixo-reforcados-100l',
          productName: 'Saco de Lixo Reforçado 100 Litros Micra Alta (Fardo 100 Un)',
          sku: 'LIMP-SACO-100L',
          quantity: 15,
          unitPrice: 65.00,
          total: 975.00,
          image: '/produtos/limpeza/sacos-lixo-reforcados-100l.png',
        },
        {
          productId: 'kit-profissional-limpeza-bralimpia',
          productName: 'Kit Profissional de Higienização Bralimpia 30L',
          sku: 'EQUIP-KIT-BRA30L',
          quantity: 4,
          unitPrice: 389.90,
          total: 1559.60,
          image: '/produtos/limpeza/kit-limpeza-bralimpia.png',
        },
      ],
    },
    {
      id: 'LTS-2026-9088',
      orderNumber: '9088',
      date: '2026-11-21 14:00',
      customer: {
        id: 'cust-4',
        razaoSocial: 'Colégio e Faculdade Prisma Educacional',
        nomeFantasia: 'Colégio Prisma',
        cnpjCpf: '19.456.882/0001-34',
        email: 'almoxarifado@colegioprisma.com.br',
        phone: '(11) 5082-9900',
        city: 'Santo André',
        state: 'SP',
      },
      status: 'Entregue',
      paymentMethod: 'Boleto 14/28/42 Dias',
      total: 6240.00,
      itemsCount: 26,
      nfeNumber: '000.052.091',
      items: [
        {
          productId: 'papel-chamex-a4',
          productName: 'Papel Sulfite A4 75g/m² Chamex Branco (Caixa Master 10 Resmas)',
          sku: 'PAP-CHAMEX-CX10',
          quantity: 20,
          unitPrice: 229.90,
          total: 4598.00,
          image: '/produtos/papelaria/papel-chamex-a4.png',
        },
        {
          productId: 'caneta-bic-cristal-azul-50un',
          productName: 'Caneta Esferográfica BIC Cristal Azul 1.0mm (Caixa c/ 50)',
          sku: 'ESC-BIC-AZUL50',
          quantity: 25,
          unitPrice: 45.00,
          total: 1125.00,
          image: '/produtos/papelaria/canetas-bic-cristal.png',
        },
        {
          productId: 'papel-toalha-santher-eco-et100',
          productName: 'Papel Toalha Interfolhado Santher Eco ET100 (Fardo 1.000 Fls)',
          sku: 'PAP-TOALHA-SAN100',
          quantity: 14,
          unitPrice: 36.92,
          total: 517.00,
          image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
        },
      ],
    },
    {
      id: 'LTS-2026-9075',
      orderNumber: '9075',
      date: '2026-11-20 10:10',
      customer: {
        id: 'cust-5',
        razaoSocial: 'Restaurante & Bar Vila Madalena Ltda',
        nomeFantasia: 'Boteco da Vila',
        cnpjCpf: '33.891.002/0001-88',
        email: 'gestao@botecodavila.com.br',
        phone: '(11) 3812-4455',
        city: 'São Paulo',
        state: 'SP',
      },
      status: 'Entregue',
      paymentMethod: 'Cartão Corporativo',
      total: 1890.00,
      itemsCount: 14,
      nfeNumber: '000.052.074',
      items: [
        {
          productId: 'copos-descartaveis-ecocoppo-200ml',
          productName: 'Copo Plástico Descartável 200ml Branco EcoCoppo (Tira c/ 100)',
          sku: 'DESC-COPO-ECO200',
          quantity: 100,
          unitPrice: 4.20,
          total: 420.00,
          image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
        },
        {
          productId: 'sacos-lixo-reforcados-100l',
          productName: 'Saco de Lixo Reforçado 100 Litros Micra Alta (Fardo 100 Un)',
          sku: 'LIMP-SACO-100L',
          quantity: 18,
          unitPrice: 65.00,
          total: 1170.00,
          image: '/produtos/limpeza/sacos-lixo-reforcados-100l.png',
        },
        {
          productId: 'papel-toalha-santher-eco-et100',
          productName: 'Papel Toalha Interfolhado Santher Eco ET100 (Fardo 1.000 Fls)',
          sku: 'PAP-TOALHA-SAN100',
          quantity: 8,
          unitPrice: 37.50,
          total: 300.00,
          image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
        },
      ],
    },
    {
      id: 'LTS-2026-9062',
      orderNumber: '9062',
      date: '2026-11-19 17:30',
      customer: {
        id: 'cust-6',
        razaoSocial: 'Logística & Transportes Sudeste S.A.',
        nomeFantasia: 'TransSudeste Log',
        cnpjCpf: '11.222.333/0001-44',
        email: 'fiscal@transsudeste.com.br',
        phone: '(11) 2190-7700',
        city: 'Guarulhos',
        state: 'SP',
      },
      status: 'Aguardando Pagamento',
      paymentMethod: 'Boleto PJ 28 Dias',
      total: 3120.00,
      itemsCount: 15,
      items: [
        {
          productId: 'sacos-lixo-reforcados-100l',
          productName: 'Saco de Lixo Reforçado 100 Litros Micra Alta (Fardo 100 Un)',
          sku: 'LIMP-SACO-100L',
          quantity: 30,
          unitPrice: 62.00,
          total: 1860.00,
          image: '/produtos/limpeza/sacos-lixo-reforcados-100l.png',
        },
        {
          productId: 'papel-toalha-santher-eco-et100',
          productName: 'Papel Toalha Interfolhado Santher Eco ET100 (Fardo 1.000 Fls)',
          sku: 'PAP-TOALHA-SAN100',
          quantity: 34,
          unitPrice: 37.05,
          total: 1260.00,
          image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
        },
      ],
    },
  ];
}

function generateInitialCustomers(): CustomerStats[] {
  return [
    {
      id: 'cust-1',
      name: 'Dr. Roberto Macedo',
      razaoSocial: 'Hospital Santa Cruz de São Paulo Ltda',
      cnpjCpf: '60.448.243/0001-56',
      email: 'compras@santacruz.med.br',
      phone: '(11) 98765-4321',
      accountType: 'pj',
      createdAt: '2025-08-14',
      ordersCount: 28,
      totalSpent: 84320.00,
      lastOrderDate: '23/11/2026',
      status: 'Ativo',
    },
    {
      id: 'cust-2',
      name: 'José Antonio Rodrigues',
      razaoSocial: 'Grupo Paulista Saúde LTDA',
      cnpjCpf: '42.198.341/0001-90',
      email: 'compras@grupopaulista.com.br',
      phone: '(11) 99252-7640',
      accountType: 'pj',
      createdAt: '2026-03-17',
      ordersCount: 12,
      totalSpent: 32680.00,
      lastOrderDate: '23/11/2026',
      status: 'Ativo',
    },
    {
      id: 'cust-3',
      name: 'Juliana Silveira Ramos',
      razaoSocial: 'Condomínio Edifício Mirante Panamby',
      cnpjCpf: '08.912.445/0001-12',
      email: 'sindico@mirantepanamby.com.br',
      phone: '(11) 3744-8890',
      accountType: 'pj',
      createdAt: '2026-01-10',
      ordersCount: 9,
      totalSpent: 21450.00,
      lastOrderDate: '22/11/2026',
      status: 'Ativo',
    },
    {
      id: 'cust-4',
      name: 'Prof. Marcos Vinicius',
      razaoSocial: 'Colégio e Faculdade Prisma Educacional',
      cnpjCpf: '19.456.882/0001-34',
      email: 'almoxarifado@colegioprisma.com.br',
      phone: '(11) 5082-9900',
      accountType: 'pj',
      createdAt: '2025-11-05',
      ordersCount: 15,
      totalSpent: 53120.00,
      lastOrderDate: '21/11/2026',
      status: 'Ativo',
    },
    {
      id: 'cust-5',
      name: 'Arthur Fonseca',
      razaoSocial: 'Restaurante & Bar Vila Madalena Ltda',
      cnpjCpf: '33.891.002/0001-88',
      email: 'gestao@botecodavila.com.br',
      phone: '(11) 3812-4455',
      accountType: 'pj',
      createdAt: '2026-04-20',
      ordersCount: 18,
      totalSpent: 38940.00,
      lastOrderDate: '20/11/2026',
      status: 'Ativo',
    },
    {
      id: 'cust-6',
      name: 'Luciana Queiroz',
      razaoSocial: 'Logística & Transportes Sudeste S.A.',
      cnpjCpf: '11.222.333/0001-44',
      email: 'fiscal@transsudeste.com.br',
      phone: '(11) 2190-7700',
      accountType: 'pj',
      createdAt: '2026-06-12',
      ordersCount: 6,
      totalSpent: 16780.00,
      lastOrderDate: '19/11/2026',
      status: 'Ativo',
    },
  ];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS[0]; // Default autenticado como Super Admin para facilidade de demonstração/acesso imediato
    } catch {
      return INITIAL_ADMIN_USERS[0];
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [products, setProducts] = useState<AdminProduct[]>(() => generateInitialProducts());
  const [orders, setOrders] = useState<AdminOrder[]>(() => generateInitialOrders());
  const [customers, setCustomers] = useState<CustomerStats[]>(() => generateInitialCustomers());
  const [settings, setSettings] = useState<AdminSystemSettings>(INITIAL_SETTINGS);

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('ultimos-30-dias');
  const [customDateRange, setCustomDateRange] = useState({
    start: '2026-11-01',
    end: '2026-11-23',
  });

  // Salvar sessão
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [currentAdmin]);

  const loginAdmin = (email: string, pass: string) => {
    const found = adminUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.status === 'Ativo'
    );
    if (!found) {
      return { ok: false, error: 'Administrador não localizado ou inativo.' };
    }
    // Senha padrão administrativa ou qualquer senha em ambiente de teste
    if (pass.length < 4) {
      return { ok: false, error: 'A senha informada deve ter pelo menos 4 caracteres.' };
    }
    const updated = { ...found, lastLogin: 'Agora' };
    setCurrentAdmin(updated);
    return { ok: true };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
  };

  const addAdminUser = (user: Omit<AdminUser, 'id'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `adm-${Date.now()}`,
    };
    setAdminUsers((prev) => [...prev, newUser]);
  };

  const toggleAdminUserStatus = (id: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u))
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const addOrderFromStore = (order: AdminOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  const addProduct = (p: Omit<AdminProduct, 'id' | 'salesCount' | 'revenueGenerated' | 'updatedAt'>) => {
    const newProduct: AdminProduct = {
      ...p,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      revenueGenerated: 0,
      updatedAt: new Date().toISOString().split('T')[0],
      published: true,
      minStockAlert: p.minStockAlert || 15,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, patch: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...patch, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  const updateSettings = (patch: Partial<AdminSystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  // Cálculo das métricas baseadas no período selecionado
  const metrics = useMemo(() => {
    // Multiplicador temporal baseado no período selecionado para manter coerência proporcional
    let multiplier = 1;
    let daysCount = 30;

    switch (selectedPeriod) {
      case 'hoje':
        multiplier = 0.15;
        daysCount = 1;
        break;
      case 'ultimos-7-dias':
        multiplier = 0.35;
        daysCount = 7;
        break;
      case 'ultimos-30-dias':
      case 'este-mes':
        multiplier = 1.0;
        daysCount = 30;
        break;
      case 'mes-anterior':
        multiplier = 0.92;
        daysCount = 30;
        break;
      case 'ultimos-90-dias':
        multiplier = 2.8;
        daysCount = 90;
        break;
      case 'este-ano':
        multiplier = 9.4;
        daysCount = 330;
        break;
      default:
        multiplier = 1.0;
        daysCount = 30;
    }

    const baseRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelado' ? sum + o.total : sum), 0);
    const totalRevenue = Math.round(baseRevenue * multiplier * 4.2);
    const previousRevenue = Math.round(totalRevenue * 0.88);
    const revenueGrowth = +(((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1);

    const baseOrders = orders.filter((o) => o.status !== 'Cancelado').length;
    const totalOrders = Math.max(1, Math.round(baseOrders * multiplier * 4.2));
    const previousOrders = Math.max(1, Math.round(totalOrders * 0.91));
    const ordersGrowth = +(((totalOrders - previousOrders) / previousOrders) * 100).toFixed(1);

    const averageTicket = +(totalRevenue / totalOrders).toFixed(2);
    const previousTicket = +(previousRevenue / previousOrders).toFixed(2);
    const ticketGrowth = +(((averageTicket - previousTicket) / previousTicket) * 100).toFixed(1);

    const baseProductsSold = orders.reduce((sum, o) => sum + o.itemsCount, 0);
    const productsSold = Math.round(baseProductsSold * multiplier * 4.5);
    const previousProductsSold = Math.round(productsSold * 0.86);
    const productsSoldGrowth = +(((productsSold - previousProductsSold) / previousProductsSold) * 100).toFixed(1);

    const pendingOrdersCount = orders.filter((o) => o.status === 'Aguardando Pagamento' || o.status === 'Em Separação').length;
    const conversionRate = 3.8; // Base B2B saudável corporativa

    return {
      totalRevenue,
      previousRevenue,
      revenueGrowth,
      totalOrders,
      previousOrders,
      ordersGrowth,
      averageTicket,
      previousTicket,
      ticketGrowth,
      productsSold,
      previousProductsSold,
      productsSoldGrowth,
      pendingOrdersCount,
      conversionRate,
    };
  }, [orders, selectedPeriod]);

  // Gráfico cronológico de faturamento
  const salesTimeline = useMemo<SalesReportDay[]>(() => {
    const days: SalesReportDay[] = [];
    const count = selectedPeriod === 'hoje' ? 12 : selectedPeriod === 'ultimos-7-dias' ? 7 : 14;

    const baseDaily = metrics.totalRevenue / count;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(2026, 10, 23 - i);
      const dayLabel = selectedPeriod === 'hoje'
        ? `${8 + i}:00`
        : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      // Variação natural para o gráfico
      const factor = 0.75 + ((i * 37) % 55) / 100;
      const prevFactor = 0.70 + ((i * 29) % 50) / 100;
      const revenue = Math.round(baseDaily * factor);
      const previousRevenue = Math.round(baseDaily * prevFactor);
      const ordersCount = Math.max(1, Math.round(revenue / (metrics.averageTicket || 850)));

      days.push({
        date: d.toISOString().split('T')[0],
        dayLabel,
        revenue,
        ordersCount,
        previousRevenue,
      });
    }

    return days;
  }, [selectedPeriod, metrics.totalRevenue, metrics.averageTicket]);

  // Distribuição de vendas por categoria real
  const categoryPerformance = useMemo<CategorySalesSummary[]>(() => {
    const catMap: Record<string, { revenue: number; count: number; name: string; color: string }> = {
      'limpeza-e-higiene': { revenue: 0, count: 0, name: 'Limpeza e Higiene', color: '#0F668E' },
      'food-service-e-descartaveis': { revenue: 0, count: 0, name: 'Food Service e Descartáveis', color: '#FB8C00' },
      'escritorio-e-papelaria': { revenue: 0, count: 0, name: 'Escritório e Papelaria', color: '#1863DC' },
      'equipamentos-de-limpeza': { revenue: 0, count: 0, name: 'Equipamentos de Limpeza', color: '#16A34A' },
      'artesanato-tecidos-festas': { revenue: 0, count: 0, name: 'Artesanato e Festas', color: '#8B5CF6' },
    };

    products.forEach((p) => {
      const key = p.categorySlug || 'limpeza-e-higiene';
      if (!catMap[key]) {
        catMap[key] = { revenue: 0, count: 0, name: p.category, color: '#64748B' };
      }
      catMap[key].revenue += p.revenueGenerated;
      catMap[key].count += p.salesCount;
    });

    const totalRev = Object.values(catMap).reduce((s, c) => s + c.revenue, 0) || 1;

    return Object.entries(catMap).map(([slug, item]) => ({
      categorySlug: slug,
      categoryName: item.name,
      revenue: item.revenue,
      ordersCount: item.count,
      percentage: +((item.revenue / totalRev) * 100).toFixed(1),
      color: item.color,
    })).sort((a, b) => b.revenue - a.revenue);
  }, [products]);

  // Ranking de produtos mais vendidos
  const topSellingProducts = useMemo(() => {
    return [...products].sort((a, b) => b.salesCount - a.salesCount);
  }, [products]);

  return (
    <AdminContext.Provider
      value={{
        currentAdmin,
        isAdminAuthenticated: !!currentAdmin,
        adminUsers,
        loginAdmin,
        logoutAdmin,
        addAdminUser,
        toggleAdminUserStatus,
        orders,
        updateOrderStatus,
        addOrderFromStore,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        customers,
        settings,
        updateSettings,
        selectedPeriod,
        setSelectedPeriod,
        customDateRange,
        setCustomDateRange,
        metrics,
        salesTimeline,
        categoryPerformance,
        topSellingProducts,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  }
  return context;
};
