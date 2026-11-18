import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  User,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Check,
  Package,
  Zap,
  ArrowLeft,
  ShieldCheck,
} from '../ui/Icon';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  onOpenQuickQuote?: () => void;
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
  variant?: 'default' | 'simple';
}

const CATEGORIES = [
  { name: 'Limpeza e Higiene', slug: 'limpeza-e-higiene' },
  { name: 'Food Service', slug: 'food-service-e-descartaveis' },
  { name: 'Escritório e Papelaria', slug: 'escritorio-e-papelaria' },
  { name: 'Equipamentos', slug: 'equipamentos-de-limpeza' },
  { name: 'Artesanato', slug: 'artesanato-tecidos-festas' },
];

const POPULAR_SEARCHES = [
  'Copos 200ml',
  'Luvas Nitrílicas',
  'Papel Toalha',
  'Sacos 100L',
  'Químicos de Limpeza',
  'Descartáveis Food Service',
];

const AUTOCOMPLETE_SUGGESTIONS = [
  'copos descartáveis 200ml atacado',
  'copo descartável 180ml café',
  'copo térmico isopor 180ml',
  'luvas nitrílicas descartáveis sem pó',
  'papel toalha interfolha 2 dobras 100% celulose',
  'saco de lixo reforçado 100 litros pacote com 100',
  'cera acrílica auto-brilho 5 litros shinefloor',
  'sabonete líquido antibacteriano 5 litros',
  'canudos de papel biodegradáveis',
  'pratos descartáveis 15cm kerocopo',
];

