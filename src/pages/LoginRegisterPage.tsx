import React, { useEffect, useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, FileText, Lock, MapPin, RotateCcw, ShieldCheck, Sparkles, User } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { CustomSelect } from '../components/ui/CustomSelect';

interface LoginRegisterPageProps {
  onNavigate?: (page: string) => void;
  onAuthSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

const SEGMENTS = [
  'Clínica / Saúde',
  'Restaurante / Food Service',
  'Condomínio / Facilities',
  'Escola / Educação',
  'Escritório Corporativo',
  'Indústria / Logística',
  'Comércio / Varejo',
  'Outro Segmento',
];

const formatCnpjCpf = (raw: string, type: 'pj' | 'pf') => {
  const d = raw.replace(/\D/g, '');
  if (type === 'pf') {
    const p = d.slice(0, 11);
    return p
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  const c = d.slice(0, 14);
  return c
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
};

const formatCep = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  return d.replace(/(\d{5})(\d)/, '$1-$2');
};

export const LoginRegisterPage: React.FC<LoginRegisterPageProps> = ({
  onNavigate,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  useSEO({
    title: 'Login & Cadastro Corporativo B2B — Lothus Descartáveis',
    description:
      'Acesse sua conta empresarial na Lothus Descartáveis ou cadastre seu CNPJ para comprar no atacado com faturamento no boleto PJ, DANFE e recompra rápida.',
    canonical: 'https://lothusdescartaveis.com.br/minha-conta/acesso',
  });

  const { login, loginDemoCorporate, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotInfo, setForgotInfo] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode]);

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [accountType, setAccountType] = useState<'pj' | 'pf'>('pj');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [isentoIE, setIsentoIE] = useState(false);
  const [segment, setSegment] = useState('Escritório Corporativo');
  const [buyerName, setBuyerName] = useState('');
  const [buyerRole, setBuyerRole] = useState('Comprador / Suprimentos');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delivery Address State
  const [addressLabel, setAddressLabel] = useState('Matriz / Recebimento');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [uf, setUf] = useState('SP');

