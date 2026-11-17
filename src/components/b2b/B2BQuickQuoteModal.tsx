import React, { useState } from 'react';
import { X, Building2, Send, MessageCircle, FileText, CheckCircle2 } from '../ui/Icon';
import { CustomSelect } from '../ui/CustomSelect';

interface B2BQuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const B2BQuickQuoteModal: React.FC<B2BQuickQuoteModalProps> = ({ isOpen, onClose }) => {
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [contato, setContato] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [necessidade, setNecessidade] = useState('');
  const [faturamento, setFaturamento] = useState('Boleto 28 Dias');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);

    const message = `*SOLICITAÇÃO DE COTAÇÃO B2B - LOTHUS*%0A%0A*CNPJ:* ${cnpj}%0A*Empresa:* ${razaoSocial}%0A*Contato:* ${contato}%0A*WhatsApp:* ${whatsapp}%0A*Condição Desejada:* ${faturamento}%0A%0A*Lista de Suprimentos / Demanda:*%0A${encodeURIComponent(necessidade)}`;
    window.open(`https://wa.me/5511977663741?text=${message}`, '_blank');

    setTimeout(() => {
      setSent(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#E2E8F0]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#FB8C00] shrink-0" />
            <div>
              <h3 className="font-display font-extrabold text-base text-[#041B38]">
                Cotação Expressa B2B
              </h3>
              <p className="text-slate-400 text-xs">
                Faturamento faturado no boleto para Pessoa Jurídica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-14 h-14 text-[#16A34A] mb-3 animate-bounce" />
            <h4 className="font-display font-bold text-lg text-[#041B38] mb-1">
              Cotação Enviada com Sucesso!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Nossa mesa de vendas e consultoria técnica já recebeu suas informações e responderá em instantes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  CNPJ da Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Razão Social / Nome Fantasia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Empresa Comércio LTDA"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nome do Comprador / Solicitante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Condição de Pagamento Desejada
              </label>
              <CustomSelect
                value={faturamento}
                onChange={(val) => setFaturamento(val)}
                fullWidth
                options={[
                  { value: 'Boleto 28 Dias', label: 'Boleto Bancário 28 Dias (Faturado PJ)' },
                  { value: 'Boleto 14/28/42 Dias', label: 'Boleto 14/28/42 Dias (Grandes Volumes)' },
                  { value: 'PIX à Vista (-5% OFF)', label: 'PIX à Vista com 5% de Desconto Imediato' },
                  { value: 'Cartão de Crédito Corporativo', label: 'Cartão de Crédito Corporativo até 6x' },
                ]}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Itens Necessários ou Cole sua Lista de Suprimentos
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ex: 10 caixas papel toalha interfolha, 5 fardos saco lixo 100L reforçado, 2 caixas canetas azuis, 1 balde doblo..."
                value={necessidade}
                onChange={(e) => setNecessidade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-lothus-royal focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#FB8C00] hover:bg-amber-500 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Cotação para a Mesa de Atacado</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
