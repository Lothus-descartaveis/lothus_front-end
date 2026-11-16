import React, { useEffect, useState } from 'react';
import { ShieldCheck, QrCode, FileText, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSEO } from '../hooks/useSEO';

interface CheckoutPageProps {
  onNavigate?: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Checkout Seguro & Faturamento B2B',
    description: 'Finalize sua compra corporativa com segurança. Pagamento via PIX com 5% de desconto, boleto faturado para CNPJ ou cartão de crédito.',
    canonical: 'https://lothusdescartaveis.com.br/checkout'
  });
  const { user, addOrder } = useAuth();
  const { items, subtotal, pixTotal, clearCart } = useCart();
  const [customerType, setCustomerType] = useState<'pj' | 'pf'>(user?.accountType || 'pj');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto-pj' | 'cartao'>('pix');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const defaultAddr = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];

  // Formulário
  const [formData, setFormData] = useState({
    cnpjCpf: user?.cnpjCpf || '',
    razaoNome: user?.razaoSocial || '',
    inscricaoEstadual: user?.inscricaoEstadual || '',
    email: user?.email || '',
    telefone: user?.phone || '',
    cep: defaultAddr?.cep || '04671-000',
    endereco: defaultAddr ? `${defaultAddr.street}, ${defaultAddr.number}` : 'Rua das Indústrias, 1020',
    bairro: defaultAddr?.neighborhood || 'Jurubatuba',
    cidade: defaultAddr?.city || 'São Paulo',
    uf: defaultAddr?.state || 'SP'
  });

  useEffect(() => {
    if (!user) return;
    const addr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
    setCustomerType(user.accountType);
    setFormData({
      cnpjCpf: user.cnpjCpf,
      razaoNome: user.razaoSocial,
      inscricaoEstadual: user.inscricaoEstadual,
      email: user.email,
      telefone: user.phone,
      cep: addr?.cep || '04671-000',
      endereco: addr ? `${addr.street}, ${addr.number}` : 'Rua das Indústrias, 1020',
      bairro: addr?.neighborhood || 'Jurubatuba',
      cidade: addr?.city || 'São Paulo',
      uf: addr?.state || 'SP',
    });
  }, [user]);

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const num = `LTS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    if (user && items.length > 0) {
      const addrLabel = defaultAddr?.label || `${formData.cidade}/${formData.uf}`;
      addOrder({
        id: num,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Em Separação',
        paymentMethod:
          paymentMethod === 'pix'
            ? 'PIX Corporativo (-5%)'
            : paymentMethod === 'boleto-pj'
            ? 'Boleto PJ 28 Dias'
            : 'Cartão Corporativo',
        total: paymentMethod === 'pix' ? pixTotal : subtotal,
        nfeNumber: 'Em emissão',
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
  };

  if (orderCompleted) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 shadow-card">
          <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto mb-4 animate-bounce" />
          <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            PEDIDO FATURADO COM SUCESSO
          </span>
          <h1 className="font-display font-black text-2xl text-[#041B38] mt-3 mb-2">
            Obrigado pelo seu pedido corporativo!
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mb-6">
            O pedido <strong className="text-[#041B38] font-mono">{orderNumber}</strong> foi gerado e registrado no sistema de faturamento.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Cliente / Razão Social:</span>
              <span className="font-bold text-[#041B38]">{formData.razaoNome || 'Empresa Cliente B2B'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Condição de Pagamento:</span>
              <span className="font-bold text-[#1863DC]">
                {paymentMethod === 'pix' ? 'PIX Dinâmico (5% OFF)' : paymentMethod === 'boleto-pj' ? 'Boleto Bancário 28 Dias' : 'Cartão de Crédito'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Prazo de Entrega:</span>
              <span className="font-bold text-[#16A34A]">1 a 2 dias úteis (Grande SP)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {user && (
              <button
                onClick={() => {
                  setOrderCompleted(false);
                  onNavigate && onNavigate('pedidos');
                }}
                className="px-6 py-3 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Acompanhar Pedido no Perfil
              </button>
            )}
            <button
              onClick={() => {
                setOrderCompleted(false);
                onNavigate && onNavigate('home');
              }}
              className="px-6 py-3 bg-[#041B38] hover:bg-slate-800 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 font-sans">
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-lothus-royal flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>
        <span>/</span>
        <span className="text-[#041B38] font-bold">Checkout Completo B2B/B2C</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ==================================================================
            COLUNA ESQUERDA: FORMULÁRIO FISCAL & DADOS (7 COLUNAS)
            ================================================================== */}
        <form onSubmit={handleFinishOrder} className="lg:col-span-7 space-y-6">
          {/* Alternador PJ vs PF */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            <h3 className="font-display font-bold text-sm text-[#041B38] mb-3">
              Tipo de Faturamento & Cadastro
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCustomerType('pj')}
                className={`py-2.5 px-4 rounded-lg font-display text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                  customerType === 'pj'
                    ? 'bg-[#041B38] text-white border-[#041B38] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Pessoa Jurídica (CNPJ)</span>
                <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">B2B</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerType('pf')}
                className={`py-2.5 px-4 rounded-lg font-display text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                  customerType === 'pf'
                    ? 'bg-[#041B38] text-white border-[#041B38] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Pessoa Física (CPF)</span>
              </button>
            </div>
          </div>

          {/* Dados Fiscais */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-display font-bold text-sm text-[#041B38] pb-2 border-b border-slate-100">
              Dados para Emissão da Nota Fiscal Eletrônica (Danfe)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {customerType === 'pj' ? 'CNPJ da Empresa *' : 'CPF do Comprador *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={customerType === 'pj' ? '00.000.000/0001-00' : '000.000.000-00'}
                  value={formData.cnpjCpf}
                  onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {customerType === 'pj' ? 'Razão Social / Nome Fantasia *' : 'Nome Completo *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={customerType === 'pj' ? 'Empresa Comercial LTDA' : 'Seu Nome Completo'}
                  value={formData.razaoNome}
                  onChange={(e) => setFormData({ ...formData, razaoNome: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>
            </div>

            {customerType === 'pj' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Inscrição Estadual (ou Isento)
                </label>
                <input
                  type="text"
                  placeholder="Inscrição Estadual ou digite ISENTO"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  E-mail para Envio do XML e Fatura *
                </label>
                <input
                  type="email"
                  required
                  placeholder="financeiro@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp para Confirmação *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="font-display font-bold text-sm text-[#041B38] pb-2 border-b border-slate-100">
              Forma de Pagamento
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Opção PIX */}
              <div
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'pix'
                    ? 'border-[#16A34A] bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-[#16A34A]" />
                    <span className="bg-[#16A34A] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                      -5% OFF
                    </span>
                  </div>
                  <span className="font-display font-bold text-xs text-[#041B38] block">
                    PIX Dinâmico
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Aprovação imediata e separação prioritária no centro de distribuição.
                  </span>
                </div>
              </div>

              {/* Opção Boleto PJ */}
              {customerType === 'pj' && (
                <div
                  onClick={() => setPaymentMethod('boleto-pj')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'boleto-pj'
                      ? 'border-[#1863DC] bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-5 h-5 text-[#1863DC]" />
                      <span className="bg-[#1863DC] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        28 DIAS
                      </span>
                    </div>
                    <span className="font-display font-bold text-xs text-[#041B38] block">
                      Boleto Faturado PJ
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Faturamento corporativo com prazo de 28 dias após aprovação cadastral.
                    </span>
                  </div>
                </div>
              )}

              {/* Opção Cartão */}
              <div
                onClick={() => setPaymentMethod('cartao')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cartao'
                    ? 'border-[#041B38] bg-slate-50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-[#041B38]" />
                    <span className="text-[10px] text-slate-500 font-bold">Até 6x</span>
                  </div>
                  <span className="font-display font-bold text-xs text-[#041B38] block">
                    Cartão de Crédito
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Parcelamento corporativo em até 6 vezes sem juros.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Confirmar e Concluir Pedido
          </button>
        </form>

        {/* ==================================================================
            COLUNA DIREITA: RESUMO DO PEDIDO & ITENS (5 COLUNAS)
            ================================================================== */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs sticky top-28">
            <h3 className="font-display font-bold text-sm text-[#041B38] pb-3 border-b border-slate-100 mb-4">
              Resumo do Pedido ({items.length} itens)
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-contain shrink-0" />
                    <div>
                      <span className="font-display font-bold text-slate-800 line-clamp-1 block">
                        {item.product.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Qtd: {item.quantity}x
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#041B38] shrink-0">
                    {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">
                  {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Frete Grande SP:</span>
                <span className="font-bold text-[#16A34A]">Grátis</span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-[#16A34A] font-bold">
                  <span>Desconto PIX (-5%):</span>
                  <span>- {(subtotal - pixTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#041B38] pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="font-display font-black text-xl text-lothus-royal">
                  {(paymentMethod === 'pix' ? pixTotal : subtotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Ambiente criptografado com validação fiscal automática.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
