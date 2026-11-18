import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Filter, Star, Heart, ArrowUpDown, MessageCircle } from '../components/ui/Icon';
import { FLASH_PRODUCTS, BEST_SELLER_PRODUCTS, DEPARTMENTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { useSEO } from '../hooks/useSEO';
import { CustomSelect } from '../components/ui/CustomSelect';
import { ProductCard } from '../components/ui/ProductCard';

interface CatalogPageProps {
  initialCategory?: string;
  onSelectCategory?: (slug: string) => void;
  onNavigate?: (page: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory,
  onSelectCategory,
  onNavigate,
  onSelectProduct
}) => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
  };

  const currentCategoryName = DEPARTMENTS.find(d => d.slug === selectedCategory)?.name || 'Todos os Departamentos';

  useSEO({
    title: `Catálogo de Atacado — ${currentCategoryName}`,
    description: `Confira a linha completa de ${currentCategoryName} com preços direto da distribuidora Lothus Descartáveis. Faturamento para empresas e descontos progressivos.`,
    canonical: `https://lothusdescartaveis.com.br/catalogo?categoria=${selectedCategory}`,
    keywords: ['catálogo atacado', 'produtos de limpeza corporativa', 'descartáveis em quantidade', currentCategoryName.toLowerCase()]
  });

  const allProducts: Product[] = [...FLASH_PRODUCTS, ...BEST_SELLER_PRODUCTS];

  const matchesCategory = (categorySlug: string, targetSlug: string) => {
    if (targetSlug === 'todos') return true;
    if (categorySlug === targetSlug) return true;
    if (targetSlug === 'descartaveis' && categorySlug === 'food-service-e-descartaveis') return true;
    if (targetSlug === 'food-service-e-descartaveis' && categorySlug === 'descartaveis') return true;
    if (targetSlug === 'limpeza' && (categorySlug === 'limpeza-e-higiene' || categorySlug === 'equipamentos-de-limpeza')) return true;
    if (targetSlug === 'papelaria' && categorySlug === 'escritorio-e-papelaria') return true;
    if (targetSlug === 'artesanato' && categorySlug === 'artesanato-tecidos-festas') return true;
    return false;
  };

  const filtered = allProducts.filter(p => matchesCategory(p.categorySlug, selectedCategory)).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
        <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-lothus-royal">Home</button>
        <span>/</span>
        <span className="text-[#041B38] font-bold">Catálogo Geral & Suprimentos B2B</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Filtros */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-[#041B38] mb-4 pb-2 border-b border-slate-100">
              <Filter className="w-4 h-4 text-lothus-royal" />
              <span>Departamentos</span>
            </div>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleCategoryChange('todos')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'todos'
                    ? 'bg-blue-50 text-[#1863DC] font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todos os Departamentos ({allProducts.length})
              </button>
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleCategoryChange(dept.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center cursor-pointer ${
                    selectedCategory === dept.slug
                      ? 'bg-blue-50 text-[#1863DC] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{dept.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card B2B de Suporte */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-xl text-xs space-y-3 shadow-xs">
            <h4 className="font-display font-bold text-sm text-[#041B38] leading-snug">
              Precisa de orçamento para faturamento mensal programado?
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Consulte nossa mesa de vendas com condições de faturamento em até 42 dias no boleto PJ.
            </p>
            <a
              href="https://wa.me/5511977663741"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#16A34A] hover:bg-[#15803D] text-center font-display font-bold text-xs uppercase tracking-wider text-white rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </aside>

        {/* Listagem Principal */}
        <main className="flex-1">
          {/* Barra Superior de Ordenação & Modo de Visualização */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-xs text-slate-500">
              Exibindo <strong className="text-[#041B38]">{filtered.length} produtos</strong> disponíveis para pronta entrega
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Seletor de Ordenação Estilizado */}
              <CustomSelect
                value={sortBy}
                onChange={(val) => setSortBy(val as 'featured' | 'price-asc' | 'price-desc')}
                icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                className="min-w-[215px]"
                options={[
                  { value: 'featured', label: 'Destaques & Relevância' },
                  { value: 'price-asc', label: 'Menor Preço' },
                  { value: 'price-desc', label: 'Maior Preço' },
                ]}
              />

              {/* Botões de Modo: Grade vs Tabela B2B */}
              <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-lothus-royal' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Modo Grade Visual"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-lothus-royal' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Modo Lista B2B (Alta Densidade)"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Visualização em Grade */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onNavigate={onNavigate}
<<<<<<< Updated upstream
=======
                  buttonText="Adicionar ao Pedido"
>>>>>>> Stashed changes
                />
              ))}
            </div>
          ) : (
            /* Visualização em Lista B2B (Modo Tabela Técnica) */
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
              <div className="bg-slate-50 px-5 py-3 grid grid-cols-12 text-[11px] font-bold font-display text-slate-500 uppercase tracking-wider">
                <div className="col-span-6 sm:col-span-5">Item / SKU</div>
                <div className="col-span-2 hidden sm:block">Categoria</div>
                <div className="col-span-3 sm:col-span-3 text-right">Preço Unitário / Pix</div>
                <div className="col-span-3 sm:col-span-2 text-right">Ação</div>
              </div>

              {filtered.map((prod) => {
                const pixPrice = prod.price * 0.9;
                return (
                  <div key={prod.id} className="px-5 py-4 grid grid-cols-12 items-center gap-2 hover:bg-slate-50 transition-colors">
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 object-contain shrink-0" />
                      <div>
                        <h4 className="font-display font-bold text-xs text-[#041B38] line-clamp-1">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          SKU: {prod.sku} • {prod.brand}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 hidden sm:block text-xs text-slate-500">
                      {prod.category}
                    </div>

                    <div className="col-span-3 sm:col-span-3 text-right">
                      <span className="font-display font-bold text-xs text-[#041B38] block">
                        {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[10px] text-[#16A34A] font-medium">
                        no Pix (10% OFF)
                      </span>
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-right">
                      <button
                        onClick={() => addItem(prod, 1)}
                        className="px-3 py-1.5 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-[11px] uppercase rounded-md transition-colors"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
