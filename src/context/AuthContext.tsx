import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApprovedBuyer,
  CompanyAddress,
  CompanyUser,
  CorporateOrder,
} from '../types';

export interface RegisterCompanyPayload {
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
  password: string;
  address: {
    label: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface StoredAccount {
  user: CompanyUser;
  password: string;
}

interface AuthContextType {
  user: CompanyUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => { ok: boolean; error?: string };
  loginDemoCorporate: () => void;
  register: (payload: RegisterCompanyPayload) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<CompanyUser>) => void;
  addAddress: (addr: Omit<CompanyAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addBuyer: (buyer: Omit<ApprovedBuyer, 'id'>) => void;
  toggleBuyer: (id: string) => void;
  addOrder: (order: CorporateOrder) => void;
  requestCreditIncrease: (requestedLimit: number) => void;
}

const SESSION_KEY = 'lothus_auth_session_v1';
const ACCOUNTS_KEY = 'lothus_auth_accounts_v1';

const DEMO_CORPORATE_USER: CompanyUser = {
  id: 'JA20260317122747',
  accountType: 'pj',
  cnpjCpf: '42.198.341/0001-90',
  razaoSocial: 'Grupo Paulista Saúde LTDA',
  nomeFantasia: 'Grupo Paulista Saúde',
  inscricaoEstadual: '148.920.311.114',
  segment: 'Clínica / Saúde / Suprimentos',
  buyerName: 'José Antonio Rodrigues Feitosa',
  buyerRole: 'Analista sistemas, desenvolvedor de software / Comprador Master B2B',
  email: 'jose.antonio.220507@gmail.com',
  phone: '+55 11 99252-7640',
  whatsappNotifications: true,
  creditStatus: 'Aprovado',
  creditLimit: 50000,
  creditUsed: 6580,
  paymentTerms: 'Boleto PJ 28 dias • PIX -5%',
  createdAt: '2026-03-17',
  addresses: [
    {
      id: 'addr-sargento-1',
      label: 'Endereço residencial e fiscal',
      cep: '04674-225',
      street: 'Avenida Sargento Geraldo Sant\'Ana',
      number: '683',
      complement: 'Ap 41 BL 4',
      neighborhood: 'Jurubatuba',
      city: 'São Paulo',
      state: 'SP',
      isDefault: true,
    },
    {
      id: 'addr-sargento-2',
      label: 'Endereço cadastral adicional',
      cep: '04674-225',
      street: 'Avenida Sargento Geraldo Sant\'Ana',
      number: '683',
      complement: 'Apto 41 Bloco 4',
      neighborhood: 'Jurubatuba',
      city: 'São Paulo',
      state: 'SP',
      isDefault: false,
    },
    {
      id: 'addr-borba',
      label: 'Endereço comercial / Entrega rápida',
      cep: '04811-120',
      street: 'Avenida Rubens Montanaro de Borba',
      number: '477',
      complement: '',
      neighborhood: 'São Paulo',
      city: 'São Paulo',
      state: 'SP',
      isDefault: false,
    },
  ],
  buyers: [
    {
      id: 'buy-1',
      name: 'Mariana Alencar',
      role: 'Coordenadora de Suprimentos (Admin)',
      email: 'compras@grupopaulista.com.br',
      monthlyLimit: 25000,
      active: true,
    },
    {
      id: 'buy-2',
      name: 'Ricardo Nogueira',
      role: 'Supervisor de Facilities — Jardins',
      email: 'facilities.jardins@grupopaulista.com.br',
      monthlyLimit: 6000,
      active: true,
    },
    {
      id: 'buy-3',
      name: 'Camila Ferreira',
      role: 'Analista Administrativo',
      email: 'adm@grupopaulista.com.br',
      monthlyLimit: 3500,
      active: false,
    },
  ],
  orders: [
    {
      id: 'LTS-2026-8412',
      date: '14/11/2026',
      status: 'Em Transporte',
      paymentMethod: 'Boleto PJ 28 Dias',
      total: 1477.50,
      nfeNumber: '000.049.821',
      deliveryAddressLabel: 'Matriz / Almoxarifado Central',
      items: [
        {
          productId: 'santher-eco-et100',
          sku: 'LIM-SANT-ET100',
          name: 'Papel Toalha Interfolhado Santher Eco ET100 (Fardo c/ 2.000 Folhas)',
          quantity: 15,
          unit: 'Fardo c/ 2.000 fls',
          unitPrice: 32.90,
          image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
        },
        {
          productId: 'papel-chamex-a4',
          sku: 'PAP-CHAMEX-CX10',
          name: 'Papel Sulfite A4 75g/m² Chamex Branco (Caixa Master c/ 10 Resmas)',
          quantity: 3,
          unit: 'Caixa c/ 10 resmas',
          unitPrice: 269.90,
          image: '/produtos/papelaria/papel-chamex-a4.png',
        },
        {
          productId: 'copos-descartaveis-ecocoppo-200ml',
          sku: 'DESC-COPO-ECO200',
          name: 'Copo Plástico Descartável 200ml EcoCoppo (Tira c/ 100 Unidades)',
          quantity: 30,
          unit: 'Tira c/ 100 un.',
          unitPrice: 5.20,
          image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
        },
      ],
    },
    {
      id: 'LTS-2026-7904',
      date: '29/10/2026',
      status: 'Entregue',
      paymentMethod: 'PIX Corporativo (-5%)',
      total: 869.60,
      nfeNumber: '000.048.105',
      deliveryAddressLabel: 'Unidade Ambulatorial Jardins',
      items: [
        {
          productId: 'kit-profissional-limpeza-bralimpia',
          sku: 'EQUIP-KIT-BRA30L',
          name: 'Kit Profissional de Higienização Bralimpia: Balde Doblô 30L + Mop',
          quantity: 2,
          unit: 'Kit Completo',
          unitPrice: 389.90,
          image: '/produtos/limpeza/kit-limpeza-bralimpia.png',
        },
        {
          productId: 'caixa-canetas-bic-cristal-azul',
          sku: 'PAP-BIC-AZ50',
          name: 'Caneta Esferográfica BIC Cristal Média 1.0mm Azul (Caixa c/ 50 un.)',
          quantity: 2,
          unit: 'Caixa c/ 50 un.',
          unitPrice: 44.90,
          image: '/produtos/papelaria/caixa-canetas-bic-cristal-azul.png',
        },
      ],
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeDigits = (val: string) => val.replace(/\D/g, '');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CompanyUser | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const saveStoredAccounts = (accounts: StoredAccount[]) => {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  };

  const syncUserToAccounts = (updatedUser: CompanyUser) => {
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex((a) => a.user.id === updatedUser.id);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], user: updatedUser };
      saveStoredAccounts(accounts);
    }
  };

  const login = (identifier: string, password: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = normalizeDigits(identifier);

    // Check built-in corporate demo account
    if (
      (clean === DEMO_CORPORATE_USER.email ||
        (cleanDigits && cleanDigits === normalizeDigits(DEMO_CORPORATE_USER.cnpjCpf))) &&
      (password === 'demo123' || password === 'lothus123')
    ) {
      setUser(DEMO_CORPORATE_USER);
      return { ok: true };
    }

    const accounts = getStoredAccounts();
    const match = accounts.find((acc) => {
      const emailMatch = acc.user.email.toLowerCase() === clean;
      const docMatch = cleanDigits.length >= 11 && normalizeDigits(acc.user.cnpjCpf) === cleanDigits;
      return (emailMatch || docMatch) && acc.password === password;
    });

    if (!match) {
      return {
        ok: false,
        error: 'E-mail/CNPJ ou senha inválidos. Use o acesso rápido Demo ou cadastre sua empresa.',
      };
    }

    setUser(match.user);
    return { ok: true };
  };

  const loginDemoCorporate = () => {
    setUser(DEMO_CORPORATE_USER);
  };

  const register = (payload: RegisterCompanyPayload) => {
    const accounts = getStoredAccounts();
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanDigits = normalizeDigits(payload.cnpjCpf);

    const duplicate = accounts.find(
      (a) =>
        a.user.email.toLowerCase() === cleanEmail ||
        (cleanDigits.length >= 11 && normalizeDigits(a.user.cnpjCpf) === cleanDigits)
    );

    if (duplicate) {
      return {
        ok: false,
        error: 'Já existe uma conta cadastrada com este e-mail ou CNPJ/CPF.',
      };
    }

    const newUser: CompanyUser = {
      id: `emp-${Date.now()}`,
      accountType: payload.accountType,
      cnpjCpf: payload.cnpjCpf.trim(),
      razaoSocial: payload.razaoSocial.trim(),
      nomeFantasia: payload.nomeFantasia.trim() || payload.razaoSocial.trim(),
      inscricaoEstadual: payload.inscricaoEstadual.trim() || 'ISENTO',
      segment: payload.segment || 'Escritório / Corporativo',
      buyerName: payload.buyerName.trim(),
      buyerRole: payload.buyerRole.trim() || 'Responsável de Compras',
      email: cleanEmail,
      phone: payload.phone.trim(),
      whatsappNotifications: true,
      creditStatus: payload.accountType === 'pj' ? 'Em Análise' : 'Aprovado',
      creditLimit: payload.accountType === 'pj' ? 12000 : 0,
      creditUsed: 0,
      paymentTerms:
        payload.accountType === 'pj'
          ? 'PIX -5% imediato • Boleto PJ em análise (24h)'
          : 'PIX -5% imediato • Cartão em até 3x',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      addresses: [
        {
          id: `addr-${Date.now()}`,
          label: payload.address.label.trim() || 'Endereço Principal',
          cep: payload.address.cep.trim(),
          street: payload.address.street.trim(),
          number: payload.address.number.trim(),
          complement: payload.address.complement?.trim(),
          neighborhood: payload.address.neighborhood.trim(),
          city: payload.address.city.trim(),
          state: payload.address.state.trim().toUpperCase(),
          isDefault: true,
        },
      ],
      buyers: [
        {
          id: `buy-${Date.now()}`,
          name: payload.buyerName.trim(),
          role: `${payload.buyerRole.trim() || 'Responsável de Compras'} (Principal)`,
          email: cleanEmail,
          monthlyLimit: payload.accountType === 'pj' ? 12000 : undefined,
          active: true,
        },
      ],
      orders: [],
    };

    accounts.push({ user: newUser, password: payload.password });
    saveStoredAccounts(accounts);
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (patch: Partial<CompanyUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const addAddress = (addr: Omit<CompanyAddress, 'id'>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newAddr: CompanyAddress = { ...addr, id: `addr-${Date.now()}` };
      const existing = addr.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false }))
        : prev.addresses;
      const updated = { ...prev, addresses: [...existing, newAddr] };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const removeAddress = (id: string) => {
    setUser((prev) => {
      if (!prev || prev.addresses.length <= 1) return prev;
      const filtered = prev.addresses.filter((a) => a.id !== id);
      if (!filtered.some((a) => a.isDefault) && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      const updated = { ...prev, addresses: filtered };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const addBuyer = (buyer: Omit<ApprovedBuyer, 'id'>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        buyers: [...prev.buyers, { ...buyer, id: `buy-${Date.now()}` }],
      };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const toggleBuyer = (id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        buyers: prev.buyers.map((b) =>
          b.id === id ? { ...b, active: !b.active } : b
        ),
      };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const addOrder = (order: CorporateOrder) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        orders: [order, ...prev.orders],
      };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  const requestCreditIncrease = (requestedLimit: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: CompanyUser = {
        ...prev,
        creditLimit: Math.max(prev.creditLimit, requestedLimit),
        creditStatus: 'Em Análise',
      };
      syncUserToAccounts(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginDemoCorporate,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        addBuyer,
        toggleBuyer,
        addOrder,
        requestCreditIncrease,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const FALLBACK_AUTH: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => ({ ok: false, error: 'Contexto não inicializado.' }),
  loginDemoCorporate: () => {},
  register: () => ({ ok: false, error: 'Contexto não inicializado.' }),
  logout: () => {},
  updateProfile: () => {},
  addAddress: () => {},
  removeAddress: () => {},
  setDefaultAddress: () => {},
  addBuyer: () => {},
  toggleBuyer: () => {},
  addOrder: () => {},
  requestCreditIncrease: () => {},
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx || FALLBACK_AUTH;
};
