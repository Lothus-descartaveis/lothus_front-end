export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discountPixPercent: number;
  installmentsMax: number;
  image: string;
  badge?: string;
  badgeColor?: 'orange' | 'blue' | 'green';
  rating: number;
  reviewsCount: number;
  sku: string;
  brand: string;
  isFlashDeal?: boolean;
  isBestSeller?: boolean;
  unit: string;
  minOrderQuantity?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  itemsIncluded?: string[];
  b2bPrices?: {
    minQty: number;
    price: number;
  }[];
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  discountBadge: string;
  image: string;
  iconName: string;
}

export interface KitCombo {
  id: string;
  title: string;
  badge: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  image: string;
  itemsIncluded: string[];
  economyAmount?: number;
}

export interface CompanyAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface ApprovedBuyer {
  id: string;
  name: string;
  role: string;
  email: string;
  monthlyLimit?: number;
  active: boolean;
}

export type OrderStatus =
  | 'Em Separação'
  | 'Faturado • NF-e Emitida'
  | 'Em Transporte'
  | 'Entregue';

export interface CorporateOrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  image: string;
}

export interface CorporateOrder {
  id: string;
  date: string;
  status: OrderStatus;
  paymentMethod: string;
  total: number;
  nfeNumber?: string;
  deliveryAddressLabel: string;
  items: CorporateOrderItem[];
}

export interface CompanyUser {
  id: string;
  accountType: 'pj' | 'pf';
  cnpjCpf: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  segment: string;
  buyerName: string;
  buyerRole: string;
  email: string;
  phone: string;
  whatsappNotifications: boolean;
  creditStatus: 'Aprovado' | 'Em Análise';
  creditLimit: number;
  creditUsed: number;
  paymentTerms: string;
  addresses: CompanyAddress[];
  buyers: ApprovedBuyer[];
  orders: CorporateOrder[];
  createdAt: string;
}