  const completeAuth = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    } else if (onNavigate) {
      onNavigate('perfil');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const result = login(loginIdentifier, loginPassword);
    if (!result.ok) {
      setErrorMsg(result.error || 'Não foi possível entrar.');
      return;
    }
    completeAuth();
  };

  const handleDemoAccess = () => {
    setErrorMsg('');
    loginDemoCorporate();
    completeAuth();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    const result = register({
      accountType,
      cnpjCpf,
      razaoSocial,
      nomeFantasia: accountType === 'pj' ? nomeFantasia : razaoSocial,
      inscricaoEstadual:
        accountType === 'pf'
          ? 'ISENTO'
          : isentoIE
          ? 'ISENTO'
          : inscricaoEstadual || 'ISENTO',
      segment,
      buyerName: accountType === 'pf' ? razaoSocial : buyerName,
      buyerRole: accountType === 'pf' ? 'Titular' : buyerRole,
      email,
      phone,
      password,
      address: {
        label: accountType === 'pj' ? addressLabel : 'Endereço Principal',
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state: uf,
      },
    });

    if (!result.ok) {
      setErrorMsg(result.error || 'Erro ao concluir cadastro.');
      return;
    }

    completeAuth();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 font-sans">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          className="hover:text-[#1863DC] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Loja</span>
        </button>
        <span>/</span>
        <span className="text-[#041B38] font-bold">
          {mode === 'login' ? 'Acesso à Conta Corporativa' : 'Cadastro de Empresa (B2B)'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: Benefícios B2B e Acesso Rápido Demo (Padronizado em Branco) */}
        <aside className="lg:col-span-5 bg-white text-[#041B38] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E2E8F0]">
          <h1 className="font-display font-black text-2xl sm:text-[26px] text-[#041B38] leading-tight mb-3">
            Sua operação abastecida com eficiência e faturamento PJ.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            Centralize as compras de limpeza, descartáveis, food service e papelaria da sua empresa em um portal exclusivo.
          </p>

          <div className="space-y-4 border-t border-slate-100 pt-5 mb-7">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#1863DC] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-display font-bold text-[#041B38]">
                  Boleto Faturado 14/28dd & PIX -5%
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Condições comerciais exclusivas por CNPJ com análise cadastral ágil e emissão automática de DANFE e XML.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-[#1863DC] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-display font-bold text-[#041B38]">
                  Recompra Mensal em 1 Clique
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Repita pedidos recorrentes de fardos, insumos e suprimentos em segundos direto do histórico.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#1863DC] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-display font-bold text-[#041B38]">
                  Múltiplas Unidades e Compradores
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Cadastre matriz, filiais e aprove compradores responsáveis para agilizar entregas na Grande SP e Brasil.
                </p>
              </div>
            </div>
          </div>

          {/* Card Acesso Demo para Teste Imediato */}
          <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-[#041B38] mb-1.5">
              <Sparkles className="w-4 h-4 text-[#FB8C00]" />
              <span>Ambiente de Demonstração B2B</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Quer visualizar o painel empresarial preenchido com pedidos, crédito aprovado e endereços? Acesse a conta modelo com 1 clique:
            </p>
            <div className="text-[10px] font-mono bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-slate-700 mb-3 space-y-0.5">
              <div>E-mail: compras@grupopaulista.com.br</div>
              <div>CNPJ: 48.291.604/0001-32 • Senha: demo123</div>
            </div>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2.5 px-4 bg-[#1863DC] text-white hover:bg-blue-700 font-display font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Entrar com Conta B2B Demo</span>
            </button>
          </div>
        </aside>

        {/* COLUNA DIREITA: Formulário de Login / Registro */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Abas Login vs Registro */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2.5 px-4 rounded-lg font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#041B38] shadow-xs'
                  : 'text-slate-500 hover:text-[#041B38]'
              }`}
            >
              Já sou cliente (Entrar)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-2.5 px-4 rounded-lg font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#041B38] shadow-xs'
                  : 'text-slate-500 hover:text-[#041B38]'
              }`}
            >
              Cadastrar Empresa (PJ / PF)
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <h2 className="font-display font-bold text-lg text-[#041B38]">
                  Acesse o Portal do Cliente
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Entre com seu e-mail corporativo ou CNPJ para acompanhar pedidos, notas fiscais e recompras.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  E-mail Corporativo ou CNPJ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="compras@empresa.com.br ou 00.000.000/0001-00"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-[#0F668E] focus:ring-2 focus:ring-[#0F668E]/15 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Senha de Acesso *
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotInfo((prev) => !prev)}
                    className="text-[11px] font-semibold text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Digite sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg focus:border-[#0F668E] focus:ring-2 focus:ring-[#0F668E]/15 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Mostrar ou ocultar senha"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {forgotInfo && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Para redefinição rápida de senha corporativa ou liberação de novo comprador no CNPJ, entre em contato com nossa equipe pelo WhatsApp <strong>(11) 97766-3741</strong> ou envie solicitação para o financeiro.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Lock className="w-4 h-4" />
                <span>Entrar na Conta</span>
              </button>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>Ambiente protegido para faturamento PJ e PF</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="font-bold text-[#1863DC] hover:underline cursor-pointer"
                >
                  Criar cadastro empresarial →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs">
              <div>
                <h2 className="font-display font-bold text-lg text-[#041B38]">
                  Cadastro para Fornecimento Corporativo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preencha os dados fiscais e de entrega para liberar compras, NF-e e pedidos recorrentes.
                </p>
              </div>

              {/* Tipo de Conta */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType('pj');
                    setCnpjCpf('');
                  }}
                  className={`py-2.5 px-3 rounded-lg border font-display font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    accountType === 'pj'
                      ? 'bg-[#041B38] text-white border-[#041B38]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Empresa (CNPJ)</span>
                  <span className="bg-[#0F668E] text-white text-[9px] px-1.5 py-0.5 rounded">
                    B2B
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccountType('pf');
                    setCnpjCpf('');
                  }}
                  className={`py-2.5 px-3 rounded-lg border font-display font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    accountType === 'pf'
                      ? 'bg-[#041B38] text-white border-[#041B38]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Pessoa Física (CPF)</span>
                </button>
              </div>

              {/* Bloco 1: Dados Fiscais */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0F668E]">
                  1. Identificação Fiscal
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {accountType === 'pj' ? 'CNPJ *' : 'CPF *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={accountType === 'pj' ? '00.000.000/0001-00' : '000.000.000-00'}
                      value={cnpjCpf}
                      onChange={(e) => setCnpjCpf(formatCnpjCpf(e.target.value, accountType))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {accountType === 'pj' ? 'Razão Social *' : 'Nome Completo *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        accountType === 'pj'
                          ? 'Empresa Comercial Ltda'
                          : 'Seu nome completo'
                      }
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                </div>

                {accountType === 'pj' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nome Fantasia
                      </label>
                      <input
                        type="text"
                        placeholder="Como a empresa é conhecida"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Inscrição Estadual</label>
                        <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isentoIE}
                            onChange={(e) => {
                              setIsentoIE(e.target.checked);
                              if (e.target.checked) setInscricaoEstadual('ISENTO');
                              else setInscricaoEstadual('');
                            }}
                          />
                          <span>Isento</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        disabled={isentoIE}
                        placeholder="Número da IE"
                        value={isentoIE ? 'ISENTO' : inscricaoEstadual}
                        onChange={(e) => setInscricaoEstadual(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Segmento de Atuação
                      </label>
                      <CustomSelect
                        value={segment}
                        onChange={(val) => setSegment(val)}
                        fullWidth
                        options={SEGMENTS.map((seg) => ({
                          value: seg,
                          label: seg,
                        }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bloco 2: Comprador e Credenciais */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0F668E]">
                  2. Responsável & Acesso ao Portal
                </h3>

                {accountType === 'pj' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nome do Comprador / Responsável *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Mariana Alencar"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Cargo / Departamento
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Gerente de Compras / Facilities"
                        value={buyerRole}
                        onChange={(e) => setBuyerRole(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {accountType === 'pj' ? 'E-mail Corporativo (Portal & XML) *' : 'E-mail *'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="compras@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      WhatsApp / Telefone Comercial *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Crie uma Senha (mín. 6 dígitos) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 3: Endereço Principal de Entrega */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0F668E]">
                  3. Endereço Principal de Recebimento
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {accountType === 'pj' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Identificação da Unidade
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Matriz / Almoxarifado"
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CEP *</label>
                    <input
                      type="text"
                      required
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => setCep(formatCep(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none font-mono"
                    />
                  </div>
                  <div className={accountType === 'pj' ? '' : 'sm:col-span-2'}>
                    <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Vila Nova Conceição"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  <div className="sm:col-span-6">
                    <label className="block font-bold text-slate-700 mb-1">Logradouro *</label>
                    <input
                      type="text"
                      required
                      placeholder="Av. / Rua"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      placeholder="1450"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block font-bold text-slate-700 mb-1">Complemento / Doca</label>
                    <input
                      type="text"
                      placeholder="Galpão / Sala / Doca"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  <div className="sm:col-span-9">
                    <label className="block font-bold text-slate-700 mb-1">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">UF *</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={uf}
                      onChange={(e) => setUf(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] focus:outline-none uppercase"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir Cadastro e Acessar Portal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
