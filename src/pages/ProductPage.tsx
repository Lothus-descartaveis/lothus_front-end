import React, { useState } from 'react';
import {
  Star,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  Boxes,
  FileCheck,
  PackageCheck,
  MapPin,
  Store,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { FLASH_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { useSEO } from '../hooks/useSEO';

interface ProductPageProps {
  product?: Product;
  onNavigate?: (page: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onNavigate }) => {
  const { addItem, setIsDrawerOpen } = useCart();
  const currentProduct = product || FLASH_PRODUCTS[0];

  useSEO({
    title: `${currentProduct.name} — Preço de Atacado`,
    description:
      currentProduct.description ||
      `Compre ${currentProduct.name} com desconto progressivo por quantidade e faturamento no boleto PJ na Lothus Descartáveis. Pronta-entrega para SP.`,
    canonical: `https://lothusdescartaveis.com.br/produto/${currentProduct.id}`,
    type: 'product',
    image: currentProduct.image,
    keywords: [currentProduct.name, currentProduct.category, 'atacado sp', currentProduct.brand],
  });

  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [cep, setCep] = useState('');
  const [freteCalculated, setFreteCalculated] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Escala de volume B2B
  const volumeTiers = [
    { min: 1, max: 5, discount: 0, label: 'Varejo' },
    { min: 6, max: 19, discount: 5, label: 'Pequeno Atacado' },
    { min: 20, max: 49, discount: 15, label: 'Médio Atacado' },
    { min: 50, max: 999, discount: 25, label: 'Grande Volume PJ' },
  ];

  const currentTier =
    volumeTiers.find((t) => quantity >= t.min && quantity <= t.max) || volumeTiers[0];
  const unitPrice = currentProduct.price * (1 - currentTier.discount / 100);
  const totalPrice = unitPrice * quantity;
  const totalPix = totalPrice * 0.95;
  const installmentValue = unitPrice / (currentProduct.installmentsMax || 3);

  const handleCalculateFrete = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length >= 8) {
      setFreteCalculated(true);
    }
  };

  const handleAddToCart = () => {
    addItem(currentProduct, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  const handleBuyNow = () => {
    addItem(currentProduct, quantity);
    setIsDrawerOpen(true);
  };

  const productDescription =
    currentProduct.description ||
    `${currentProduct.name} é um item de alta durabilidade e rendimento comprovado para o segmento corporativo. Fornecido diretamente pela distribuidora Lothus Descartáveis com procedência garantida, atende aos mais exigentes padrões de higiene, conservação e rotina operacional em clínicas, hospitais, escolas, indústrias e escritórios.`;

  const productFeatures =
    currentProduct.features && currentProduct.features.length > 0
      ? currentProduct.features
      : [
          'Alto rendimento e durabilidade comprovada para uso corporativo contínuo',
          'Fabricado sob rigorosos padrões de qualidade e conformidade sanitária',
          'Embalagem segura e reforçada para transporte e armazenamento em estoque',
          'Excelente custo-benefício com faturamento facilitado no boleto faturado PJ',
        ];

  const specs = currentProduct.specifications || {
    Marca: currentProduct.brand,
    'Código SKU': currentProduct.sku,
    Departamento: currentProduct.category,
    'Unidade de Venda': currentProduct.unit,
    Procedência: 'Nacional / Distribuição Oficial Lothus',
    Conformidade: 'Normas ABNT / Em conformidade com ANVISA',
    Garantia: 'Garantia legal de 90 dias contra defeitos de fabricação',
  };

  const thumbnails = [0, 1, 2, 3];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* ==================================================================
            1. BREADCRUMB & NAVEGAÇÃO
            ================================================================== */}
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="hover:text-[#1863DC] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à loja</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('catalogo')}
            className="hover:text-[#1863DC] transition-colors cursor-pointer"
          >
            {currentProduct.category}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-[#041B38] font-medium line-clamp-1">{currentProduct.name}</span>
        </div>

        {/* ==================================================================
            2. CARD PRINCIPAL ESTILO MARKETPLACE (3 COLUNAS ALINHADAS)
            ================================================================== */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-7 lg:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* COLUNA 1: GALERIA COM MINIATURAS VERTICAIS À ESQUERDA (5 COLUNAS) */}
            <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
              {/* Miniaturas */}
              <div className="flex sm:flex-col gap-2.5 shrink-0 overflow-x-auto sm:overflow-visible">
                {thumbnails.map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveThumb(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border p-1.5 flex items-center justify-center bg-white transition-all shrink-0 cursor-pointer ${
                      activeThumb === idx
                        ? 'border-[#1863DC] ring-2 ring-[#1863DC]/20'
                        : 'border-[#E2E8F0] hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={currentProduct.image}
                      alt={`${currentProduct.name} miniatura ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Imagem Principal */}
              <div className="flex-1 bg-white border border-slate-100 rounded-xl p-6 flex items-center justify-center min-h-[340px] sm:min-h-[440px]">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="max-h-[360px] max-w-full object-contain"
                />
              </div>
            </div>

            {/* COLUNA 2: TÍTULO, AVALIAÇÃO, PREÇO, ESCALA B2B E DESTAQUES (4 COLUNAS) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Metadados & Título */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 flex-wrap">
                  <span>Novo</span>
                  <span>|</span>
                  <span>Distribuição Oficial</span>
                  <span>|</span>
                  <span className="font-mono">SKU {currentProduct.sku}</span>
                </div>

                <h1 className="font-display font-bold text-xl sm:text-[22px] text-[#041B38] leading-snug">
                  {currentProduct.name}
                </h1>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {currentProduct.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#1863DC] fill-[#1863DC]" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    ({currentProduct.reviewsCount} avaliações)
                  </span>
                </div>
              </div>

              {/* Bloco de Preço Limpo */}
              <div className="pt-1">
                {currentProduct.originalPrice && currentProduct.originalPrice > unitPrice && (
                  <span className="text-sm text-slate-400 line-through block">
                    {currentProduct.originalPrice.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                )}

                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-display font-normal text-3xl sm:text-[34px] text-[#041B38] tracking-tight leading-none">
                    {unitPrice.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span className="text-xs font-bold text-[#16A34A]">
                    10% OFF
                  </span>
                </div>

                <p className="text-sm text-slate-700 mt-1.5">
                  em{' '}
                  <span className="text-[#16A34A] font-medium">
                    {currentProduct.installmentsMax || 3}x de{' '}
                    {installmentValue.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}{' '}
                    sem juros
                  </span>
                </p>

                <p className="text-xs text-[#1863DC] font-medium mt-1">
                  Emissão de NF-e e faturamento no Boleto PJ
                </p>
              </div>

              {/* Escala Progressiva de Volume B2B */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold text-[#041B38] flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-[#1863DC]" />
                    Desconto por quantidade (Atacado PJ)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {volumeTiers.map((tier, idx) => {
                    const tierPrice = currentProduct.price * (1 - tier.discount / 100);
                    const isSelected = quantity >= tier.min && quantity <= tier.max;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuantity(tier.min)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1863DC] bg-blue-50/60 ring-1 ring-[#1863DC]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-medium text-slate-600">
                            {tier.min}
                            {tier.max === 999 ? '+ un' : `–${tier.max} un`}
                          </span>
                          {tier.discount > 0 && (
                            <span className="text-[10px] font-bold text-[#16A34A]">
                              -{tier.discount}%
                            </span>
                          )}
                        </div>
                        <span className="font-display font-bold text-sm text-[#041B38] block mt-0.5">
                          {tierPrice.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* O que você precisa saber sobre este produto */}
              <div className="pt-3 border-t border-slate-100">
                <h2 className="font-display font-semibold text-sm text-[#041B38] mb-2.5">
                  O que você precisa saber sobre este produto
                </h2>
                <ul className="space-y-1.5 text-[13px] text-slate-600 list-disc pl-4">
                  {productFeatures.slice(0, 4).map((feat, i) => (
                    <li key={i} className="leading-snug">
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* COLUNA 3: BUY BOX LATERAL DIREITA (3 COLUNAS) */}
            <div className="lg:col-span-3">
              <div className="border border-[#E2E8F0] rounded-xl p-5 bg-white space-y-4 lg:sticky lg:top-6">
                {/* Entrega / Frete */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <div className="text-xs leading-snug">
                      <span className="font-semibold text-[#16A34A] block">
                        Entrega Expressa SP e Região
                      </span>
                      <span className="text-slate-500">
                        Receba com frota própria e seguro de carga
                      </span>
                    </div>
                  </div>

                  {/* Simulador compacto de CEP */}
                  <form onSubmit={handleCalculateFrete} className="flex gap-1.5 pt-1">
                    <div className="relative flex-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Calcular CEP"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        className="w-full pl-7 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#1863DC]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#041B38] text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      OK
                    </button>
                  </form>

                  {freteCalculated && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-[#041B38]">
                      <span className="font-bold text-[#16A34A] block">
                        Frete Grátis (1 a 2 dias úteis)
                      </span>
                      <span className="text-slate-600">
                        Válido para Capital e Grande São Paulo
                      </span>
                    </div>
                  )}
                </div>

                {/* Estoque */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-sm font-semibold text-[#041B38] block">
                    Estoque disponível
                  </span>
                  <span className="text-xs text-slate-500">
                    Pronta-entrega direta da distribuidora
                  </span>
                </div>

                {/* Quantidade */}
                <div className="pt-1 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">Quantidade:</span>
                    <span className="text-slate-400">({currentProduct.unit})</span>
                  </div>

                  <div className="flex items-center justify-between border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center font-bold font-mono text-sm text-[#041B38] outline-none border-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Total no Pix:</span>
                    <span className="font-display font-bold text-sm text-[#041B38]">
                      {totalPix.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Comprar agora
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-[#1863DC]/10 hover:bg-[#1863DC]/15 text-[#1863DC] font-display font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar ao carrinho</span>
                  </button>
                </div>

                {addedSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-[#16A34A] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Adicionado ao carrinho!</span>
                  </div>
                )}

                {/* Informações do Vendedor e Garantias */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
                  <div className="flex items-start gap-2">
                    <Store className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span>Vendido por </span>
                      <span className="text-[#1863DC] font-semibold">Lothus Descartáveis</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Devolução garantida em até 7 dias após o recebimento.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Compra Garantida com Nota Fiscal e suporte B2B.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Faturamento disponível no Boleto 28 dias para CNPJ.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              3. DIVISOR + FICHA TÉCNICA E DESCRIÇÃO DENTRO DO MESMO FLUXO
              ================================================================ */}
          <div className="mt-10 pt-8 border-t border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Ficha Técnica (7 colunas) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <Boxes className="w-5 h-5 text-[#1863DC]" />
                <h2 className="font-display font-bold text-lg text-[#041B38]">
                  Características do produto
                </h2>
              </div>

              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-[#E2E8F0] bg-slate-50/70">
                      <th className="py-3 px-4 font-semibold text-[#041B38] w-2/5">Código SKU</th>
                      <td className="py-3 px-4 text-slate-700 font-mono">{currentProduct.sku}</td>
                    </tr>
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="py-3 px-4 font-semibold text-[#041B38]">Marca</th>
                      <td className="py-3 px-4 text-slate-700">{currentProduct.brand}</td>
                    </tr>
                    <tr className="border-b border-[#E2E8F0] bg-slate-50/70">
                      <th className="py-3 px-4 font-semibold text-[#041B38]">Departamento</th>
                      <td className="py-3 px-4 text-slate-700">{currentProduct.category}</td>
                    </tr>
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="py-3 px-4 font-semibold text-[#041B38]">Unidade de Venda</th>
                      <td className="py-3 px-4 text-slate-700">{currentProduct.unit}</td>
                    </tr>

                    {Object.entries(specs).map(([key, val], idx) => {
                      if (['Marca', 'Código SKU', 'Departamento', 'Unidade de Venda'].includes(key))
                        return null;
                      return (
                        <tr
                          key={key}
                          className={`border-b border-[#E2E8F0] last:border-b-0 ${
                            idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                          }`}
                        >
                          <th className="py-3 px-4 font-semibold text-[#041B38]">{key}</th>
                          <td className="py-3 px-4 text-slate-700">{val}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Descrição Detalhada & Itens Inclusos (5 colunas) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#1863DC]" />
                <h2 className="font-display font-bold text-lg text-[#041B38]">
                  Descrição
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {productDescription}
              </p>

              {currentProduct.itemsIncluded && currentProduct.itemsIncluded.length > 0 && (
                <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4">
                  <h3 className="font-display font-bold text-xs text-[#FB8C00] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#FB8C00]" />
                    Itens Inclusos na Embalagem
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {currentProduct.itemsIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FB8C00] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================================
            4. BANNER CORPORATIVO B2B (PADRONIZADO BRANCO)
            ================================================================== */}
        <section className="mt-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-2.5 py-1 bg-blue-50 text-[#1863DC] border border-blue-200 text-[10px] font-bold uppercase tracking-wider rounded-md">
                ATENDIMENTO CORPORATIVO B2B
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#041B38] leading-tight">
                Precisa de Cotação em Lote ou Faturamento Mensal?
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Nossa equipe comercial atende clínicas, hospitais, escolas, restaurantes e
                indústrias com boleto faturado para 28 dias, entregas programadas e negociação
                sob demanda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://wa.me/5511977663741?text=Ol%C3%A1%2C%20gostaria%20de%20uma%20cota%C3%A7%C3%A3o%20especial%20para%20minha%20empresa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Falar no WhatsApp B2B</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('cotacao-b2b')}
                className="px-5 py-3 bg-white border border-[#E2E8F0] text-[#041B38] font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>Portal de Cotações</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductPage;
