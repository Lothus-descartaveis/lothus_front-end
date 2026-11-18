import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { B2BQuickQuoteModal } from './components/b2b/B2BQuickQuoteModal';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { QuoteB2BPage } from './pages/QuoteB2BPage';
import { LoginRegisterPage } from './pages/LoginRegisterPage';
import { ProfilePage, ProfileTab } from './pages/ProfilePage';
import { InstitutionalPage, InstitutionalTab } from './pages/InstitutionalPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState<boolean>(false);
  const [profileInitialTab, setProfileInitialTab] = useState<ProfileTab>('visao-geral');
  const [institutionalInitialTab, setInstitutionalInitialTab] = useState<InstitutionalTab>('sobre');
  const [postAuthRedirect, setPostAuthRedirect] = useState<{
    page: string;
    tab?: ProfileTab;
  } | null>(null);

  const handleNavigate = (page: string) => {
    // Rotas de Conteúdo Institucional e Central do Cliente
    const institutionalTabs: Record<string, InstitutionalTab> = {
      'sobre': 'sobre',
      'loja': 'loja-fisica',
      'loja-fisica': 'loja-fisica',
      'blog': 'blog',
      'parceiros': 'parceiros',
      'faturamento': 'faturamento-pj',
      'faturamento-pj': 'faturamento-pj',
      'entrega': 'entrega-frete',
      'entrega-frete': 'entrega-frete',
      'devolucoes': 'trocas-devolucoes',
      'trocas-devolucoes': 'trocas-devolucoes',
      'faq': 'faq',
      'institucional': 'sobre',
    };

    if (institutionalTabs[page]) {
      setInstitutionalInitialTab(institutionalTabs[page]);
      setCurrentPage('institucional');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'pedidos') {
      if (isAuthenticated) {
        setProfileInitialTab('pedidos');
        setCurrentPage('perfil');
      } else {
        setPostAuthRedirect({ page: 'perfil', tab: 'pedidos' });
        setCurrentPage('login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'perfil') {
      setProfileInitialTab('visao-geral');
      setCurrentPage('perfil');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'login' || page === 'registro') {
      setPostAuthRedirect(null);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    if (postAuthRedirect) {
      if (postAuthRedirect.tab) {
        setProfileInitialTab(postAuthRedirect.tab);
      }
      setCurrentPage(postAuthRedirect.page);
      setPostAuthRedirect(null);
    } else {
      setProfileInitialTab('visao-geral');
      setCurrentPage('perfil');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage('catalogo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('produto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#1863DC] selection:text-white">
      {/* Header Oficial Lothus: Completo na loja, Simplificado nas páginas informativas (institucional) e Oculto no Checkout */}
      {currentPage !== 'checkout' && (
        <Header
          variant={currentPage === 'institucional' ? 'simple' : 'default'}
          onNavigate={handleNavigate}
          onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
          activeCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* Roteamento de Telas da Aplicação */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'catalogo' && (
          <CatalogPage
            initialCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'produto' && (
          <ProductPage
            product={selectedProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'cotacao-b2b' && (
          <QuoteB2BPage
            onNavigate={handleNavigate}
          />
        )}

        {(currentPage === 'login' || currentPage === 'registro') && (
          <LoginRegisterPage
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
            initialMode={currentPage === 'registro' ? 'register' : 'login'}
          />
        )}

        {currentPage === 'perfil' && (
          <ProfilePage
            onNavigate={handleNavigate}
            initialTab={profileInitialTab}
          />
        )}

        {currentPage === 'institucional' && (
          <InstitutionalPage
            initialTab={institutionalInitialTab}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Rodapé Oficial em Tema Claro (oculto no Checkout Focado para seguir o funil de alta conversão) */}
      {currentPage !== 'checkout' && <Footer onNavigate={handleNavigate} />}

      {/* Drawer do Carrinho Atacado */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Modal Rápido de Cotação B2B */}
      <B2BQuickQuoteModal
        isOpen={isQuickQuoteOpen}
        onClose={() => setIsQuickQuoteOpen(false)}
      />

      {/* Botão Flutuante de Atendimento B2B via WhatsApp */}
      <WhatsAppButton />
    </div>
  );
};

export const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