// =========================================================================
// HEADER SIMPLIFICADO (PADRÃO CHECKOUT & DOCUMENTOS INFORMATIVOS)
// Componente independente para evitar violação de regras de hooks do React
// =========================================================================
export const SimpleHeader: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between">
        {/* Logo Oficial Lothus */}
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-3 select-none text-left cursor-pointer group"
        >
          <img
            src="/assets/logo-lothus-header.png"
            alt="Lothus Descartáveis & Suprimentos"
            className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-wide text-[#041B38] leading-tight">
              LOTHUS
            </span>
            <span className="text-[10px] font-semibold text-[#585858] tracking-wider leading-none uppercase">
              DESCARTÁVEIS & SUPRIMENTOS
            </span>
          </div>
        </button>

        {/* Lado Direito: Voltar para a Loja & Selo Corporativo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0F668E] bg-slate-50 hover:bg-[#F0F7FA] border border-slate-200 hover:border-[#DCEEF5] transition-colors cursor-pointer py-2 px-3.5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Voltar para a Loja</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium pl-4 border-l border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Ambiente Seguro SSL</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeCategory,
  onSelectCategory,
}) => {
  const { totalItems, subtotal, setIsDrawerOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (onNavigate) {
      onNavigate('catalogo');
    }
  };

  const handleSelectSearchTerm = (term: string) => {
    setSearchQuery(term);
    setShowSearchDropdown(false);
    if (onNavigate) {
      onNavigate('catalogo');
    }
  };

  const filteredSuggestions = searchQuery.trim().length >= 1
    ? AUTOCOMPLETE_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else if (onNavigate) {
      onNavigate('catalogo');
    }
    setMobileMenuOpen(false);
  };

  const formattedCartTotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <header className="relative bg-white border-b border-[#E2E8F0] text-slate-800">
      {/* ======================================================================
          TOPBAR DE UTILIDADES (AZUL SUAVE)
          ====================================================================== */}
      <div className="bg-[#F0F7FA] border-b border-[#DCEEF5] text-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 h-9 flex items-center justify-between gap-4">
          {/* Localização */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('catalogo')}
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#0F668E] transition-colors cursor-pointer shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0F668E] shrink-0" />
            <span>
              Localizado em:{' '}
              <strong className="text-[#041B38] font-bold">São Paulo – SP (01310-100)</strong>
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Info de Faturamento e Frete (Links Diretos para os Documentos) */}
          <div className="hidden md:flex items-center gap-2 flex-1 min-w-0 text-[11px]">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('faturamento-pj')}
              className="text-slate-600 hover:text-[#0F668E] font-medium transition-colors cursor-pointer truncate"
            >
              Boleto faturado em até 48h
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('entrega-frete')}
              className="text-slate-600 hover:text-[#0F668E] font-medium transition-colors cursor-pointer truncate"
            >
              Frete grátis Grande SP acima de R$ 350
            </button>
          </div>

          {/* Contatos */}
          <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-600">
            <span>
              Central B2B:{' '}
              <a href="tel:1132900000" className="font-bold text-[#041B38] hover:text-[#0F668E]">
                (11) 3290-0000
              </a>
            </span>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('faq')}
              className="hover:text-[#0F668E] transition-colors cursor-pointer"
            >
              Central de Ajuda
            </button>
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
          HEADER PRINCIPAL (LINHA 1 + LINHA 2)
          ====================================================================== */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-3.5 pb-3">
        {/* LINHA 1: Logo Oficial | Barra de Busca Ampla | Minha Conta */}
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* 1. Logo Oficial Lothus */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none text-left"
          >
            <img
              src="/assets/logo-lothus-header.png"
              alt="Lothus Descartáveis & Suprimentos"
              className="h-11 sm:h-12 w-auto object-contain"
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

          {/* 2. Barra de Busca com Dropdown de Mais Buscados */}
          <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-[680px]">
            <form
              onSubmit={handleSearch}
              className="flex w-full h-11 bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden items-center focus-within:border-[#0F668E] focus-within:ring-2 focus-within:ring-[#0F668E]/15 transition-all"
            >
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onClick={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder="Buscar produtos, marcas, copos, luvas..."
                className="flex-1 h-full px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                  className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Buscar produtos"
                className="h-full px-6 bg-[#0F668E] hover:bg-[#0B4F6E] text-white flex items-center justify-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Buscar</span>
              </button>
            </form>

            {/* Dropdown ao focar na busca: Mais buscados & Sugestões */}
            {showSearchDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {searchQuery.trim().length > 0 && filteredSuggestions.length > 0 && (
                  <div className="mb-3 pb-2.5 border-b border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>Sugestões para "{searchQuery}"</span>
                    </div>
                    <div className="space-y-0.5">
                      {filteredSuggestions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleSelectSearchTerm(item)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0F668E] text-left transition-colors cursor-pointer group"
                        >
                          <span className="truncate">{item}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#0F668E]">Buscar &rarr;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção Mais Buscados */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#FB8C00]" />
                    <span>Mais buscados</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectSearchTerm(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#0F668E] hover:text-white text-slate-700 text-xs font-medium rounded-full transition-colors cursor-pointer group"
                      >
                        <Search className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
                        {/* 3. Minha Conta & Carrinho (Lado direito da Linha 1) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('perfil')}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-3.5 py-1.5 transition-colors cursor-pointer group shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-[#0F668E] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  {(user.nomeFantasia || user.buyerName || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-bold text-[#041B38] group-hover:text-[#0F668E] truncate max-w-[120px]">
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
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-3.5 py-1.5 transition-colors cursor-pointer group shadow-2xs"
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

            {/* Carrinho em estilo Pill idêntico ao perfil */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir carrinho"
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full pl-1.5 pr-3.5 py-1.5 transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="relative">
                <span className="w-7 h-7 rounded-full bg-[#0F668E] group-hover:bg-[#0B4F6E] text-white flex items-center justify-center shrink-0 transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FB8C00] text-white text-[9px] font-extrabold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-bold text-[#041B38] group-hover:text-[#0F668E] transition-colors">
                  Meu Carrinho
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
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

        {/* Busca Mobile com Dropdown */}
        <div className="relative md:hidden mt-2.5">
          <form
            onSubmit={handleSearch}
            className="flex w-full h-10 bg-white border border-slate-300 rounded-lg overflow-hidden items-center focus-within:border-[#0F668E]"
          >
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder="Buscar produtos, marcas e muito mais..."
              className="flex-1 h-full px-3.5 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none border-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar busca"
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Buscar produtos"
              className="w-12 h-full bg-[#0F668E] hover:bg-[#0B4F6E] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 z-50">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FB8C00]" />
                <span>Mais buscados</span>
              </div>
              <div className="flex flex-wrap gap-1 px-1">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectSearchTerm(term)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-[#0F668E] hover:text-white text-slate-700 text-xs font-medium rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LINHA 2 (PARTE DE BAIXO DO HEADER): Localização | Departamentos | Pedidos & Carrinho */}
        <div className="hidden md:flex items-center justify-between gap-4 pt-3.5 mt-2">
          {/* Localização / Entrega */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('catalogo')}
            className="flex items-center gap-1.5 text-left text-slate-600 hover:text-[#0F668E] transition-colors shrink-0 cursor-pointer"
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
          <nav className="flex items-center gap-6">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`whitespace-nowrap text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0F668E] font-semibold'
                      : 'text-slate-600 hover:text-[#0F668E]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Ações da Direita na Linha 2 */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('pedidos')}
              className="group flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-[#0F668E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Package className="w-4 h-4 text-[#0F668E] group-hover:text-[#0B4F6E] transition-colors shrink-0" />
              <span>Meus Pedidos</span>
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
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
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
                  onNavigate && onNavigate('pedidos');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-600 hover:text-[#0F668E] cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#0F668E] shrink-0" />
                <span>Meus Pedidos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
