# Lothus Descartáveis — Frontend E-commerce & Portal B2B

Plataforma moderna de comércio eletrônico atacadista e portal corporativo B2B da **Lothus Descartáveis**, desenvolvida com foco em alta performance, usabilidade corporativa e conformidade com os mais rigorosos padrões de suprimento empresarial (higiene profissional, food service, descartáveis, equipamentos, papelaria e artesanato).

---

## 🚀 Tecnologias & Stack

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite 6](https://vitejs.dev/)
- **Estilização & Design System:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Arquitetura de Estado:** Context API (`CartContext`, `AuthContext`) com persistência segura em `localStorage`
- **Design & Prototipagem:** Sincronizado 1:1 com o arquivo executivo no Paper (`Lothus Descartáveis`)

---

## 🏢 Principais Recursos & Módulos

1. **Cabeçalho Corporativo em 2 Linhas:**
   - Linha 1: Identidade oficial da marca, barra de pesquisa com botão `#0F668E` e pílula de autenticação/perfil B2B em fundo branco com contorno suave.
   - Linha 2: Seletor de entrega regional (Grande SP e interior), dropdown dinâmico com navegação e filtragem para os 5 departamentos, atalho para *Meus Pedidos* e gaveta de carrinho em tempo real.
2. **Hero Banner Flutuante & Vitrines de Conversão:**
   - Banner responsivo em cantos arredondados contido na grade de 1440px com carrossel dinâmico e indicadores de traço (*dash indicators*).
   - Vitrines de Ofertas Relâmpago (*Flash Offers*), Mais Vendidos (*Best Sellers*) e Combos Operacionais B2B (*Kits de Reposição*).
3. **Catálogo & Listagem com Filtros Avançados:**
   - Navegação por departamentos oficiais (*Limpeza e Higiene*, *Food Service*, *Escritório e Papelaria*, *Equipamentos*, *Artesanato*).
   - Alternância entre visualização em Grade (*Grid*) e Lista (*List*), ordenação customizada via `CustomSelect` e suporte direto a WhatsApp comercial.
4. **Página de Produto (PDP) & Atacado PJ:**
   - Galeria técnica, cálculo dinâmico de desconto à vista no PIX, simulador de frete e prazos, tabela de laudos e conformidade (ABNT / ANVISA / FISPQ) e solicitação de cotação em lote.
5. **Portal Corporativo B2B & Autenticação:**
   - Cadastro empresarial PJ com validação de CNPJ, Inscrição Estadual, Razão Social e definição de compradores autorizados.
   - Painel de controle corporativo (*ProfilePage*) com histórico de pedidos, download simulado de DANFE/XML de NF-e, limite de faturamento a prazo (14/28dd) e recompra inteligente em 1 clique.
6. **Carrinho & Checkout:**
   - Gaveta lateral (*CartDrawer*) rápida e fluida com contagem de itens e atalho para o checkout corporativo com autopreenchimento fiscal.

---

## 📁 Estrutura do Projeto

```text
├── public/               # Favicon, logos oficiais da marca e imagens de produtos
│   ├── assets/           # Logotipos oficiais (512px, transparente, cabeçalho)
│   └── produtos/         # Fotografias em alta resolução por departamento
├── src/
│   ├── components/
│   │   ├── cart/         # Gaveta do carrinho de compras (CartDrawer)
│   │   ├── home/         # HeroBanner, FlashOffers, BenefitsBar, KitsB2B, etc.
│   │   ├── layout/       # Header oficial (2 linhas) e Footer institucional
│   │   ├── modals/       # Modais de cotação rápida B2B
│   │   └── ui/           # CustomSelect e componentes reutilizáveis
│   ├── context/          # CartContext e AuthContext
│   ├── data/             # Mock data de produtos reais, departamentos e pedidos B2B
│   ├── hooks/            # useSEO e hooks utilitários
│   ├── pages/            # HomePage, CatalogPage, ProductPage, CheckoutPage, ProfilePage, LoginRegisterPage, QuoteB2BPage
│   ├── types/            # Tipagens TypeScript completas do domínio e-commerce B2B
│   ├── App.tsx           # Roteamento e orquestração de páginas
│   ├── index.css         # Diretivas Tailwind e fontes
│   └── main.tsx          # Ponto de entrada React
├── package.json
├── tailwind.config.js    # Paleta de cores oficial (Teal Blue, Deep Navy, Conversion Emerald, etc.)
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18+ ou 20+ LTS
- Gerenciador de pacotes `npm`

### Instalação

```bash
# Instalar as dependências do projeto
npm install
```

### Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento Vite
npm run dev
```
Acesse a aplicação em `http://localhost:5173`.

### Build de Produção

```bash
# Compilar e validar tipos TypeScript + bundle Vite
npm run build

# Pré-visualizar o build de produção localmente
npm run preview
```

---

## 🌿 Estrutura de Branches

- `main`: Branch de produção estável, contendo as versões homologadas e prontas para deploy.
- `dev`: Branch principal de desenvolvimento e integração contínua para novas funcionalidades.

---

## 📄 Licença

Este projeto é protegido sob os termos da licença proprietária da **Lothus Descartáveis**. Todos os direitos reservados.
