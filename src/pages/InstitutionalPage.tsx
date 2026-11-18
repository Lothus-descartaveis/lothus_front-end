import React, { useState, useEffect } from 'react';
import {
  Building2,
  Store,
  CreditCard,
  Truck,
  RotateCcw,
  HelpCircle,
  FileText,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle2,
} from '../components/ui/Icon';

export type InstitutionalTab =
  | 'sobre'
  | 'loja-fisica'
  | 'faturamento-pj'
  | 'entrega-frete'
  | 'trocas-devolucoes'
  | 'faq'
  | 'blog'
  | 'parceiros';

interface InstitutionalPageProps {
  initialTab?: InstitutionalTab;
  onNavigate?: (page: string) => void;
}

interface NavSection {
  id: InstitutionalTab;
  title: string;
  category: 'Institucional' | 'Operação & Central do Cliente';
  icon: React.ReactNode;
}

const SECTIONS: NavSection[] = [
  // Grupo Institucional
  {
    id: 'sobre',
    title: 'Sobre a Lothus Descartáveis',
    category: 'Institucional',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'loja-fisica',
    title: 'Nossa Loja Física em SP',
    category: 'Institucional',
    icon: <Store className="w-4 h-4" />,
  },
  {
    id: 'blog',
    title: 'Blog & Dicas de Higiene',
    category: 'Institucional',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'parceiros',
    title: 'Parceiros & Marcas Oficiais',
    category: 'Institucional',
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  // Grupo Operação & Central do Cliente
  {
    id: 'faturamento-pj',
    title: 'Faturamento PJ / Boleto 28 Dias',
    category: 'Operação & Central do Cliente',
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: 'entrega-frete',
    title: 'Política de Entrega e Frete',
    category: 'Operação & Central do Cliente',
    icon: <Truck className="w-4 h-4" />,
  },
  {
    id: 'trocas-devolucoes',
    title: 'Trocas e Devoluções',
    category: 'Operação & Central do Cliente',
    icon: <RotateCcw className="w-4 h-4" />,
  },
  {
    id: 'faq',
    title: 'Perguntas Frequentes (FAQ)',
    category: 'Operação & Central do Cliente',
    icon: <HelpCircle className="w-4 h-4" />,
  },
];

export const InstitutionalPage: React.FC<InstitutionalPageProps> = ({
  initialTab = 'sobre',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<InstitutionalTab>(initialTab);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialTab]);

  const handleTabChange = (tab: InstitutionalTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSection = SECTIONS.find((s) => s.id === activeTab) || SECTIONS[0];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 lg:py-12 font-sans text-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb Sóbrio */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="hover:text-[#0F668E] transition-colors cursor-pointer"
          >
            Início
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{currentSection.category}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{currentSection.title}</span>
        </nav>

        {/* Layout de Duas Colunas: Índice de Documentos (Esquerda) + Documento Informativo (Direita) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ==================================================================
              COLUNA ESQUERDA: ÍNDICE EDITORIAL DE CONTEÚDOS INFORMATIVOS
              ================================================================== */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs sticky top-6 space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  Institucional
                </h3>
                <nav className="space-y-0.5">
                  {SECTIONS.filter((s) => s.category === 'Institucional').map((sec) => {
                    const isActive = activeTab === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleTabChange(sec.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#0F668E] text-white font-semibold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-[#041B38]'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>
                          {sec.icon}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  Operação & Central do Cliente
                </h3>
                <nav className="space-y-0.5">
                  {SECTIONS.filter((s) => s.category === 'Operação & Central do Cliente').map((sec) => {
                    const isActive = activeTab === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleTabChange(sec.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#0F668E] text-white font-semibold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-[#041B38]'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>
                          {sec.icon}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Informações Oficiais de Registro */}
              <div className="pt-3 border-t border-slate-100 px-3 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Lothus Descartáveis & Suprimentos</p>
                <p>São Paulo – SP • CEP: 01310-100</p>
                <p>Central de Atendimento: (11) 5641-1015</p>
              </div>
            </div>
          </aside>

          {/* ==================================================================
              COLUNA DIREITA: DOCUMENTO INFORMATIVO FORMAL
              ================================================================== */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-2xs">
            
            {/* ================================================================
                DOCUMENTO 1: SOBRE A LOTHUS DESCARTÁVEIS
                ================================================================ */}
            {activeTab === 'sobre' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Documento Institucional
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Sobre a Lothus Descartáveis & Suprimentos
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Histórico empresarial, estrutura operacional e posicionamento no mercado corporativo de São Paulo.
                  </p>
                </header>

                <section className="space-y-4 text-sm leading-relaxed">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    1. Apresentação Corporativa
                  </h2>
                  <p>
                    A <strong>Lothus Descartáveis & Suprimentos</strong> é uma empresa distribuidora e atacadista sediada no município de São Paulo, especializada no abastecimento contínuo de materiais descartáveis, químicos de limpeza profissional, papéis institucionais, equipamentos técnicos de higienização, embalagens e papelaria para pessoas jurídicas e órgãos corporativos.
                  </p>
                  <p>
                    Fundada com a finalidade de suprir gargalos operacionais e logísticos enfrentados por instituições de saúde, estabelecimentos gastronômicos, indústrias e condomínios, a Lothus consolidou uma cadeia de suprimentos direta com os maiores fabricantes do país, eliminando intermediários e permitindo escala de preço e regularidade de estoque.
                  </p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    2. Estrutura Operacional e Logística
                  </h2>
                  <p>
                    A operação da Lothus é alicerçada em um Centro de Distribuição estrategicamente localizado na Zona Sul da capital paulista, operando com frota própria de caminhões e veículos utilitários devidamente adaptados para o transporte de cargas secas e produtos saneantes.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li><strong>Catálogo Operacional:</strong> Mais de 2.000 itens mantidos sob controle de estoque permanente em lotes industriais e caixas master fechadas.</li>
                    <li><strong>Área de Armazenagem:</strong> Setorização técnica que separa produtos químicos saneantes de materiais descartáveis alimentícios e papéis, evitando qualquer contaminação cruzada.</li>
                    <li><strong>Atendimento Logístico:</strong> Cobertura diária em toda a cidade de São Paulo e municípios adjacentes da Grande São Paulo, com prazos médios de entrega entre 24 e 48 horas úteis.</li>
                  </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    3. Segmentos Atendidos
                  </h2>
                  <p>
                    Nossa carteira de clientes corporativos abrange setores que exigem rigor sanitário, continuidade no abastecimento e conformidade fiscal estrita:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block">Saúde & Clínicas:</strong>
                      <span>Hospitais, laboratórios, consultórios odontológicos e clínicas veterinárias (sacos infectantes, luvas, álcool 70%).</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block">Food Service & Hotelaria:</strong>
                      <span>Restaurantes, cozinhas industriais, redes de fast-food e hotéis (copos descartáveis, papel toalha, guardanapos e químicos de desengorduramento).</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block">Indústrias & Logística:</strong>
                      <span>Plantas fabris, galpões de distribuição e centros operacionais (sacos de lixo reforçados, panos industriais e sabonetes de alto rendimento).</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block">Condomínios & Educação:</strong>
                      <span>Edifícios comerciais, condomínios residenciais, colégios e universidades (tratamento de piso, ceras acrílicas e lixeiras de coleta seletiva).</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    4. Conformidade Sanitária e Regulatória
                  </h2>
                  <p>
                    A comercialização de produtos químicos saneantes e materiais descartáveis segue rigorosamente a legislação sanitária brasileira:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>Todos os químicos possuem registro ou notificação ativa perante a Agência Nacional de Vigilância Sanitária (ANVISA).</li>
                    <li>Disponibilização integral das Fichas de Informação de Segurança de Produtos Químicos (FISPQ) e boletins técnicos laboratoriais.</li>
                    <li>Materiais descartáveis e embalagens plásticas produzidos em conformidade com as normas técnicas da ABNT.</li>
                  </ul>
                </section>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 2: NOSSA LOJA FÍSICA EM SP
                ================================================================ */}
            {activeTab === 'loja-fisica' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Unidade de Atendimento Presencial
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Nossa Loja Física em São Paulo
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Informações oficiais sobre atendimento presencial, showroom e procedimentos de retirada no balcão.
                  </p>
                </header>

                <section className="space-y-4 text-sm leading-relaxed">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    1. Endereço e Dados de Localização
                  </h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                    <p className="m-0"><strong>Logradouro:</strong> Zona Sul — São Paulo, SP</p>
                    <p className="m-0"><strong>Código de Endereçamento Postal (CEP):</strong> 01310-100</p>
                    <p className="m-0"><strong>Ponto de Referência:</strong> Região de Santo Amaro / Chácara Santo Antônio, com fácil acesso pelas avenidas Washington Luís, Nações Unidas (Marginal Pinheiros) e Vereador José Diniz.</p>
                    <p className="m-0"><strong>Estacionamento:</strong> Vagas privativas disponíveis para clientes e doca para carga de fardos e equipamentos.</p>
                  </div>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    2. Horários de Atendimento ao Público
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
                    <li><strong>Segunda a Sexta-feira:</strong> das 08h00 às 18h00 (ininterrupto).</li>
                    <li><strong>Sábados:</strong> das 08h00 às 13h00.</li>
                    <li><strong>Domingos e Feriados:</strong> Não há expediente operacional.</li>
                  </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    3. Procedimento de Retirada no Balcão (Pick-up)
                  </h2>
                  <p>
                    A unidade física da Lothus funciona como ponto de retirada para compras faturadas ou liquidadas antecipadamente pelo portal ou pelo televendas:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm">
                    <li><strong>Liberação Prévia:</strong> O pedido deve estar com o status de "Aprovado e Separado" pelo sistema antes do deslocamento.</li>
                    <li><strong>Documentação Necessária:</strong> Para retirada por funcionários da empresa compradora, apresentar crachá, autorização formal da empresa ou cópia do pedido de compra.</li>
                    <li><strong>Retirada por Terceiros ou Transportadoras:</strong> Indicar previamente no ato da compra os dados do motorista ou transportadora terceirizada para liberação na portaria de expedição.</li>
                    <li><strong>Custo de Operação:</strong> A modalidade de retirada presencial no balcão é 100% isenta de taxa de entrega, independentemente do volume ou valor faturado.</li>
                  </ol>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    4. Canais de Contato Direto com a Loja
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
                    <li><strong>Telefone Fixo / Televendas:</strong> (11) 5641-1015</li>
                    <li><strong>WhatsApp Corporativo da Loja:</strong> (11) 97766-3741</li>
                    <li><strong>E-mail de Atendimento:</strong> contato@lothusdescartaveis.com.br</li>
                  </ul>
                </section>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 3: FATURAMENTO PJ / BOLETO 28 DIAS
                ================================================================ */}
            {activeTab === 'faturamento-pj' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Política Comercial de Crédito
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Faturamento PJ / Boleto Bancário em 28 Dias
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Condições comerciais, critérios de análise cadastral e procedimentos fiscais para faturamento a prazo.
                  </p>
                </header>

                <section className="space-y-4 text-sm leading-relaxed">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    1. Diretrizes do Faturamento a Prazo
                  </h2>
                  <p>
                    A Lothus Descartáveis oferece a pessoas jurídicas a modalidade de faturamento mercantil via boleto bancário registrado com vencimento em <strong>14, 21 ou 28 dias</strong> da data de emissão da Nota Fiscal Eletrônica.
                  </p>
                  <p>
                    Essa facilidade é voltada ao abastecimento periódico de empresas, permitindo alinhamento com o fluxo de caixa corporativo sem a necessidade de comprometimento de limites de cartões de crédito institucionais.
                  </p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    2. Critérios e Requisitos para Aprovação Cadastral
                  </h2>
                  <p>
                    Para usufruir da condição de faturamento em boleto a prazo, a pessoa jurídica compradora é submetida a análise cadastral prévia realizada pelo setor financeiro da Lothus, baseada nos seguintes requisitos:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li><strong>Situação Cadastral:</strong> Inscrição ativa e regular perante a Receita Federal do Brasil (CNPJ) e Secretaria da Fazenda Estadual (Sintegra).</li>
                    <li><strong>Tempo de Atividade Econômica:</strong> Mínimo de 6 (seis) meses de constituição formal no Cadastro Nacional de Pessoa Jurídica.</li>
                    <li><strong>Restrições Creditícias:</strong> Ausência de apontamentos desabonadores graves em órgãos de proteção ao crédito (Serasa Experian / Boa Vista).</li>
                    <li><strong>Valor Mínimo de Pedido:</strong> O limite mínimo para emissão de boleto faturado é de <strong>R$ 350,00</strong> por pedido de compra.</li>
                  </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    3. Fluxo de Emissão Fiscal e Boletos
                  </h2>
                  <p>
                    Assim que a carga é expedida:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
                    <li>A Nota Fiscal Eletrônica (NF-e) é autorizada junto à SEFAZ-SP.</li>
                    <li>O Documento Auxiliar da Nota Fiscal Eletrônica (DANFE) e o arquivo de escrituração (.XML) são enviados para o e-mail fiscal da empresa.</li>
                    <li>O boleto bancário registrado é remetido para a caixa postal financeira cadastrada e também acompanha fisicamente o manifesto de carga junto às mercadorias.</li>
                  </ol>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    4. Prorrogações, Atrasos e Encargos
                  </h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                    <p className="m-0"><strong>Inadimplência:</strong> Títulos vencidos e não quitados sofrem incidência de juros de mora legais de 1% ao mês pro rata die e multa moratória contratual de 2%, além de ensejarem a suspensão provisória de novos limites de crédito.</p>
                    <p className="m-0"><strong>Solicitações de Prorrogação:</strong> Eventuais pedidos de repactuação de datas devem ser formalizados junto ao Departamento Financeiro com antecedência mínima de 48 horas úteis do vencimento do título.</p>
                  </div>
                </section>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 4: POLÍTICA DE ENTREGA E FRETE
                ================================================================ */}
            {activeTab === 'entrega-frete' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Regulamento Logístico de Distribuição
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Política Oficial de Entrega, Frete e Recebimento
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Abrangência de transporte, prazos operacionais, regras de frete e diretrizes para conferência física de volumes.
                  </p>
                </header>

                <section className="space-y-4 text-sm leading-relaxed">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    1. Abrangência e Modais de Transporte
                  </h2>
                  <p>
                    A distribuição de suprimentos da Lothus é executada através de dois modelos operacionais integrados:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li><strong>Frota Própria Dedicada:</strong> Veículos conduzidos por equipe interna especializada na movimentação de materiais descartáveis e fardos corporativos, atuando exclusivamente na capital de São Paulo e principais municípios da Região Metropolitana.</li>
                    <li><strong>Transportadoras Rodoviárias Parceiras:</strong> Empresas homologadas para atendimento de cidades do Interior e Litoral do Estado de São Paulo, bem como expedições em modalidade FOB contratadas diretamente pelo comprador.</li>
                  </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    2. Prazos de Entrega e Regras de Frete Grátis
                  </h2>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 font-bold">Região Geográfica</th>
                          <th className="py-2.5 px-3 font-bold">Prazo Médio</th>
                          <th className="py-2.5 px-3 font-bold">Condição de Frete Grátis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-[#041B38]">São Paulo — Capital</td>
                          <td className="py-2.5 px-3 text-slate-600">24h a 48h úteis</td>
                          <td className="py-2.5 px-3 text-[#16A34A] font-bold">Pedidos acima de R$ 350,00</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-[#041B38]">Grande SP (Santo André, SBC, S. Caetano, Diadema, Osasco, Guarulhos, Barueri)</td>
                          <td className="py-2.5 px-3 text-slate-600">24h a 72h úteis</td>
                          <td className="py-2.5 px-3 text-[#16A34A] font-bold">Pedidos acima de R$ 450,00</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-[#041B38]">Interior e Litoral de São Paulo</td>
                          <td className="py-2.5 px-3 text-slate-600">2 a 5 dias úteis</td>
                          <td className="py-2.5 px-3 text-slate-600">Cotação por cubagem e peso via transportadora</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    3. Agendamento em Docas e Condições Especiais
                  </h2>
                  <p>
                    Para clientes localizados em shopping centers, edifícios comerciais de alta densidade, hospitais ou plantas industriais com restrições de tráfego pesado e controle de docas:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>O comprador deve especificar a janela de recebimento e restrições de altura máxima de veículos no campo de observações do pedido.</li>
                    <li>A equipe de logística coordena o agendamento prévio perante a portaria ou administração do condomínio comercial.</li>
                    <li>A descarga é realizada até a área de doca ou almoxarifado no pavimento térreo do local de entrega.</li>
                  </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    4. Diretrizes Obrigatórias de Recebimento
                  </h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                    <p className="m-0"><strong>Conferência Imediata:</strong> O responsável pelo recebimento na empresa deve proceder com a conferência da integridade das caixas, lacres dos fardos e a quantidade de volumes confrontando com a Nota Fiscal no momento do descarregamento.</p>
                    <p className="m-0"><strong>Ressalva Formal:</strong> Constatada qualquer violação ou divergência quantitativa, a ressalva deve ser lançada obrigatoriamente no verso do canhoto da Nota Fiscal no ato da entrega.</p>
                  </div>
                </section>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 5: TROCAS E DEVOLUÇÕES
                ================================================================ */}
            {activeTab === 'trocas-devolucoes' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Termo de Conformidade e Garantia
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Política de Trocas, Devoluções e Logística Reversa
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Procedimentos operacionais para devolução por arrependimento, recusa por avaria e substituição de materiais.
                  </p>
                </header>

                <section className="space-y-4 text-sm leading-relaxed">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    1. Base Legal e Princípios Gerais
                  </h2>
                  <p>
                    A presente política estabelece as normas adotadas pela Lothus Descartáveis em conformidade com as disposições do Código de Defesa do Consumidor (Lei Federal nº 8.078/1990) e as práticas consolidadas de comércio mercantil entre pessoas jurídicas.
                  </p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    2. Prazos e Modalidades de Devolução
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">2.1 Devolução por Desistência / Arrependimento:</strong>
                      <p className="m-0 leading-relaxed text-slate-600">
                        Em conformidade com o Artigo 49 do CDC, compras não-presenciais realizadas através do portal eletrônico ou televendas podem ser devolvidas no prazo de até <strong>7 (sete) dias corridos</strong>, contados a partir da data de recebimento formal da mercadoria.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">2.2 Avaria de Transporte ou Divergência Quantitativa:</strong>
                      <p className="m-0 leading-relaxed text-slate-600">
                        Volumes que apresentem sinais visíveis de amassamento, umidade, rompimento de fardos ou divergência de modelo devem ser recusados de imediato com o transportador. Caso a irregularidade seja constatada internamente após o descarregamento, a ocorrência deve ser comunicada formalmente à Lothus no prazo máximo de <strong>48 horas úteis</strong>.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">2.3 Vício Oculto ou Defeito Fabril:</strong>
                      <p className="m-0 leading-relaxed text-slate-600">
                        Para produtos que apresentem falha técnica de fabricação (como alteração na fórmula de químicos saneantes ou espessura fora de padrão em copos e sacos), o prazo para solicitação de troca é de até <strong>30 (trinta) dias</strong> corridos, sujeito à análise do lote pelo fabricante homologado.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    3. Condições Exigidas das Mercadorias
                  </h2>
                  <p>
                    Para que a devolução ou troca seja homologada pelo controle de qualidade:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>O produto deve estar estritamente acondicionado em sua embalagem original (caixa master ou fardo lacrado de fábrica).</li>
                    <li>Galões de produtos químicos não podem apresentar lacres rompidos, violação de dosadores ou fracionamento de conteúdo.</li>
                    <li>Não serão aceitas devoluções de descartáveis abertos ou manuseados, por expressa vedação das normas de vigilância sanitária.</li>
                    <li>A mercadoria deve estar acompanhada da 1ª via da Nota Fiscal ou DANFE correspondente.</li>
                  </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed mt-8">
                  <h2 className="text-lg font-bold text-[#041B38] border-b border-slate-100 pb-2">
                    4. Procedimento de Logística Reversa e Ressarcimento
                  </h2>
                  <p>
                    Aprovada a solicitação pelo SAC:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
                    <li>A coleta dos materiais é agendada e executada pela frota da Lothus diretamente no endereço da empresa, sem qualquer custo de frete reverso.</li>
                    <li>Após a entrada dos produtos no Centro de Distribuição e laudo favorável da inspeção, realiza-se o cancelamento do boleto bancário correspondente ou o estorno de valores em conta bancária de mesma titularidade jurídica em até 3 dias úteis.</li>
                  </ol>
                </section>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 6: PERGUNTAS FREQUENTES (FAQ)
                ================================================================ */}
            {activeTab === 'faq' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Central de Dúvidas Operacionais
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Perguntas Frequentes (FAQ)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Esclarecimentos técnicos e respostas formais para as principais questões de compras corporativas.
                  </p>
                </header>

                <div className="space-y-4">
                  {[
                    {
                      q: '1. Quais são os requisitos para compras na modalidade faturada em 28 dias?',
                      a: 'Para faturamento a prazo via boleto bancário, a empresa compradora deve possuir CNPJ ativo há pelo menos 6 meses, situação regular no Sintegra/Receita Federal e pedido mínimo de R$ 350,00. A análise de crédito é processada pelo setor financeiro em até 2 horas úteis.',
                    },
                    {
                      q: '2. Pessoas físicas (CPF) podem efetuar compras na Lothus Descartáveis?',
                      a: 'Sim. A plataforma atende tanto pessoas jurídicas quanto compradores pessoas físicas. As modalidades de pagamento para CPF incluem PIX à vista com desconto e cartão de crédito em até 3 parcelas sem acréscimo.',
                    },
                    {
                      q: '3. Como são emitidos e enviados os documentos fiscais (NF-e, XML e boletos)?',
                      a: 'Todas as operações da Lothus geram emissão automática de Nota Fiscal Eletrônica. O arquivo XML e o espelho em PDF (DANFE) são encaminhados digitalmente para o e-mail contábil fornecido no cadastro cadastral assim que a mercadoria é faturada.',
                    },
                    {
                      q: '4. Os produtos químicos saneantes contam com registro na ANVISA e fichas FISPQ?',
                      a: 'Sim. Todos os produtos químicos saneantes distribuídos pela Lothus contam com notificação ou registro ativo perante a ANVISA. As Fichas de Informações de Segurança de Produtos Químicos (FISPQ) podem ser solicitadas ao atendimento técnico ou baixadas diretamente nas páginas técnicas de produto.',
                    },
                    {
                      q: '5. Como proceder em caso de entregas em locais com agendamento de doca obrigatório?',
                      a: 'Para entregas em condomínios comerciais, hospitais ou shopping centers com restrição de horários de descarregamento, a restrição de horário deve ser informada no campo de observações do pedido de compra para que a rota da frota seja devidamente planejada.',
                    },
                    {
                      q: '6. A retirada de mercadorias no balcão da loja física possui taxa de serviço?',
                      a: 'Não. A modalidade de retirada presencial na loja física da Zona Sul de São Paulo é totalmente gratuita, permitindo que a empresa retire produtos faturados no mesmo dia sem cobrança de taxa de frete.',
                    },
                    {
                      q: '7. Como funciona a política de preços de atacado e caixas fechadas?',
                      a: 'A tabela de preços da Lothus opera de forma progressiva: itens adquiridos em embalagens master fechadas ou fardos múltiplos possuem descontos unitários já calculados automaticamente na composição do pedido.',
                    },
                  ].map((faq, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-xs sm:text-sm text-[#041B38] bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer gap-3"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaqIndex === i ? 'rotate-180 text-[#0F668E]' : ''}`} />
                      </button>
                      {openFaqIndex === i && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 7: BLOG & DICAS DE HIGIENE
                ================================================================ */}
            {activeTab === 'blog' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Artigos Técnicos e Guias Informativos
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Blog & Dicas de Higiene Profissional
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Orientações práticas de controle sanitário, diluição de químicos e dimensionamento de consumo corporativo.
                  </p>
                </header>

                <div className="space-y-6">
                  <section className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
                    <span className="text-[10px] font-bold text-[#0F668E] uppercase tracking-wider">
                      Guia Técnico 01 • Diluição & Químicos
                    </span>
                    <h2 className="text-base font-bold text-[#041B38] m-0">
                      Metodologia de Diluição de Químicos Concentrados: Eficiência e Redução de Custos
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                      O uso de produtos saneantes concentrados em galões de 5 litros representa uma das principais formas de contenção de despesas operacionais em facilities. Para atingir o rendimento estipulado pelo fabricante (ex: proporções de 1:20 a 1:100), é imperativa a instalação de dosadores automáticos acoplados à rede hidráulica, prevenindo o excesso de produto que gera manchas no piso e gastos desnecessários.
                    </p>
                  </section>

                  <section className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
                    <span className="text-[10px] font-bold text-[#0F668E] uppercase tracking-wider">
                      Guia Técnico 02 • Vigilância Sanitária
                    </span>
                    <h2 className="text-base font-bold text-[#041B38] m-0">
                      Normas da ANVISA para Uso de Descartáveis em Manipulação de Alimentos
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                      As diretrizes de Boas Práticas de Manipulação (RDC nº 216 da ANVISA) determinam que cozinhas industriais, lanchonetes e hospitais devem utilizar papel toalha 100% celulose virgem (não reciclável) para secagem das mãos, além de luvas específicas e toucas descartáveis sanfonadas para evitar desprendimento de fios em alimentos.
                    </p>
                  </section>

                  <section className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
                    <span className="text-[10px] font-bold text-[#0F668E] uppercase tracking-wider">
                      Guia Técnico 03 • Gestão de Resíduos
                    </span>
                    <h2 className="text-base font-bold text-[#041B38] m-0">
                      Classificação de Sacos de Lixo por Micragem e Resolução Conama
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                      A espessura de sacos plásticos (micragem) determina a capacidade de retenção de peso e resistência ao rasgo. Sacos de 100 litros hospitalares devem ser de cor branca leitosa e identificados com o símbolo de resíduo infectante, enquanto sacos pretos reforçados para condomínios exigem densidade mínima para suportar resíduos úmidos pesados sem ruptura.
                    </p>
                  </section>

                  <section className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
                    <span className="text-[10px] font-bold text-[#0F668E] uppercase tracking-wider">
                      Guia Técnico 04 • Papéis Institucionais
                    </span>
                    <h2 className="text-base font-bold text-[#041B38] m-0">
                      Comparativo de Consumo: Papel Toalha Interfolhado 2 Dobras vs. Rolo Contínuo
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                      Em banheiros corporativos com tráfego superior a 100 pessoas/dia, o sistema interfolhado de folha dupla em dispensers com trava proporciona controle de puxada (média de 2 a 3 folhas por uso), reduzindo o desperdício em relação aos rolos manuais em que o usuário puxa extensões desproporcionais de papel.
                    </p>
                  </section>
                </div>
              </article>
            )}

            {/* ================================================================
                DOCUMENTO 8: PARCEIROS & MARCAS OFICIAIS
                ================================================================ */}
            {activeTab === 'parceiros' && (
              <article className="prose max-w-none text-slate-700">
                <header className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-[11px] font-bold text-[#0F668E] uppercase tracking-wider block mb-1">
                    Rede de Fornecedores Homologados
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#041B38] m-0">
                    Parceiros & Marcas Oficiais da Lothus
                  </h1>
                  <p className="text-xs text-slate-400 mt-1.5 m-0">
                    Relação das indústrias nacionais credenciadas e linhas de suprimento distribuídas formalmente.
                  </p>
                </header>

                <section className="space-y-4 text-sm leading-relaxed">
                  <p>
                    A Lothus atua como distribuidora autorizada de fabricantes que cumprem com os parâmetros da ABNT, ANVISA e padrões de certificação ISO. Todas as mercadorias contam com garantia de origem, procedência de fábrica e suporte técnico:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">Bralimpia Equipamentos</strong>
                      <p className="m-0 text-slate-600 leading-relaxed">
                        Fabricante nacional líder em sistemas de limpeza profissional: carros funcionais América, baldes espremedores Doblô, cabos de alumínio anodizado, mops úmidos/pó e discos abrasivos para lavadoras de piso.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">Shinefloor / Lothus Pro</strong>
                      <p className="m-0 text-slate-600 leading-relaxed">
                        Linha técnica de químicos concentrados, ceras acrílicas auto-brilho, impermeabilizantes de piso, limpadores neutros e desinfetantes com laudos bactericidas certificados.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">KeroCopo Descartáveis</strong>
                      <p className="m-0 text-slate-600 leading-relaxed">
                        Indústria de descartáveis plásticos termomoldados em polipropileno (PP) e poliestireno (PS): copos descartáveis para café (50ml), água (180ml e 200ml) e pratos em caixas master com 2.500 unidades.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">SantaPel Papéis</strong>
                      <p className="m-0 text-slate-600 leading-relaxed">
                        Linha de papéis institucionais 100% celulose virgem: papéis toalha interfolhados de 2 dobras (fardos de 1.000 a 2.400 folhas) e papéis higiênicos rolão de 300 a 500 metros para ambientes de alto fluxo.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">JSN Lixeiras & Coletores</strong>
                      <p className="m-0 text-slate-600 leading-relaxed">
                        Soluções em polietileno e aço inoxidável: lixeiras de pedal com acionamento reforçado para uso hospitalar, conjuntos para coleta seletiva e cinzeiros ecológicos.
                      </p>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-1">
                      <strong className="text-[#041B38] block text-sm">Melitta & Suprimentos de Copa</strong>
                      <p className="m-0 text-slate-600 leading-relaxed">
                        Linhas de café em pó institucional embalados a vácuo, filtros de papel industriais (nº 102 e 103) e artigos complementares de copa e cozinha para ambientes corporativos.
                      </p>
                    </div>
                  </div>
                </section>
              </article>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalPage;
