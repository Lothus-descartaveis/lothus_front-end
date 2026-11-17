import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, MapPin, ChevronDown, Menu, X, Check } from '../ui/Icon';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  onOpenQuickQuote?: () => void;
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

const CATEGORIES = [
  { name: 'Limpeza e Higiene', slug: 'limpeza-e-higiene' },
  { name: 'Food Service', slug: 'food-service-e-descartaveis' },
  { name: 'Escritório e Papelaria', slug: 'escritorio-e-papelaria' },
  { name: 'Equipamentos', slug: 'equipamentos-de-limpeza' },
  { name: 'Artesanato', slug: 'artesanato-tecidos-festas' },
];

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeCategory,
  onSelectCategory,
}) => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, isAuthenticated, loginDemoCorporate } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('catalogo');
    }
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else if (onNavigate) {
      onNavigate('catalogo');
    }
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative bg-white border-b border-[#E2E8F0] text-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-4 pb-3.5">
        {/* LINHA 1: Logo Oficial | Barra de Busca Ampla | Destaque B2B */}
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* 1. Logo Oficial Lothus */}
          <div
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
          >
            <img
              src="/assets/logo-lothus-header.png"
              alt="Lothus Descartáveis & Suprimentos"
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-[22px] tracking-wide text-[#041B38] leading-tight">
                LOTHUS
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#585858] tracking-wider leading-none uppercase">
                DESCARTÁVEIS & SUPRIMENTOS
              </span>
            </div>
          </div>

          {/* 2. Barra de Busca Estilo Marketplace */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-[640px] h-12 bg-white border border-slate-300 rounded-md shadow-xs overflow-hidden items-center focus-within:border-[#0F668E] focus-within:ring-2 focus-within:ring-[#0F668E]/15 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos, marcas e muito mais..."
              className="flex-1 h-full px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none font-normal"
            />
            <button
              type="submit"
              aria-label="Buscar produtos"
              title="Buscar Produtos"
              className="w-12 h-full bg-[#0F668E] hover:bg-[#0B4F6E] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </form>

          {/* 3. Minha Conta (lado direito da Linha 1) */}
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('perfil')}
              className="hidden md:flex items-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-3.5 py-1.5 transition-colors cursor-pointer shrink-0 group max-w-[250px] shadow-2xs"
            >
              <span className="w-8 h-8 rounded-full bg-[#0F668E] text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </span>
              <span className="flex flex-col text-left leading-tight min-w-0">
                <span className="text-[12px] font-bold text-[#041B38] group-hover:text-[#0F668E] transition-colors truncate">
                  {user.nomeFantasia || user.buyerName}
                </span>
                <span className="text-[10px] font-semibold text-[#0F668E] truncate">
                  Meu Perfil Corporativo
                </span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-4 py-1.5 transition-colors shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('login')}
                aria-label="Minha Conta"
                className="w-8 h-8 rounded-full bg-[#0F668E] text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <User className="w-4 h-4" />
              </button>
              <div className="flex flex-col text-left leading-tight">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('login')}
                  className="text-[12px] font-bold text-[#041B38] hover:text-[#0F668E] transition-colors text-left cursor-pointer"
                >
                  Minha Conta
                </button>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('login')}
                    className="hover:text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Entrar
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('registro')}
                    className="text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Criar Conta
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      loginDemoCorporate();
                      onNavigate && onNavigate('perfil');
                    }}
                    className="text-slate-600 hover:text-[#0F668E] hover:underline cursor-pointer"
                  >
                    Perfil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ações Mobile (Carrinho + Menu) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir carrinho"
              className="relative p-2 text-[#041B38] hover:text-[#1863DC] cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#FB8C00] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Menu"
              className="p-2 text-[#041B38] hover:text-[#1863DC] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Busca Mobile */}
        <form
          onSubmit={handleSearch}
          className="mt-2.5 flex md:hidden w-full h-10 bg-white border border-slate-300 rounded-md shadow-xs overflow-hidden items-center focus-within:border-[#0F668E]"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos, marcas e muito mais..."
            className="flex-1 h-full px-3.5 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none"
          />
          <button
            type="submit"
            aria-label="Buscar produtos"
            className="w-12 h-full bg-[#0F668E] hover:bg-[#0B4F6E] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>
        </form>

        {/* LINHA 2: Localização | Departamentos | Pedidos & Carrinho */}
        <div className="hidden md:flex items-center justify-between gap-4 pt-3.5 mt-2.5">
          {/* Localização / Entrega */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('catalogo')}
            className="flex items-center gap-1.5 text-left text-slate-600 hover:text-[#041B38] transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-slate-400 font-normal">
                Enviar para
              </span>
              <span className="text-[12px] font-medium text-slate-700">
                São Paulo - SP
              </span>
            </div>
          </button>

          {/* Links de Departamentos */}
          <nav className="flex items-center gap-4 lg:gap-5">
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
                className={`whitespace-nowrap flex items-center gap-1 text-[13px] transition-colors cursor-pointer ${
                  activeCategory === 'todos' || categoriesDropdownOpen
                    ? 'text-[#1863DC] font-semibold'
                    : 'text-slate-600 hover:text-[#041B38]'
                }`}
              >
                <span>Categorias</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180 text-[#1863DC]' : 'text-slate-400'
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick('todos')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      activeCategory === 'todos'
                        ? 'bg-blue-50 text-[#1863DC] font-bold'
                        : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#041B38]'
                    }`}
                  >
                    <span>Todos os Departamentos</span>
                    {activeCategory === 'todos' && <Check className="w-3.5 h-3.5 text-[#1863DC]" />}
                  </button>
                  {CATEGORIES.map((cat) => {
                    const isSelected = activeCategory === cat.slug;
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategoryClick(cat.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-[#1863DC] font-bold'
                            : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#041B38]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#1863DC]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`whitespace-nowrap text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1863DC] font-semibold'
                      : 'text-slate-600 hover:text-[#1863DC]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Ações do Usuário & Carrinho */}
          <div className="flex items-center gap-4 lg:gap-5 shrink-0 text-[13px] text-slate-700">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('pedidos')}
              className="hover:text-[#0F668E] transition-colors cursor-pointer whitespace-nowrap"
            >
              Meus Pedidos
            </button>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir carrinho"
              title="Carrinho Atacado"
              className="relative flex items-center gap-1 hover:text-[#0F668E] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 text-[#041B38]" />
              {totalItems > 0 && (
                <span className="bg-[#FB8C00] text-white text-[10px] font-extrabold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 pb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Enviar para <strong>São Paulo - SP</strong></span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleCategoryClick('todos')}
                className="text-left text-xs font-medium text-slate-700 py-1.5 px-2 rounded hover:bg-slate-100 cursor-pointer"
              >
                Todas as Categorias
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="text-left text-xs font-medium text-slate-700 py-1.5 px-2 rounded hover:bg-slate-100 cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  onNavigate && onNavigate(isAuthenticated ? 'perfil' : 'login');
                  setMobileMenuOpen(false);
                }}
                className="text-[#041B38] hover:text-[#1863DC] cursor-pointer"
              >
                {isAuthenticated && user ? `Conta: ${user.nomeFantasia}` : 'Entrar / Cadastrar Empresa'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate && onNavigate('cotacao-b2b');
                  setMobileMenuOpen(false);
                }}
                className="text-[#1863DC] cursor-pointer"
              >
                Atacado PJ
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
