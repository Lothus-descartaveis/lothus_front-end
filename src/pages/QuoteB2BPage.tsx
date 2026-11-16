import React, { useState } from 'react';
import { Building2, MessageCircle, FileSpreadsheet, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { CustomSelect } from '../components/ui/CustomSelect';

interface QuoteB2BPageProps {
  onNavigate?: (page: string) => void;
}

export const QuoteB2BPage: React.FC<QuoteB2BPageProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Portal de Cotação Corporativa B2B & Atacado PJ',
    description: 'Solicite cotação em lote para sua empresa com condições de faturamento no boleto em até 28 dias e descontos progressivos por demanda.',
    canonical: 'https://lothusdescartaveis.com.br/cotacao-b2b',
    keywords: ['cotação b2b descartáveis', 'faturamento pj limpeza', 'compras corporativas atacado', 'fornecedor descartáveis empresas']
  });
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [contato, setContato] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [demanda, setDemanda] = useState('');
  const [faturamento, setFaturamento] = useState('Boleto 28 Dias');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    const text = `*SOLICITAÇÃO DE COTAÇÃO CORPORATIVA (PORTAL B2B LOTHUS)*%0A%0A*CNPJ:* ${cnpj}%0A*Razão Social:* ${razaoSocial}%0A*Responsável:* ${contato}%0A*E-mail:* ${email}%0A*Telefone/Whats:* ${telefone}%0A*Condição Solicitada:* ${faturamento}%0A%0A*Relação de Produtos / Demanda Mensal:*%0A${encodeURIComponent(demanda)}`;
    window.open(`https://wa.me/5511977663741?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 font-sans">
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-lothus-royal flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Home</span>
        </button>
        <span>/</span>
        <span className="text-[#041B38] font-bold">Portal de Cotação Corporativa & Faturamento PJ</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
            <Building2 className="w-7 h-7 text-[#1863DC] shrink-0" />
            <div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-[#041B38]">
                Portal de Atendimento & Cotação B2B
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Preços especiais para fardos fechados, pallet e compras recorrentes faturadas no boleto
              </p>
            </div>
          </div>

          {isSent ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto mb-4 animate-bounce" />
              <h2 className="font-display font-black text-xl text-[#041B38] mb-2">
                Cotação Encaminhada com Prioridade!
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                Nossa equipe comercial da Lothus Descartáveis já recebeu sua solicitação e iniciou a análise cadastral e precificação.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="px-6 py-2.5 bg-[#041B38] text-white text-xs font-bold rounded-lg"
              >
                Nova Cotação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNPJ da Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Razão Social *</label>
                  <input
                    type="text"
                    required
                    placeholder="Razão Social ou Nome Fantasia"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Comprador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail Corporativo *</label>
                  <input
                    type="email"
                    required
                    placeholder="compras@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condição de Pagamento Pretendida</label>
                <CustomSelect
                  value={faturamento}
                  onChange={(val) => setFaturamento(val)}
                  fullWidth
                  options={[
                    { value: 'Boleto 28 Dias', label: 'Boleto Bancário 28 Dias Faturado' },
                    { value: 'Boleto 14/28/42 Dias', label: 'Boleto Parcelado 14/28/42 Dias (Volumes Altos)' },
                    { value: 'PIX à Vista (-5% OFF)', label: 'PIX à Vista com 5% de Desconto Imediato' },
                    { value: 'Cartão de Crédito Corporativo', label: 'Cartão de Crédito Corporativo até 6x' },
                  ]}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lista de Produtos Necessários ou Demanda Mensal Estimada *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Cole aqui a sua planilha ou lista de itens. Ex:&#10;- 20 Fardos de Papel Toalha Interfolha 2 Dobras 5.000 Fls&#10;- 10 Fardos de Papel Higiênico Rolão 300m&#10;- 5 Caixas de Copo Descartável 200ml (2.500 un)&#10;- 10 Galões de 5 Litros de Desinfetante Concentrado..."
                  value={demanda}
                  onChange={(e) => setDemanda(e.target.value)}
                  className="w-full p-3.5 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none resize-none font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FB8C00] hover:bg-amber-500 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Cotação para a Mesa Comercial Lothus</span>
              </button>
            </form>
          )}
        </div>

        {/* Coluna Direita: Vantagens Corporativas (Padronizada em Branco) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-4 shadow-xs">
            <span className="inline-block bg-blue-50 text-[#1863DC] border border-blue-100 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wide">
              DIFERENCIAIS LOTHUS
            </span>
            <h3 className="font-display font-black text-lg text-[#041B38]">
              Por que abastecer sua empresa conosco?
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span>Faturamento direto para empresas cadastradas em até 42 dias no boleto.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span>Frota própria para entrega ágil em toda a Grande São Paulo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span>Produtos com laudos técnicos ANVISA e FISPQ para auditorias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span>Consultor comercial fixo via WhatsApp e telefone.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl text-xs space-y-3">
            <h4 className="font-display font-bold text-sm text-[#041B38] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-lothus-royal" />
              <span>Já tem uma planilha orçada?</span>
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Envie diretamente seu arquivo para o e-mail oficial de faturamento:
            </p>
            <a
              href="mailto:contato@lothusdescartaveis.com.br"
              className="font-bold text-[#1863DC] hover:underline block text-xs"
            >
              contato@lothusdescartaveis.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
