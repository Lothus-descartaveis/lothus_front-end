import React, { useEffect, useState, useMemo } from 'react';
import {
  ShieldCheck,
  QrCode,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Truck,
  Package,
  MapPin,
  Clock,
  Copy,
  Printer,
  Check,
  Tag,
  Store,
  Lock,
  MessageCircle,
  Receipt,
  User,
  Building2
} from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSEO } from '../hooks/useSEO';

interface CheckoutPageProps {
  onNavigate?: (page: string) => void;
}

type CheckoutStep = 'dados' | 'entrega' | 'pagamento' | 'revisao';
type ShippingOptionId = 'express-full' | 'transportadora' | 'retirada-hub';

interface ShippingMethod {
  id: ShippingOptionId;
  name: string;
  badge?: string;
  prazo: string;
  descricao: string;
  preco: number;
  icon: 'full' | 'truck' | 'store';
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'express-full',
    name: 'Lothus Express Full',
    badge: 'Chegará amanhã',
    prazo: '1 a 2 dias úteis',
    descricao: 'Despacho prioritário direto do Centro de Distribuição em SP.',
    preco: 0,
    icon: 'full',
  },
  {
    id: 'transportadora',
    name: 'Transportadora B2B Convencional',
    badge: 'Econômico',
    prazo: '3 a 5 dias úteis',
    descricao: 'Ideal para cargas pesadas e fardos corporativos no estado de SP.',
    preco: 19.90,
    icon: 'truck',
  },
  {
    id: 'retirada-hub',
    name: 'Retirar no CD Lothus (Jurubatuba/SP)',
    badge: 'Grátis',
    prazo: 'Disponível em 24h úteis',
    descricao: 'Av. Eng. Eusébio Stevaux, 1200 - Doca 3 - Jurubatuba, São Paulo/SP.',
    preco: 0,
    icon: 'store',
  },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Checkout Corporativo & Faturamento B2B | Lothus Descartáveis',
    description: 'Finalize sua compra corporativa com segurança. Pagamento via PIX com 5% de desconto, boleto faturado para CNPJ ou cartão de crédito em até 6x.',
    canonical: 'https://lothusdescartaveis.com.br/checkout'
  });

  const { user, addOrder } = useAuth();
  const { items, subtotal, clearCart, addItem } = useCart();

  // Etapa ativa
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('dados');

  // Tipo de Faturamento
  const [customerType, setCustomerType] = useState<'pj' | 'pf'>(user?.accountType || 'pj');

  // Dados Fiscais
  const defaultAddr = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];
  const [formData, setFormData] = useState({
    cnpjCpf: user?.cnpjCpf || '48.291.604/0001-32',
    razaoNome: user?.razaoSocial || 'Grupo Paulista Saúde & Diagnósticos Ltda',
    nomeFantasia: user?.nomeFantasia || 'Grupo Paulista Saúde',
    inscricaoEstadual: user?.inscricaoEstadual || '148.920.311.114',
    isentoIE: false,
    email: user?.email || 'compras@grupopaulista.com.br',
    telefone: user?.phone || '(11) 98412-5509',
  });

  // Endereço de Entrega
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || 'addr-matriz');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState({
    cep: defaultAddr?.cep || '04543-011',
    street: defaultAddr?.street || 'Av. Presidente Juscelino Kubitschek',
    number: defaultAddr?.number || '1450',
    complement: defaultAddr?.complement || 'Doca B - Almoxarifado Central',
    neighborhood: defaultAddr?.neighborhood || 'Vila Nova Conceição',
    city: defaultAddr?.city || 'São Paulo',
    state: defaultAddr?.state || 'SP',
    label: 'Matriz / Almoxarifado Central',
  });

  // Opção de Frete
  const [shippingOption, setShippingOption] = useState<ShippingOptionId>('express-full');

  // Forma de Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto-pj'>('pix');

  // Dados do Cartão
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1',
    saveCard: true,
  });

  // Cupom de Desconto
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent?: number; discountFixed?: number } | null>({
    code: 'B2BPRIME',
    discountPercent: 5,
  });
  const [couponMessage, setCouponMessage] = useState<string>('Cupom B2BPRIME aplicado (5% OFF)');

  // Pedido Concluído
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [pixPaidSimulated, setPixPaidSimulated] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState<number>(899);

  // Sincronizar dados do usuário
  useEffect(() => {
    if (!user) return;
    setCustomerType(user.accountType);
    const addr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
    setFormData({
      cnpjCpf: user.cnpjCpf,
      razaoNome: user.razaoSocial,
      nomeFantasia: user.nomeFantasia || '',
      inscricaoEstadual: user.inscricaoEstadual || '',
      isentoIE: false,
      email: user.email,
      telefone: user.phone,
    });
    if (addr) {
      setSelectedAddressId(addr.id);
      setAddressForm({
        cep: addr.cep,
        street: addr.street,
        number: addr.number,
        complement: addr.complement || '',
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        label: addr.label,
      });
    }
  }, [user]);

  // Timer do Pix
  useEffect(() => {
    if (!orderCompleted || paymentMethod !== 'pix' || pixPaidSimulated) return;
    const interval = setInterval(() => {
      setPixTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [orderCompleted, paymentMethod, pixPaidSimulated]);

  // Cálculos Financeiros
  const currentShipping = SHIPPING_METHODS.find((s) => s.id === shippingOption) || SHIPPING_METHODS[0];
  const shippingCost = currentShipping.preco;

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return (subtotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.discountFixed) {
      return Math.min(appliedCoupon.discountFixed, subtotal);
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  const pixDiscount = useMemo(() => {
    if (paymentMethod !== 'pix') return 0;
    const base = Math.max(0, subtotal - couponDiscount);
    return base * 0.05;
  }, [paymentMethod, subtotal, couponDiscount]);

  const finalTotal = useMemo(() => {
    const base = subtotal - couponDiscount - pixDiscount + shippingCost;
    return Math.max(0, base);
  }, [subtotal, couponDiscount, pixDiscount, shippingCost]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const pixPayload = useMemo(() => {
    const rand = Math.floor(10000000 + Math.random() * 90000000);
    return `00020126580014br.gov.bcb.pix0136lothus-${rand}-faturamento@lothus.com.br520400005303986540${finalTotal.toFixed(2)}5802BR5918LOTHUS DESCARTAVEIS6009SAO PAULO62070503***6304E8A2`;
  }, [finalTotal]);

  const boletoDigitable = '34191.09008 01234.567890 12345.678901 8 98760000' + Math.floor(finalTotal * 100).toString().padStart(6, '0');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;
    if (clean === 'LOTHUS10') {
      setAppliedCoupon({ code: 'LOTHUS10', discountPercent: 10 });
      setCouponMessage('Cupom LOTHUS10 aplicado: 10% de desconto');
    } else if (clean === 'PRIMEIRACOMPRA') {
      setAppliedCoupon({ code: 'PRIMEIRACOMPRA', discountFixed: 30 });
      setCouponMessage('Cupom PRIMEIRACOMPRA aplicado: R$ 30,00 de desconto');
    } else if (clean === 'B2BPRIME') {
      setAppliedCoupon({ code: 'B2BPRIME', discountPercent: 5 });
      setCouponMessage('Cupom B2BPRIME aplicado: 5% de desconto');
    } else {
      setCouponMessage('Cupom inválido ou expirado');
    }
  };

  const handleLookupCep = (cepValue: string) => {
    const clean = cepValue.replace(/\D/g, '');
    setAddressForm((prev) => ({ ...prev, cep: cepValue }));
    if (clean.length === 8) {
      if (clean.startsWith('04543') || clean.startsWith('04')) {
        setAddressForm((prev) => ({
          ...prev,
          street: 'Av. Presidente Juscelino Kubitschek',
          neighborhood: 'Vila Nova Conceição',
          city: 'São Paulo',
          state: 'SP',
        }));
      } else if (clean.startsWith('01414') || clean.startsWith('01')) {
        setAddressForm((prev) => ({
          ...prev,
          street: 'Rua Haddock Lobo',
          neighborhood: 'Cerqueira César',
          city: 'São Paulo',
          state: 'SP',
        }));
      } else {
        setAddressForm((prev) => ({
          ...prev,
          street: 'Avenida das Nações Unidas',
          neighborhood: 'Brooklin',
          city: 'São Paulo',
          state: 'SP',
        }));
      }
    }
  };

  const handleFinishOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = `LTS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const addrLabel = addressForm.label || `${addressForm.street}, ${addressForm.number} - ${addressForm.city}/${addressForm.state}`;

    const paymentLabel =
      paymentMethod === 'pix'
        ? 'PIX Dinâmico Instantâneo (-5%)'
        : paymentMethod === 'cartao'
        ? `Cartão de Crédito (${cardData.installments}x de ${(finalTotal / parseInt(cardData.installments || '1')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`
        : 'Boleto Faturado PJ (28 Dias)';

    if (items.length > 0) {
      addOrder({
        id: num,
        date: new Date().toLocaleDateString('pt-BR'),
        status: paymentMethod === 'pix' ? 'Em Separação' : 'Faturado • NF-e Emitida',
        paymentMethod: paymentLabel,
        total: finalTotal,
        nfeNumber: `NFe-${Math.floor(100000 + Math.random() * 900000)}`,
        deliveryAddressLabel: addrLabel,
        items: items.map((item) => ({
          productId: item.product.id,
          sku: item.product.sku,
          name: item.product.name,
          quantity: item.quantity,
          unit: item.product.unit,
          unitPrice: item.product.price,
          image: item.product.image,
        })),
      });
    }

    setOrderNumber(num);
    setOrderCompleted(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixPayload);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyBoleto = () => {
    navigator.clipboard?.writeText(boletoDigitable);
    setCopiedBoleto(true);
    setTimeout(() => setCopiedBoleto(false), 2500);
  };

  // =========================================================================
  // ESTADO: PEDIDO CONCLUÍDO (PÓS-VENDA LIMPO & SÓBRIO COM AZUL LOTHUS)
  // =========================================================================
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
        {/* Header do Checkout — Apenas com a Logo Oficial Lothus, sem funções */}
        <header className="bg-white border-b border-[#E2E8F0]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 select-none">
              <img
                src="/assets/logo-lothus-header.png"
                alt="Lothus Descartáveis & Suprimentos"
                className="h-11 sm:h-12 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-wide text-[#041B38] leading-tight">
                  LOTHUS
                </span>
                <span className="text-[10px] font-semibold text-[#585858] tracking-wider leading-none uppercase">
                  DESCARTÁVEIS & SUPRIMENTOS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span className="hidden sm:inline">Ambiente Seguro SSL</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Card Principal de Sucesso */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden">
            {/* Topo Limpo */}
            <div className="p-6 sm:p-8 border-b border-slate-100 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs font-bold text-[#16A34A]">Pedido Confirmado</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-mono font-bold text-[#1863DC]">#{orderNumber}</span>
                  </div>
                  <h1 className="font-display font-bold text-xl text-[#041B38] mt-0.5">
                    {paymentMethod === 'pix' && !pixPaidSimulated
                      ? 'Pedido Gerado • Aguardando Pagamento via PIX'
                      : 'Obrigado pelo seu pedido corporativo!'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Confirmação e detalhes fiscais enviados para <strong className="text-slate-700">{formData.email}</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 text-center sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-medium block">Total do Pedido</span>
                <span className="font-display font-bold text-xl text-[#1863DC]">
                  {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* Stepper Logístico Sóbrio */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div>
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#1863DC] text-white flex items-center justify-center mb-1 text-[11px] font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[#041B38] block text-[11px]">Pedido Criado</span>
                  <span className="text-[10px] text-slate-400">Hoje</span>
                </div>

                <div>
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 text-[11px] font-bold ${
                    paymentMethod === 'pix' && !pixPaidSimulated
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-[#1863DC] text-white'
                  }`}>
                    {paymentMethod === 'pix' && !pixPaidSimulated ? <Clock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-bold text-[#041B38] block text-[11px]">
                    {paymentMethod === 'pix' && !pixPaidSimulated ? 'Aguardando PIX' : 'Pagamento Aprovado'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {paymentMethod === 'pix' && !pixPaidSimulated ? formatTime(pixTimeLeft) : 'Confirmado'}
                  </span>
                </div>

                <div>
                  <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-1 text-[11px] font-bold">
                    3
                  </div>
                  <span className="font-bold text-slate-600 block text-[11px]">Separação no CD</span>
                  <span className="text-[10px] text-slate-400">Hub Jurubatuba</span>
                </div>

                <div>
                  <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-1 text-[11px] font-bold">
                    4
                  </div>
                  <span className="font-bold text-slate-600 block text-[11px]">Nota Fiscal</span>
                  <span className="text-[10px] text-slate-400">Danfe / XML</span>
                </div>

                <div>
                  <div className="w-7 h-7 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-1 text-[11px] font-bold">
                    5
                  </div>
                  <span className="font-bold text-slate-600 block text-[11px]">Entrega</span>
                  <span className="text-[10px] text-slate-400">{currentShipping.prazo}</span>
                </div>
              </div>
            </div>

            {/* SE PIX: Instruções Limpas de Pagamento */}
            {paymentMethod === 'pix' && !pixPaidSimulated && (
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <div className="max-w-md mx-auto text-center space-y-4">
                  <div>
                    <h2 className="font-display font-bold text-base text-[#041B38]">
                      Pague com PIX para liberar o despacho
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Você economizou <strong className="text-[#16A34A]">{pixDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (5% OFF)</strong>. Chave válida por <span className="font-mono font-bold text-[#1863DC]">{formatTime(pixTimeLeft)}</span>.
                    </p>
                  </div>

                  {/* QR Code Limpo Monocromático */}
                  <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-[#041B38]" fill="currentColor">
                      <rect x="10" y="10" width="50" height="50" fill="none" stroke="#041B38" strokeWidth="12" />
                      <rect x="25" y="25" width="20" height="20" />
                      <rect x="140" y="10" width="50" height="50" fill="none" stroke="#041B38" strokeWidth="12" />
                      <rect x="155" y="25" width="20" height="20" />
                      <rect x="10" y="140" width="50" height="50" fill="none" stroke="#041B38" strokeWidth="12" />
                      <rect x="25" y="155" width="20" height="20" />
                      <rect x="75" y="15" width="12" height="12" />
                      <rect x="95" y="25" width="12" height="12" />
                      <rect x="115" y="15" width="12" height="12" />
                      <rect x="75" y="45" width="12" height="12" />
                      <rect x="105" y="45" width="12" height="12" />
                      <rect x="20" y="75" width="12" height="12" />
                      <rect x="45" y="75" width="12" height="12" />
                      <rect x="75" y="75" width="14" height="14" />
                      <rect x="100" y="75" width="12" height="12" />
                      <rect x="125" y="75" width="12" height="12" />
                      <rect x="150" y="75" width="12" height="12" />
                      <rect x="15" y="105" width="12" height="12" />
                      <rect x="45" y="105" width="12" height="12" />
                      <rect x="75" y="105" width="12" height="12" />
                      <rect x="110" y="105" width="14" height="14" />
                      <rect x="140" y="105" width="12" height="12" />
                      <rect x="170" y="105" width="12" height="12" />
                      <rect x="75" y="135" width="12" height="12" />
                      <rect x="105" y="135" width="12" height="12" />
                      <rect x="135" y="135" width="12" height="12" />
                      <rect x="75" y="165" width="12" height="12" />
                      <rect x="105" y="165" width="12" height="12" />
                      <rect x="135" y="165" width="12" height="12" />
                    </svg>
                  </div>

                  {/* Campo Copia e Cola */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <input
                        type="text"
                        readOnly
                        value={pixPayload}
                        className="flex-1 text-xs font-mono text-slate-600 bg-transparent outline-none truncate px-1"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="px-3 py-1.5 bg-[#1863DC] hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setPixPaidSimulated(true)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer pt-1"
                    >
                      Já realizei o pagamento (Simular Confirmação)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SE BOLETO FATURADO PJ */}
            {paymentMethod === 'boleto-pj' && (
              <div className="p-6 border-b border-slate-100">
                <div className="max-w-lg mx-auto space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1863DC]" />
                    <h2 className="font-display font-bold text-sm text-[#041B38]">
                      Boleto Bancário Faturado PJ (Vencimento em 28 Dias)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600">
                    O faturamento foi lançado para o CNPJ <strong className="text-slate-800 font-mono">{formData.cnpjCpf}</strong>. A Danfe e o boleto registrado serão enviados por e-mail para <strong className="text-slate-800">{formData.email}</strong>.
                  </p>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                    <span className="font-mono text-slate-600 truncate flex-1">{boletoDigitable}</span>
                    <button
                      onClick={handleCopyBoleto}
                      className="px-3 py-1.5 bg-[#1863DC] hover:bg-blue-700 text-white rounded font-bold transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedBoleto ? 'Copiado!' : 'Copiar Linha'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SE CARTÃO DE CRÉDITO APROVADO */}
            {paymentMethod === 'cartao' && (
              <div className="p-6 border-b border-slate-100 text-center sm:text-left sm:flex sm:items-center sm:gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#041B38]">
                    Pagamento Aprovado no Cartão de Crédito
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cobrança autorizada em {cardData.installments}x de {(finalTotal / parseInt(cardData.installments || '1')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros.
                  </p>
                </div>
              </div>
            )}

            {/* Informações de Entrega & Faturamento */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-slate-100">
              <div className="space-y-1.5">
                <span className="font-bold text-[#041B38] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Endereço de Entrega</span>
                </span>
                <p className="text-slate-700 font-medium">{addressForm.street}, {addressForm.number} {addressForm.complement && `• ${addressForm.complement}`}</p>
                <p className="text-slate-500">{addressForm.neighborhood} • {addressForm.city}/{addressForm.state} • CEP {addressForm.cep}</p>
                <p className="text-[#16A34A] font-bold mt-1">Modalidade: {currentShipping.name} ({currentShipping.prazo})</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-[#041B38] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dados da Nota Fiscal</span>
                </span>
                <p className="text-slate-700 font-medium">{formData.razaoNome}</p>
                <p className="text-slate-500 font-mono">CNPJ/CPF: {formData.cnpjCpf}</p>
                <p className="text-slate-500">E-mail: {formData.email}</p>
              </div>
            </div>

            {/* Ações Finais Sóbrias */}
            <div className="p-5 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setOrderCompleted(false);
                    onNavigate && onNavigate('pedidos');
                  }}
                  className="px-4 py-2 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Acompanhar Meus Pedidos</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-display font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Imprimir</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/5511984125509?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20pedido%20${orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-display font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Suporte no WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setOrderCompleted(false);
                    onNavigate && onNavigate('home');
                  }}
                  className="px-3.5 py-2 text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
                >
                  Voltar à Loja
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASO DE CARRINHO VAZIO
  // =========================================================================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans">
        {/* Header do Checkout — Apenas com a Logo Oficial Lothus, sem funções */}
        <header className="bg-white border-b border-[#E2E8F0]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 select-none">
              <img
                src="/assets/logo-lothus-header.png"
                alt="Lothus Descartáveis & Suprimentos"
                className="h-11 sm:h-12 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-wide text-[#041B38] leading-tight">
                  LOTHUS
                </span>
                <span className="text-[10px] font-semibold text-[#585858] tracking-wider leading-none uppercase">
                  DESCARTÁVEIS & SUPRIMENTOS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span className="hidden sm:inline">Ambiente Seguro SSL</span>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 sm:p-12 shadow-xs">
            <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <h2 className="font-display font-bold text-xl text-[#041B38] mb-1">
              Seu Carrinho está vazio
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto mb-6">
              Adicione itens do catálogo de atacado para prosseguir com o faturamento.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate && onNavigate('catalogo')}
                className="px-5 py-2.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  addItem({
                    id: 'balde-doblo-30l',
                    name: 'Balde com Espremedor Doblô 30 Litros Bralimpia Completo',
                    category: 'Equipamentos de Limpeza',
                    categorySlug: 'equipamentos-de-limpeza',
                    price: 349.90,
                    discountPixPercent: 10,
                    installmentsMax: 3,
                    image: '/assets_site_atual/carrinho.jpg',
                    rating: 4.9,
                    reviewsCount: 38,
                    sku: 'BRA-DOB30L',
                    brand: 'Bralimpia',
                    unit: 'Unidade'
                  }, 1);
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Adicionar Item de Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CHECKOUT PRINCIPAL (COM HEADER EXCLUSIVO DA LOGO & AZUL PADRÃO LOTHUS #1863DC)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans text-slate-800">
      {/* =====================================================================
          HEADER OFICIAL DO CHECKOUT — SOMENTE COM A LOGO, SEM FUNÇÕES
          ===================================================================== */}
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between">
          {/* Logo Oficial Lothus (Sem links de navegação ou busca) */}
          <div className="flex items-center gap-3 select-none">
            <img
              src="/assets/logo-lothus-header.png"
              alt="Lothus Descartáveis & Suprimentos"
              className="h-11 sm:h-12 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-wide text-[#041B38] leading-tight">
                LOTHUS
              </span>
              <span className="text-[10px] font-semibold text-[#585858] tracking-wider leading-none uppercase">
                DESCARTÁVEIS & SUPRIMENTOS
              </span>
            </div>
          </div>

          {/* Selo Discreto de Segurança */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span className="hidden sm:inline">Ambiente Seguro SSL</span>
          </div>
        </div>

        {/* Stepper Sóbrio com Azul Oficial Lothus (#1863DC) */}
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-3xl mx-auto px-4 py-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { id: 'dados', label: '1. Faturamento' },
                { id: 'entrega', label: '2. Envio' },
                { id: 'pagamento', label: '3. Pagamento' },
                { id: 'revisao', label: '4. Revisão' },
              ].map((step) => {
                const isActive = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id as CheckoutStep)}
                    className={`py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#1863DC] border-b-2 border-[#1863DC]'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo do Checkout (2 Colunas Alinhadas) */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* =================================================================
              COLUNA ESQUERDA: ETAPAS DO FORMULÁRIO (7 COLUNAS)
              ================================================================= */}
          <div className="lg:col-span-7 space-y-4">

            {/* ETAPA 1: IDENTIFICAÇÃO FISCAL */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div
                onClick={() => setCurrentStep('dados')}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'dados' ? 'bg-[#1863DC] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    1
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#041B38]">
                      Tipo de Faturamento & Dados Fiscais
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {customerType === 'pj' ? 'Pessoa Jurídica (CNPJ) • Faturamento B2B' : 'Pessoa Física (CPF)'}
                    </p>
                  </div>
                </div>

                {currentStep !== 'dados' && (
                  <span className="text-xs text-[#1863DC] font-bold hover:underline">
                    Alterar
                  </span>
                )}
              </div>

              {currentStep === 'dados' && (
                <div className="p-5 space-y-4 text-xs">
                  {/* Seletor PJ / PF com Azul Padrão Lothus #1863DC */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomerType('pj')}
                      className={`py-2.5 px-4 rounded-lg font-display text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                        customerType === 'pj'
                          ? 'bg-[#1863DC] text-white border-[#1863DC] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Pessoa Jurídica (CNPJ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomerType('pf')}
                      className={`py-2.5 px-4 rounded-lg font-display text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                        customerType === 'pf'
                          ? 'bg-[#1863DC] text-white border-[#1863DC] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Pessoa Física (CPF)</span>
                    </button>
                  </div>

                  {/* Campos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {customerType === 'pj' ? 'CNPJ *' : 'CPF *'}
                      </label>
                      <input
                        type="text"
                        value={formData.cnpjCpf}
                        onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {customerType === 'pj' ? 'Razão Social *' : 'Nome Completo *'}
                      </label>
                      <input
                        type="text"
                        value={formData.razaoNome}
                        onChange={(e) => setFormData({ ...formData, razaoNome: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>

                    {customerType === 'pj' && (
                      <>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nome Fantasia</label>
                          <input
                            type="text"
                            value={formData.nomeFantasia}
                            onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700">Inscrição Estadual (IE)</label>
                            <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.isentoIE}
                                onChange={(e) => setFormData({ ...formData, isentoIE: e.target.checked })}
                                className="rounded text-[#1863DC]"
                              />
                              <span>Isento</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            disabled={formData.isentoIE}
                            value={formData.isentoIE ? 'ISENTO' : formData.inscricaoEstadual}
                            onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none disabled:bg-slate-100"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">E-mail para Danfe e XML *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('entrega')}
                      className="px-5 py-2.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Prosseguir para Envio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ETAPA 2: ENDEREÇO & FRETE */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div
                onClick={() => setCurrentStep('entrega')}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'entrega' ? 'bg-[#1863DC] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    2
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#041B38]">
                      Endereço de Entrega & Opções de Envio
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {addressForm.street}, {addressForm.number} • {addressForm.city}/{addressForm.state}
                    </p>
                  </div>
                </div>

                {currentStep !== 'entrega' && (
                  <span className="text-xs text-[#1863DC] font-bold hover:underline">
                    Alterar
                  </span>
                )}
              </div>

              {currentStep === 'entrega' && (
                <div className="p-5 space-y-5 text-xs">
                  {/* Endereços Salvos se houver */}
                  {user && user.addresses.length > 0 && !isAddingNewAddress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Selecione o local de entrega:</label>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(true)}
                          className="text-[#1863DC] hover:underline font-bold"
                        >
                          + Novo endereço
                        </button>
                      </div>

                      <div className="space-y-2">
                        {user.addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => {
                                setSelectedAddressId(addr.id);
                                setAddressForm({
                                  cep: addr.cep,
                                  street: addr.street,
                                  number: addr.number,
                                  complement: addr.complement || '',
                                  neighborhood: addr.neighborhood,
                                  city: addr.city,
                                  state: addr.state,
                                  label: addr.label,
                                });
                              }}
                              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                                isSelected
                                  ? 'border-[#1863DC] bg-blue-50/20 shadow-xs ring-1 ring-blue-100'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <input
                                  type="radio"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="mt-0.5 text-[#1863DC]"
                                />
                                <div>
                                  <span className="font-bold text-[#041B38] block">{addr.label}</span>
                                  <p className="text-slate-600">
                                    {addr.street}, {addr.number} {addr.complement && `(${addr.complement})`}
                                  </p>
                                  <p className="text-slate-400 text-[11px]">
                                    {addr.neighborhood} — {addr.city}/{addr.state} • CEP {addr.cep}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Formulário Novo Endereço */}
                  {(isAddingNewAddress || !user || user.addresses.length === 0) && (
                    <div className="space-y-3 bg-slate-50/60 p-3.5 rounded-lg border border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">CEP *</label>
                          <input
                            type="text"
                            value={addressForm.cep}
                            onChange={(e) => handleLookupCep(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Identificação (ex: Matriz, Doca A)</label>
                          <input
                            type="text"
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-3">
                          <label className="block font-bold text-slate-700 mb-1">Logradouro / Rua *</label>
                          <input
                            type="text"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Número *</label>
                          <input
                            type="text"
                            value={addressForm.number}
                            onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Complemento / Doca</label>
                          <input
                            type="text"
                            value={addressForm.complement}
                            onChange={(e) => setAddressForm({ ...addressForm, complement: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                          <input
                            type="text"
                            value={addressForm.neighborhood}
                            onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Cidade / UF *</label>
                          <input
                            type="text"
                            readOnly
                            value={`${addressForm.city} - ${addressForm.state}`}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opções de Envio em Estilo Limpo */}
                  <div className="pt-2">
                    <label className="block font-bold text-slate-700 mb-2">Forma de Envio:</label>
                    <div className="space-y-2">
                      {SHIPPING_METHODS.map((method) => {
                        const isSelected = shippingOption === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setShippingOption(method.id)}
                            className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-[#1863DC] bg-blue-50/20 shadow-xs ring-1 ring-blue-100'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                className="text-[#1863DC]"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#041B38] text-xs">
                                    {method.name}
                                  </span>
                                  {method.badge && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#1863DC]">
                                      {method.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-500 text-[11px] mt-0.5">{method.descricao}</p>
                              </div>
                            </div>

                            <span className="font-bold text-xs text-[#041B38] shrink-0">
                              {method.preco === 0 ? <span className="text-[#16A34A]">Grátis</span> : method.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('dados')}
                      className="text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep('pagamento')}
                      className="px-5 py-2.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Prosseguir para Pagamento</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ETAPA 3: FORMA DE PAGAMENTO */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div
                onClick={() => setCurrentStep('pagamento')}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'pagamento' ? 'bg-[#1863DC] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    3
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#041B38]">
                      Forma de Pagamento
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {paymentMethod === 'pix' && 'PIX Dinâmico Instantâneo (-5% OFF)'}
                      {paymentMethod === 'cartao' && `Cartão de Crédito (${cardData.installments}x)`}
                      {paymentMethod === 'boleto-pj' && 'Boleto Faturado PJ (28 Dias)'}
                    </p>
                  </div>
                </div>

                {currentStep !== 'pagamento' && (
                  <span className="text-xs text-[#1863DC] font-bold hover:underline">
                    Alterar
                  </span>
                )}
              </div>

              {currentStep === 'pagamento' && (
                <div className="p-5 space-y-4 text-xs">
                  {/* Cards de Métodos Sóbrios com Borda Ativa no Azul Oficial */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* PIX */}
                    <div
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        paymentMethod === 'pix'
                          ? 'border-[#1863DC] bg-blue-50/20 shadow-xs ring-1 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <QrCode className="w-5 h-5 text-[#1863DC]" />
                          <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            -5% OFF
                          </span>
                        </div>
                        <span className="font-bold text-xs text-[#041B38] block">PIX Instantâneo</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">Aprovação imediata 24/7.</span>
                      </div>
                    </div>

                    {/* Cartão de Crédito */}
                    <div
                      onClick={() => setPaymentMethod('cartao')}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        paymentMethod === 'cartao'
                          ? 'border-[#1863DC] bg-blue-50/20 shadow-xs ring-1 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <CreditCard className="w-5 h-5 text-[#1863DC]" />
                          <span className="text-[10px] text-slate-400 font-bold">Até 6x</span>
                        </div>
                        <span className="font-bold text-xs text-[#041B38] block">Cartão de Crédito</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">Parcelamento sem juros.</span>
                      </div>
                    </div>

                    {/* Boleto Faturado PJ */}
                    {customerType === 'pj' && (
                      <div
                        onClick={() => setPaymentMethod('boleto-pj')}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                          paymentMethod === 'boleto-pj'
                            ? 'border-[#1863DC] bg-blue-50/20 shadow-xs ring-1 ring-blue-100'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <FileText className="w-5 h-5 text-[#1863DC]" />
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                              28 Dias
                            </span>
                          </div>
                          <span className="font-bold text-xs text-[#041B38] block">Boleto Faturado PJ</span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">Faturamento para CNPJ.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detalhes do Pagamento */}
                  {paymentMethod === 'pix' && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs">
                      <p>
                        Desconto de <strong>5% à vista (- {pixDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</strong> aplicado. O QR Code e a chave Pix Copia e Cola serão gerados na tela de confirmação com 15 minutos para pagamento.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cartao' && (
                    <div className="space-y-3 pt-1 bg-slate-50/50 p-3.5 rounded-lg border border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Número do Cartão *</label>
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nome Impresso no Cartão *</label>
                          <input
                            type="text"
                            placeholder="NOME COMO NO CARTÃO"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs uppercase bg-white focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Validade *</label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Código de Segurança (CVV) *</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Parcelamento *</label>
                        <select
                          value={cardData.installments}
                          onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-[#041B38] bg-white cursor-pointer focus:border-[#1863DC] focus:outline-none"
                        >
                          <option value="1">1x de {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="2">2x de {(finalTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="3">3x de {(finalTotal / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="4">4x de {(finalTotal / 4).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="5">5x de {(finalTotal / 5).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="6">6x de {(finalTotal / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'boleto-pj' && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs">
                      <p>
                        Faturamento a prazo de <strong>28 dias</strong> para compras corporativas com CNPJ. O boleto bancário e a Nota Fiscal Eletrônica serão enviados diretamente para o e-mail cadastrado.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('entrega')}
                      className="text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep('revisao')}
                      className="px-5 py-2.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Revisar Pedido</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ETAPA 4: REVISÃO & CONFIRMAÇÃO */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div
                onClick={() => setCurrentStep('revisao')}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 'revisao' ? 'bg-[#1863DC] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    4
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#041B38]">
                      Revisão do Pedido & Fechamento
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Confirme os dados antes de gerar a cobrança.
                    </p>
                  </div>
                </div>
              </div>

              {currentStep === 'revisao' && (
                <div className="p-5 space-y-4 text-xs">
                  {/* Resumos Sóbrios */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                      <button
                        onClick={() => setCurrentStep('dados')}
                        className="absolute top-2 right-2 text-[10px] text-[#1863DC] hover:underline font-bold"
                      >
                        Editar
                      </button>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Faturamento</span>
                      <p className="font-bold text-[#041B38] truncate">{formData.razaoNome}</p>
                      <p className="text-slate-500 font-mono text-[11px] truncate">{formData.cnpjCpf}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                      <button
                        onClick={() => setCurrentStep('entrega')}
                        className="absolute top-2 right-2 text-[10px] text-[#1863DC] hover:underline font-bold"
                      >
                        Editar
                      </button>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Entrega</span>
                      <p className="font-bold text-[#041B38] truncate">{addressForm.street}, {addressForm.number}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentShipping.name}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                      <button
                        onClick={() => setCurrentStep('pagamento')}
                        className="absolute top-2 right-2 text-[10px] text-[#1863DC] hover:underline font-bold"
                      >
                        Editar
                      </button>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pagamento</span>
                      <p className="font-bold text-[#041B38]">
                        {paymentMethod === 'pix' ? 'PIX (-5%)' : paymentMethod === 'cartao' ? 'Cartão' : 'Boleto PJ'}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Total: {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>

                  {/* Cupom Promocional Sóbrio */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Cupom de desconto (ex: LOTHUS10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase font-bold focus:border-[#1863DC] focus:ring-1 focus:ring-blue-100 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponMessage && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      {couponMessage}
                    </p>
                  )}

                  {/* Botão de Finalização no Azul Oficial Lothus */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleFinishOrder}
                      className="w-full py-3.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'pix'
                          ? `Gerar PIX e Concluir Pedido (${finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`
                          : paymentMethod === 'boleto-pj'
                          ? `Emitir Faturamento PJ 28 Dias (${finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`
                          : `Confirmar Pagamento no Cartão (${finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* =================================================================
              COLUNA DIREITA: RESUMO DO PEDIDO LIMPO (5 COLUNAS)
              ================================================================= */}
          <aside className="lg:col-span-5">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs sticky top-20 text-xs">
              <h3 className="font-display font-bold text-sm text-[#041B38] pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
                <span>Resumo do Pedido</span>
                <span className="text-slate-400 font-normal text-xs">{items.length} itens</span>
              </h3>

              {/* Lista dos Itens */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2 mb-3">
                {items.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="w-9 h-9 object-contain rounded border border-slate-100 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-800 truncate block">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.quantity}x • {item.product.unit || 'un'}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#041B38] shrink-0">
                      {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cálculos */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-700">
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Frete ({currentShipping.name}):</span>
                  <span className="font-mono font-bold">
                    {shippingCost === 0 ? <span className="text-[#16A34A]">Grátis</span> : shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-bold">
                    <span>Desconto Cupom:</span>
                    <span className="font-mono">- {couponDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}

                {paymentMethod === 'pix' && pixDiscount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-bold">
                    <span>Desconto PIX (-5%):</span>
                    <span className="font-mono">- {pixDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-[#041B38] pt-2.5 border-t border-slate-200">
                  <span>Total:</span>
                  <span className="font-display font-bold text-lg font-mono text-[#1863DC]">
                    {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                <p>• Nota fiscal eletrônica (Danfe) emitida automaticamente.</p>
                <p>• Faturamento direto da distribuidora em São Paulo.</p>
              </div>

              {/* Botão de Finalização no Azul Oficial Lothus #1863DC */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleFinishOrder}
                  className="w-full py-3 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-4 text-center text-[11px] text-slate-400 font-sans">
        <div className="max-w-[1440px] mx-auto px-4">
          Lothus Descartáveis & Suprimentos Corporativos Ltda • CNPJ 48.291.604/0001-32 • São Paulo - SP
        </div>
      </footer>
    </div>
  );
};
