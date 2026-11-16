import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  pixTotal: number;
  savingsTotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lothus_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial mock cart (representing the 3 items active in Paper prototype)
    return [
      {
        product: {
          id: 'balde-doblo-30l',
          name: 'Balde com Espremedor Doblô 30 Litros Bralimpia Completo',
          category: 'Equipamentos de Limpeza',
          categorySlug: 'equipamentos-de-limpeza',
          price: 349.90,
          originalPrice: 429.90,
          discountPixPercent: 10,
          installmentsMax: 3,
          image: '/assets_site_atual/carrinho.jpg',
          badge: 'Envio Rápido',
          rating: 4.9,
          reviewsCount: 38,
          sku: 'BRA-DOB30L',
          brand: 'Bralimpia',
          unit: 'Unidade'
        },
        quantity: 2
      },
      {
        product: {
          id: 'toalha-bobina-200m',
          name: 'Papel Toalha Bobina 200m 100% Celulose Virgem (Fardo c/ 6 Rolos)',
          category: 'Limpeza e Higiene',
          categorySlug: 'limpeza-e-higiene',
          price: 24.90,
          originalPrice: 32.50,
          discountPixPercent: 10,
          installmentsMax: 2,
          image: '/assets_site_atual/linha.jpg',
          badge: 'Mais Vendido',
          rating: 4.9,
          reviewsCount: 142,
          sku: 'TOA-BOB200',
          brand: 'Santher / Nobre',
          unit: 'Fardo 6x200m'
        },
        quantity: 5
      },
      {
        product: {
          id: 'quadro-branco-90x60',
          name: 'Quadro Branco Magnético 90x60cm Moldura Alumínio Stalo',
          category: 'Escritório e Papelaria',
          categorySlug: 'escritorio-e-papelaria',
          price: 76.90,
          originalPrice: 94.00,
          discountPixPercent: 10,
          installmentsMax: 3,
          image: '/assets_site_atual/Magnetico-60x40-1.jpg',
          badge: 'Linha Corporativa',
          rating: 4.8,
          reviewsCount: 64,
          sku: 'QUA-MAG9060',
          brand: 'Stalo',
          unit: 'Unidade'
        },
        quantity: 1
      }
    ];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('lothus_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pixTotal = subtotal * 0.95; // 5% de desconto no PIX
  const savingsTotal = items.reduce((sum, item) => {
    const orig = item.product.originalPrice || item.product.price;
    return sum + (orig - item.product.price) * item.quantity;
  }, 0) + (subtotal - pixTotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        pixTotal,
        savingsTotal,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
