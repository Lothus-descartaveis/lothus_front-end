import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  ArrowUpDown,
  Tag
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { AdminProduct } from '../../types/admin';
import { DEPARTMENTS } from '../../data/mockData';

export const AdminProductsManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateProductStock } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'todos' | 'baixo' | 'zerado' | 'normal'>('todos');
  const [sortBy, setSortBy] = useState<'sales-desc' | 'price-desc' | 'price-asc' | 'stock-asc'>('sales-desc');

  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(DEPARTMENTS[0]?.name || 'Limpeza e Higiene');
  const [formCategorySlug, setFormCategorySlug] = useState(DEPARTMENTS[0]?.slug || 'limpeza-e-higiene');
  const [formPrice, setFormPrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState(0);
  const [formSku, setFormSku] = useState('');
  const [formBrand, setFormBrand] = useState('Lothus');
  const [formUnit, setFormUnit] = useState('Unidade');
  const [formStock, setFormStock] = useState(50);
  const [formMinStock, setFormMinStock] = useState(15);
  const [formImage, setFormImage] = useState('/produtos/limpeza/papel-toalha-santher-eco-et100.png');
  const [formDescription, setFormDescription] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(DEPARTMENTS[0]?.name || 'Limpeza e Higiene');
    setFormCategorySlug(DEPARTMENTS[0]?.slug || 'limpeza-e-higiene');
    setFormPrice(49.90);
    setFormOriginalPrice(59.90);
    setFormSku(`LTS-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormBrand('Lothus Distribuição');
    setFormUnit('Fardo / Caixa');
    setFormStock(40);
    setFormMinStock(15);
    setFormImage('/produtos/limpeza/papel-toalha-santher-eco-et100.png');
    setFormDescription('Item corporativo para abastecimento regular de empresas.');
    setIsModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormCategorySlug(prod.categorySlug);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice || prod.price);
    setFormSku(prod.sku);
    setFormBrand(prod.brand);
    setFormUnit(prod.unit);
    setFormStock(prod.stock ?? 0);
    setFormMinStock(prod.minStockAlert || 15);
    setFormImage(prod.image);
    setFormDescription(prod.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        categorySlug: formCategorySlug,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        sku: formSku,
        brand: formBrand,
        unit: formUnit,
        stock: Number(formStock),
        minStockAlert: Number(formMinStock),
        image: formImage,
        description: formDescription,
      });
    } else {
      addProduct({
        name: formName,
        category: formCategory,
        categorySlug: formCategorySlug,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPixPercent: 10,
        installmentsMax: 3,
        image: formImage,
        rating: 5.0,
        reviewsCount: 1,
        sku: formSku,
        brand: formBrand,
        unit: formUnit,
        stock: Number(formStock),
        minStockAlert: Number(formMinStock),
        description: formDescription,
        published: true,
      });
    }

    setIsModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'todos' || p.categorySlug === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase());

        const stock = p.stock ?? 0;
        const minAlert = p.minStockAlert || 15;
        let matchesStock = true;
        if (selectedStockFilter === 'baixo') matchesStock = stock > 0 && stock <= minAlert;
        if (selectedStockFilter === 'zerado') matchesStock = stock === 0;
        if (selectedStockFilter === 'normal') matchesStock = stock > minAlert;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'sales-desc') return b.salesCount - a.salesCount;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'stock-asc') return (a.stock ?? 0) - (b.stock ?? 0);
        return 0;
      });
  }, [products, search, selectedCategory, selectedStockFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Topo de Ações & Busca */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome do produto, SKU, marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0F668E] focus:ring-2 focus:ring-[#0F668E]/15"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FB8C00] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Produto</span>
          </button>
        </div>

        {/* Filtros por Departamento & Estoque */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#0F668E]" />
              Departamento:
            </span>
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-[#041B38] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({products.length})
            </button>
            {DEPARTMENTS.map((dept) => {
              const count = products.filter((p) => p.categorySlug === dept.slug).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedCategory(dept.slug)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    selectedCategory === dept.slug
                      ? 'bg-[#0F668E] text-white font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {dept.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer outline-none"
            >
              <option value="sales-desc">Mais Vendidos</option>
              <option value="price-desc">Maior Preço</option>
              <option value="price-asc">Menor Preço</option>
              <option value="stock-asc">Menor Estoque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grade / Tabela de Produtos */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 font-extrabold">Produto / SKU</th>
                <th className="py-3.5 px-4 font-extrabold">Departamento</th>
                <th className="py-3.5 px-4 font-extrabold">Preço Comercial</th>
                <th className="py-3.5 px-4 font-extrabold">Estoque Atual</th>
                <th className="py-3.5 px-4 font-extrabold">Vendas Acumuladas</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-5 font-extrabold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Nenhum produto cadastrado corresponde a esses filtros.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const stock = prod.stock ?? 0;
                  const minAlert = prod.minStockAlert || 15;
                  const isLow = stock <= minAlert && stock > 0;
                  const isOut = stock === 0;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-[#041B38] truncate leading-tight">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            SKU: {prod.sku} • {prod.brand}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {prod.category}
                      </td>

                      <td className="py-3.5 px-4 font-black text-sm text-[#041B38] whitespace-nowrap">
                        {prod.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {prod.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => updateProductStock(prod.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-[#041B38] text-center"
                          />
                          {isOut ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              Sem estoque
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Alerta baixo
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Normal
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-[#041B38] block">
                          {prod.salesCount} unidades
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {prod.revenueGenerated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => updateProduct(prod.id, { published: !prod.published })}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            prod.published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {prod.published ? 'Ativo na Loja' : 'Pausado'}
                        </button>
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F668E] hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja realmente excluir o produto "${prod.name}"?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-display font-black text-lg text-[#041B38]">
                {editingProduct ? 'Editar Produto do Catálogo' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Copo Descartável 200ml Reforçado"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departamento *</label>
                  <select
                    value={formCategorySlug}
                    onChange={(e) => {
                      const sel = DEPARTMENTS.find((d) => d.slug === e.target.value);
                      if (sel) {
                        setFormCategorySlug(sel.slug);
                        setFormCategory(sel.name);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.slug}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código SKU *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="Ex: DESC-COPO-200"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Comercial (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Original / De (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unidade de Venda *</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="Ex: Fardo c/ 1.000 un."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estoque Inicial (Qtd)</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alerta de Estoque Mínimo</label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caminho da Imagem</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição Comercial</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-[#0F668E] outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar no Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
