import { Product, Department, CorporateOrder } from './index';

export type AdminRole = 'Super Admin' | 'Gerente Comercial' | 'Operador de Logística';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  status: 'Ativo' | 'Inativo';
  lastLogin?: string;
}

export type PeriodFilter =
  | 'hoje'
  | 'ultimos-7-dias'
  | 'ultimos-30-dias'
  | 'ultimos-90-dias'
  | 'este-mes'
  | 'mes-anterior'
  | 'este-ano'
  | 'personalizado';

export type AdminOrderStatus =
  | 'Aguardando Pagamento'
  | 'Pagamento Aprovado'
  | 'Em Separação'
  | 'Enviado'
  | 'Entregue'
  | 'Cancelado';

export interface AdminOrderCustomer {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpjCpf: string;
  email: string;
  phone: string;
  city: string;
  state: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  date: string;
  customer: AdminOrderCustomer;
  status: AdminOrderStatus;
  paymentMethod: 'Boleto PJ 28 Dias' | 'Boleto 14/28/42 Dias' | 'PIX à Vista' | 'Cartão de Crédito 3x' | 'Cartão Corporativo';
  total: number;
  itemsCount: number;
  nfeNumber?: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image: string;
  }[];
}

export interface CustomerStats {
  id: string;
  name: string;
  razaoSocial: string;
  cnpjCpf: string;
  email: string;
  phone: string;
  accountType: 'pj' | 'pf';
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Ativo' | 'Em Análise' | 'Inativo';
}

export interface SalesReportDay {
  date: string;
  dayLabel: string;
  revenue: number;
  ordersCount: number;
  previousRevenue?: number;
}

export interface CategorySalesSummary {
  categorySlug: string;
  categoryName: string;
  revenue: number;
  ordersCount: number;
  percentage: number;
  color: string;
}

export interface AdminProduct extends Product {
  published: boolean;
  minStockAlert: number;
  salesCount: number;
  revenueGenerated: number;
  updatedAt: string;
}

export interface AdminSystemSettings {
  storeName: string;
  cnpj: string;
  corporateEmail: string;
  supportPhone: string;
  minOrderB2B: number;
  freeShippingThreshold: number;
  notifyLowStock: boolean;
  lowStockThreshold: number;
  autoApprovePix: boolean;
  maintenanceMode: boolean;
}
