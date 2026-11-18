# 📑 Proposta Comercial & Projeto de Modernização Tecnológica
**Cliente:** Lothus Descartáveis (Vinicius Loureiro & Alysson)  
**Engenharia Responsável:** José Antônio • Suporte In Tech  
**Data:** Novembro de 2026  
**Status:** Apresentação Executiva Consolidada  
**Link do Projeto no Paper:** [00. Apresentação Executiva & Proposta Técnica](https://app.paper.design/file/01M6SSBK6EG999KHJJ7KTHVS2G/p-8-0)

---

## 🎯 1. Sumário Executivo
A presente proposta estabelece o diagnóstico técnico do e-commerce atual da **Lothus Descartáveis** (`lothusdescartaveis.com.br`), o plano emergencial de recuperação de receita (Fase 1) e o projeto completo de engenharia de software para a construção e migração definitiva para uma plataforma de alta performance sob medida (Fase 2), desacoplada do WordPress.

---

## 🔍 2. Diagnóstico Técnico do Site Atual (WordPress/WooCommerce)

### Gargalos Reais Mapeados:
1. **Fluxo de Compra Interrompido:** Ausência de gaveta/ícone de carrinho no header; produtos com variações exibem a falha nativa *"Desculpe, este produto não está disponível"*, omitindo preços e desabilitando o botão de compra.
2. **Rotas Quebradas e Erros 404:** Banner de equipamentos de limpeza com URLs duplicadas concatenadas; links de navegação e departamentos apontando para páginas inexistentes (`http://produto`) ou âncoras vazias (`#`); produtos esgotados exibidos na vitrine principal de mais vendidos.
3. **Canal B2B & Atendimento Desconectados:** Widget de WhatsApp desativado por regra de horário (`OFF`), rodapé sem telefones da empresa e total ausência de fluxo para faturamento PJ no boleto e cotações corporativas por fardo.
4. **Performance e Segurança Comprometidas:** Excesso de plugins de terceiros concorrentes gerando tempo de carregamento superior a 4 segundos no 4G mobile, baixo score no Google Lighthouse e vulnerabilidades recorrentes em plugins.

---

## ⚡ 3. A Decisão Estratégica: Por Que Sair do WordPress?

| Critério | WordPress / WooCommerce Atual | Nova Plataforma Sob Medida (Suporte In Tech) |
| :--- | :--- | :--- |
| **Estabilidade** | Frágil: atualizações de plugins quebram o checkout. | **Absoluta:** código proprietário onde cada linha foi testada. |
| **Velocidade** | Lenta (> 4s) devido a dezenas de scripts e consultas no banco. | **Instantânea (< 0.8s):** navegação fluida em Single Page App (SPA). |
| **Segurança** | Alvo frequente de ataques no `/wp-admin` e injeções SQL. | **Blindada:** API e banco de dados totalmente isolados da interface pública. |
| **Operação B2B** | Inexistente ou via remendos de plugins incompatíveis. | **Nativa:** faturamento PJ 28dd, tabela atacado e recompra em 1 clique. |

---

## 🏗️ 4. Arquitetura de Software & Stack Corporativa

A nova solução é desenhada sob arquitetura desacoplada e modular:

* **Frontend SPA (Interface & Catálogo):**
  * **React + Vite + TypeScript + Tailwind CSS**
  * Compilação extremamente enxuta, sem inchaço de bibliotecas desnecessárias.
  * Design System exclusivo desenvolvido no **Paper**, com padrão de excelência de grandes D2C (referência Ortobom).
  * Carrinho lateral deslizante, busca com preenchimento preditivo e checkout em 1 página.

* **Backend Engine (Regras de Negócio & Segurança):**
  * **Java Spring Boot + Spring Security + Spring Data JPA**
  * Padrão corporativo e bancário de altíssima confiabilidade e concorrência segura.
  * Regras fiscais estritas: cálculo dinâmico de impostos e fretes por CEP/doca, controle de estoque concorrente e validação fiscal de CNPJ (Receita/Sintegra).

* **Banco de Dados Relacional:**
  * **PostgreSQL** com transações estritas (ACID), integridade referencial e histórico auditável de pedidos e clientes.

* **Backoffice Gerencial & Analytics Integrado:**
  * Painel administrativo exclusivo para Vinicius e Alysson acompanharem faturamento consolidado, ticket médio B2B vs. Varejo, curva ABC de vendas e taxa de recompra.

---

## 🛠️ 5. Metodologia de Desenvolvimento Suporte In Tech

Nossa esteira de engenharia segue metodologia ágil (Scrum/Kanban) estruturada em 5 etapas transparentes:

```
[Etapa 01: Identidade Visual] ➔ [Etapa 02: Arquitetura & Dados] ➔ [Etapa 03: Implementação Fullstack] ➔ [Etapa 04: Testes & QA] ➔ [Etapa 05: Deploy & Go-Live]
```

1. **Etapa 01 — Identidade Visual & Design System no Paper:**
   Definição e validação prévia de todas as telas no Paper (Desktop e Mobile), tokens de cores, ícones e hierarquia tipográfica antes de qualquer linha de código.
2. **Etapa 02 — Arquitetura de Software & Modelagem Relacional:**
   Modelagem das entidades de dados no PostgreSQL e especificação dos contratos da API RESTful no Java Spring Boot.
3. **Etapa 03 — Implementação Real & Integrações:**
   Construção da interface no React Vite, integração com gateways de pagamento (PIX com baixa automática, Cartão e Boleto PJ a prazo) e cálculo de frete.
4. **Etapa 04 — Testes Rigorosos & Garantia de Qualidade:**
   Testes unitários automatizados no Spring Boot, testes de concorrência e estoque, simulação de compra ponta a ponta e testes de responsividade em múltiplos dispositivos.
5. **Etapa 05 — Deploy, Homologação & Go-Live Assistido:**
   Publicação em ambiente isolado (Staging) para navegação e validação conjunta com a diretoria da Lothus, virada de DNS sem queda (Zero Downtime) e treinamento da equipe.

---

## 💰 6. Planejamento Financeiro de Hospedagem & Infraestrutura

A estratégia de infraestrutura foi planejada para garantir custo operacional mínimo no início e economia máxima a longo prazo:

### **Fase 1: Lançamento Inicial & Validação (Vercel + Railway)**
* **Frontend na Vercel:** CDN global em borda com latência mínima e SSL automático $\approx$ **R$ 0 a R$ 110/mês**.
* **API Java + PostgreSQL no Railway:** Execução conteinerizada em Docker com cobrança proporcional ao uso real de memória/CPU $\approx$ **R$ 45 a R$ 130/mês**.
* **Custo Total Inicial Estimado:** **R$ 45 a R$ 240/mês**.
* *Benefício:* Zero necessidade de contratar administradores de redes ou servidores dedicados; foco 100% nas vendas.

### **Fase 2: Escala Gerenciada (Tração de Vendas)**
* Conforme o tráfego atinge dezenas de milhares de visitas e transações diárias, a nuvem escala automaticamente sem qualquer risco de indisponibilidade $\approx$ **R$ 250 a R$ 450/mês**.

### **Fase 3: Migração para VPS Dedicada (Longo Prazo & Operação Consolidada)**
* Quando a operação estiver madura e transacionando em alto volume, migra-se a infraestrutura para um servidor **VPS Dedicado** (Hetzner, DigitalOcean ou Contabo) gerenciado via contêineres Docker e orquestrador Coolify/Nginx.
* **Custo Total Fixo Previsto:** **R$ 60 a R$ 160/mês FIXOS** (mesmo suportando picos massivos de requisições, eliminando cobranças variáveis por uso).

---

## 📅 7. Cronograma de Transição Segura

* **Semana 01 (Saneamento Imediato no WordPress):** Desbloqueio do carrinho, restauração de links quebrados e ativação do WhatsApp B2B para estancar perdas imediatas.
* **Semanas 02 a 05 (Desenvolvimento Fullstack):** Construção da nova plataforma React + Java Spring Boot, integração de pagamentos e importação de catálogo.
* **Semana 06 (Homologação & Testes):** Validação fechada com Vinicius e Alysson em ambiente de staging e testes reais de pedidos.
* **Go-Live (Virada Definitiva):** Chaveamento de DNS com Zero Downtime, monitoramento intensivo de 72 horas e treinamento interno.
* **Sustentação Suporte In Tech:** Acompanhamento contínuo, backups automatizados e evolução contínua da plataforma.
