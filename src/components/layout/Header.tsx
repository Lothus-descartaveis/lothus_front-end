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
  { name: 'Limpeza & Higiene', slug: 'limpeza-e-higiene' },
  { name: 'Food Service', slug: 'food-service-e-descartaveis' },
  { name: 'Embalagens', slug: 'embalagens' },
  { name: 'Escritório', slug: 'escritorio-e-papelaria' },
  { name: 'EPIs & Proteção', slug: 'epis-e-protecao' },
  { name: 'Equipamentos', slug: 'equipamentos-de-limpeza' },
];

const DEPARTMENTS = [
  { name: 'Todos os Departamentos', slug: 'todos' },
  ...CATEGORIES,
  { name: 'Artesanato', slug: 'artesanato-tecidos-festas' },
];

const POPULAR_SEARCHES = ['Copos 200ml', 'Luvas Nitrílicas', 'Papel Toalha', 'Sacos 100L'];

const AUTOCOMPLETE_SUGGESTIONS = [
  'copos descartáveis 200ml',
  'copo descartável 180ml café',
  'copo térmico isopor 180ml',
  'caixas de papelão correio atacado',
  'canudos biodegradáveis papel',
  'colheres e garfos descartáveis',
  'copos acrílicos para eventos',
];

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenQuickQuote,
  activeCategory,
  onSelectCategory,
}) => {
  const { totalItems, subtotal, setIsDrawerOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [allCatsDropdownOpen, setAllCatsDropdownOpen] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const deptRef = useRef<HTMLDivElement>(null);
  const allCatsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setDeptDropdownOpen(false);
      }
      if (allCatsRef.current && !allCatsRef.current.contains(event.target as Node)) {
        setAllCatsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAutocomplete(false);
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
    setAllCatsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const filteredSuggestions = searchQuery.length >= 1
    ? AUTOCOMPLETE_SUGGESTIONS.filter(s => s.includes(searchQuery.toLowerCase()))
    : AUTOCOMPLETE_SUGGESTIONS;

  const formattedCartTotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <header className="relative bg-white text-slate-800">
      {/* ======================================================================
          TOPBAR DE UTILIDADES
          ====================================================================== */}
      <div className="bg-white border-b border-[#E2E8F0] text-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 h-9 flex items-center justify-between gap-4">
          {/* Localização */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('catalogo')}
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#041B38] transition-colors cursor-pointer shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              Entregar em:{' '}
              <strong className="text-[#041B38]">São Paulo – SP (01310-100)</strong>
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Badge PJ Faturado + Info */}
          <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
            <span className="shrink-0 bg-[#16A34A] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              PJ FATURADO
            </span>
            <span className="text-slate-500 text-[11px] truncate">
              Boleto faturado em até 48h • Frete grátis Grande SP acima de R$ 350
            </span>
          </div>

          {/* Contatos */}
          <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-500">
            <span>
              Central B2B:{' '}
              <a href="tel:1132900000" className="font-bold text-[#041B38] hover:text-[#0F668E]">
                (11) 3290-0000
              </a>
            </span>
            <span className="text-slate-300">·</span>
            <a href="#" className="hover:text-[#0F668E] transition-colors">
              Central de Ajuda
            </a>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('cotacao-b2b')}
              className="font-bold text-[#0F668E] hover:underline cursor-pointer"
            >
              Televendas B2B
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================
          HEADER PRINCIPAL
          ====================================================================== */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-3 pb-3 md:pb-9">
        <div className="flex items-center gap-4 lg:gap-6">

          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <img
              src="/assets/logo-lothus-header.png"
              alt="Lothus Descartáveis"
              className="h-11 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-[20px] tracking-wide text-[#041B38]">
                LOTHUS
              </span>
              <span className="text-[9px] font-semibold text-[#585858] tracking-wider uppercase">
                DESCARTÁVEIS & SUPRIMENTOS
              </span>
            </div>
          </button>

          {/* Barra de Busca com Departamentos */}
          <div ref={searchRef} className="hidden md:flex flex-1 relative">
            <form
              onSubmit={handleSearch}
              className="flex w-full h-11 bg-white border border-slate-300 rounded-lg shadow-xs overflow-visible items-center focus-within:border-[#0F668E] focus-within:ring-2 focus-within:ring-[#0F668E]/15 transition-all"
            >
              {/* Seletor de Departamento */}
              <div ref={deptRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setDeptDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1.5 h-11 px-3 border-r border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer rounded-l-lg whitespace-nowrap"
                >
                  <span>Todos Deptos</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${deptDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {deptDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                    {DEPARTMENTS.map((dept) => {
                      const isSelected = selectedDept.slug === dept.slug;
                      return (
                        <button
                          key={dept.slug}
                          type="button"
                          onClick={() => {
                            setSelectedDept(dept);
                            setDeptDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-[#1863DC] font-bold'
                              : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#041B38]'
                          }`}
                        >
                          <span>{dept.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#1863DC]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Input de Busca */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
                placeholder="Buscar produtos, marcas, copos, luvas..."
                className="flex-1 h-full px-3 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none font-normal"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setShowAutocomplete(false); }}
                  className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Botão Sugestões (antes do buscar) */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-1 px-3 h-full border-l border-slate-200 text-[11px] font-semibold text-[#0F668E] hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                onClick={() => setShowAutocomplete(!showAutocomplete)}
              >
                + SUGESTÕES
              </button>

              <button
                type="submit"
                aria-label="Buscar produtos"
                className="flex items-center gap-2 h-11 px-5 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold text-sm rounded-r-lg shrink-0 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Buscar</span>
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showAutocomplete && (
              <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden">
                {filteredSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowAutocomplete(false);
                      onNavigate && onNavigate('catalogo');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {searchQuery ? (() => {
                        const matchIdx = suggestion.toLowerCase().indexOf(searchQuery.toLowerCase());
                        if (matchIdx === -1) return suggestion;
                        return (
                          <>
                            {suggestion.slice(0, matchIdx)}
                            <strong className="text-[#041B38]">{suggestion.slice(matchIdx, matchIdx + searchQuery.length)}</strong>
                            {suggestion.slice(matchIdx + searchQuery.length)}
                          </>
                        );
                      })() : suggestion}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Mais Buscados */}
            <div className="absolute left-0 -bottom-7 flex items-center gap-2 text-[11px] text-slate-500 whitespace-nowrap">
              <span className="font-semibold text-slate-400">Mais buscados:</span>
              {POPULAR_SEARCHES.map((term, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setSearchQuery(term); onNavigate && onNavigate('catalogo'); }}
                  className="text-slate-600 hover:text-[#0F668E] hover:underline transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Ações do Usuário (direita) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Rastreio & Meus Pedidos */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('pedidos')}
              className="flex flex-col items-center text-center cursor-pointer text-slate-600 hover:text-[#0F668E] transition-colors"
            >
              <span className="text-[10px] text-slate-400 font-normal leading-none">Rastreio & Notas</span>
              <span className="text-[12px] font-bold text-[#041B38] leading-tight">Meus Pedidos</span>
            </button>

            {/* Minha Conta */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('perfil')}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-3 py-1.5 transition-colors cursor-pointer group shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-[#0F668E] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  {(user.nomeFantasia || user.buyerName || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-bold text-[#041B38] group-hover:text-[#0F668E] truncate max-w-[100px]">
                    {user.nomeFantasia || user.buyerName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Minha Conta</span>
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('login')}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-3 py-1.5 transition-colors cursor-pointer group shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-[#0F668E] text-white flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </span>
                <span className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-bold text-[#041B38] group-hover:text-[#0F668E]">
                    Grupo Paulista
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                    Minha Conta <ChevronDown className="w-2.5 h-2.5" />
                  </span>
                </span>
              </button>
            )}

            {/* Carrinho */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir carrinho"
              className="flex items-center gap-2 bg-[#0F668E] hover:bg-[#0B4F6E] text-white rounded-lg pl-2.5 pr-3.5 py-2 transition-colors cursor-pointer shadow-xs"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FB8C00] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-normal text-white/80 uppercase tracking-wider">
                  MEU CARRINHO
                </span>
                <span className="text-[13px] font-bold leading-tight">
                  {totalItems > 0 ? formattedCartTotal : 'R$ 0,00'}
                </span>
              </div>
            </button>
          </div>

          {/* Ações Mobile */}
          <div className="flex md:hidden items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir carrinho"
              className="relative p-2 text-[#041B38] hover:text-[#0F668E] cursor-pointer"
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
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Menu"
              className="p-2 text-[#041B38] hover:text-[#0F668E] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Busca Mobile */}
        <form
          onSubmit={handleSearch}
          className="mt-2.5 flex md:hidden w-full h-10 bg-white border border-slate-300 rounded-lg overflow-hidden items-center focus-within:border-[#0F668E]"
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
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 pb-2">
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
                className="text-[#041B38] hover:text-[#0F668E] cursor-pointer"
              >
                {isAuthenticated && user ? `Conta: ${user.nomeFantasia}` : 'Entrar / Cadastrar Empresa'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate && onNavigate('cotacao-b2b');
                  setMobileMenuOpen(false);
                }}
                className="text-[#0F668E] cursor-pointer"
              >
                Cotação Rápida B2B
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================
          NAVBAR DE CATEGORIAS
          ====================================================================== */}
      <nav className="border-t border-[#E2E8F0] bg-white text-xs font-semibold">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 h-11 flex items-center justify-between gap-4">
          {/* Todas as Categorias (dropdown hamburger) */}
          <div ref={allCatsRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setAllCatsDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 h-8 px-3.5 bg-[#041B38] hover:bg-[#0F668E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>Todas as Categorias</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${allCatsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {allCatsDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = activeCategory === dept.slug;
                  return (
                    <button
                      key={dept.slug}
                      type="button"
                      onClick={() => handleCategoryClick(dept.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#1863DC] font-bold'
                          : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#041B38]'
                      }`}
                    >
                      <span>{dept.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1863DC]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Links de categorias */}
          <div className="hidden md:flex items-center gap-5 overflow-x-auto scrollbar-none flex-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`whitespace-nowrap text-[12px] transition-colors cursor-pointer font-semibold ${
                    isActive
                      ? 'text-[#0F668E]'
                      : 'text-slate-700 hover:text-[#0F668E]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* CTAs da direita */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('catalogo')}
              className="flex items-center gap-1.5 text-[11px] font-bold text-[#FB8C00] hover:text-amber-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="text-[#FB8C00]">⚡</span>
              <span>Ofertas de Atacado</span>
              <span className="bg-[#FB8C00] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                ATÉ -35%
              </span>
            </button>

            <span className="text-slate-200">|</span>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('cotacao-b2b')}
              className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F668E] hover:text-[#0B4F6E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>📋</span>
              <span>Cotação Rápida B2B</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
