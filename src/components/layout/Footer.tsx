import React, { useState } from 'react';
import { 
  Phone, 
  Send, 
  CheckCircle2, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const socialIcons = [
    { 
      icon: <Instagram className="h-4 w-4 text-[#E1306C]" />, 
      href: 'https://instagram.com/lothusdescartaveis', 
      label: 'Instagram' 
    },
    { 
      icon: <Linkedin className="h-4 w-4 text-[#0A66C2]" />, 
      href: 'https://linkedin.com/company/lothus-descartaveis', 
      label: 'LinkedIn' 
    },
    { 
      icon: <MessageCircle className="h-4 w-4 text-[#16A34A]" />, 
      href: 'https://wa.me/5511977663741', 
      label: 'WhatsApp' 
    },
  ];

  const legalLinks = [
    { text: 'Termos de Uso', href: '#termos' },
    { text: 'Política de Privacidade (LGPD)', href: '#lgpd' },
    { text: 'Política de Cookies', href: '#cookies' },
    { text: 'Acessibilidade', href: '#acessibilidade' },
  ];

  return (
    <footer className="relative w-full bg-[#FFFFFF] mt-16 pt-14 pb-10 font-sans overflow-hidden">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* ====================================================================
            1. SEÇÃO SUPERIOR DE NEWSLETTER & LOGO OFICIAL (DIRETAMENTE NO FOOTER, SEM CARD)
            ==================================================================== */}
        <div className="pb-12 mb-12 border-b border-[#E2E8F0]">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-2xl font-display font-extrabold text-[#041B38] md:text-3xl leading-tight">
                Fique à frente com a Lothus Descartáveis
              </h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed max-w-lg">
                Cadastre o e-mail da sua empresa para receber cotações exclusivas de atacado, avisos de fardos fechados com desconto progressivo e novidades de catálogo.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row max-w-lg">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Cadastre seu e-mail corporativo ou pessoal aqui"
                  className="flex-1 h-12 px-4 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#041B38] placeholder:text-slate-400 focus:outline-none focus:border-[#1863DC] focus:ring-2 focus:ring-[#1863DC]/20 transition-all"
                />
                <button 
                  type="submit"
                  className="h-12 px-7 bg-[#FB8C00] hover:bg-amber-600 text-white font-display font-bold text-sm rounded-lg transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Cadastrar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {subscribed && (
                <div className="mt-3 text-xs text-[#16A34A] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  E-mail cadastrado com sucesso! Em breve você receberá nossas ofertas e tabelas.
                </div>
              )}
            </div>

            {/* LADO DIREITO: LOGO OFICIAL DA LOTHUS DIRETAMENTE NO FOOTER */}
            <div className="hidden justify-end md:flex">
              <img
                src="/assets/logo-lothus-transparent.png"
                alt="Lothus Descartáveis & Suprimentos — Logo Oficial"
                className="w-64 h-auto max-h-52 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logo-lothus-header.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* ====================================================================
            2. 4 COLUNAS INSTITUCIONAIS (LAYOUT LIMPO E SIMÉTRICO)
            ==================================================================== */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Coluna 1: Institucional */}
          <div>
            <h4 className="font-display font-extrabold text-sm text-[#041B38] uppercase tracking-wide mb-4">
              Institucional
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#sobre" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Sobre a Lothus Descartáveis
                </a>
              </li>
              <li>
                <a href="#loja" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Nossa Loja Física em SP
                </a>
              </li>
              <li>
                <a href="#blog" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Blog & Dicas de Higiene
                </a>
              </li>
              <li>
                <a href="#fornecedores" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Parceiros & Marcas Oficiais
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Departamentos */}
          <div>
            <h4 className="font-display font-extrabold text-sm text-[#041B38] uppercase tracking-wide mb-4">
              Departamentos
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#limpeza" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Limpeza e Higiene Profissional
                </a>
              </li>
              <li>
                <a href="#food" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Food Service e Descartáveis
                </a>
              </li>
              <li>
                <a href="#papelaria" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Escritório e Papelaria
                </a>
              </li>
              <li>
                <a href="#equipamentos" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Equipamentos Bralimpia
                </a>
              </li>
              <li>
                <a href="#artesanato" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Artesanato, Tecidos e Festas
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Central do Cliente */}
          <div>
            <h4 className="font-display font-extrabold text-sm text-[#041B38] uppercase tracking-wide mb-4">
              Central do Cliente
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#pedidos" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Meus Pedidos
                </a>
              </li>
              <li>
                <a href="#faturamento-pj" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Faturamento PJ / Boleto 28 Dias
                </a>
              </li>
              <li>
                <a href="#entrega" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Política de Entrega e Frete
                </a>
              </li>
              <li>
                <a href="#devolucoes" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-600 hover:text-[#1863DC] transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Fale Conosco */}
          <div>
            <h4 className="font-display font-extrabold text-sm text-[#041B38] uppercase tracking-wide mb-4">
              Fale Conosco
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1863DC] shrink-0" />
                <a href="tel:1156411015" className="text-[#041B38] font-bold hover:text-[#1863DC] transition-colors">
                  (11) 5641-1015
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <a href="https://wa.me/5511977663741" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-bold hover:underline">
                  (11) 97766-3741
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="mailto:contato@lothusdescartaveis.com.br" className="text-slate-600 hover:text-[#1863DC] transition-colors break-all">
                  contato@lothusdescartaveis.com.br
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-500 leading-tight">
                  São Paulo - SP • Entrega para todo o Brasil
                </span>
              </li>
            </ul>

            <div className="flex items-center space-x-2.5 mt-4">
              {socialIcons.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#F8FAFC] border border-[#E2E8F0] flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                  title={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            3. BARRA INFERIOR DE COPYRIGHT & LINKS LEGAIS
            ==================================================================== */}
        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left">
            <p>
              © 2026 Lothus Descartáveis. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Preços e condições exclusivos para o e-commerce e televendas corporativas.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-xs">
            {legalLinks.map((item) => (
              <a
                key={item.text}
                href={item.href}
                className="text-slate-500 hover:text-[#1863DC] transition-colors"
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
