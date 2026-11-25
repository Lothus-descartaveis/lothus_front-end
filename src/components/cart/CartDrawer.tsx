import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, MessageCircle, ShoppingCart } from '../ui/Icon';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigate?: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    pixTotal,
    savingsTotal,
    isDrawerOpen,
    setIsDrawerOpen
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsDrawerOpen(false);
    if (onNavigate) {
      onNavigate('checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-[#041B38]">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-[#041B38]" />
              <span className="font-display font-extrabold text-base text-[#041B38]">
                Carrinho
              </span>
              <span className="bg-[#FB8C00] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Fechar carrinho"
              className="p-1.5 text-slate-400 hover:text-[#041B38] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <p className="font-display font-bold text-base text-slate-600 mb-1">
                  Seu carrinho está vazio
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Consulte os itens do catálogo e adicione os produtos desejados.
                </p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onNavigate && onNavigate('catalogo');
                  }}
                  className="px-4 py-2 bg-[#1863DC] text-white text-xs font-bold rounded-lg"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-xs text-[#041B38] line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
                          title="Remover do carrinho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        SKU: {item.product.sku}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantidade */}
                      <div className="flex items-center border border-[#CBD5E1] rounded-md overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold font-mono text-[#041B38]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal do Item */}
                      <div className="text-right">
                        <span className="font-display font-extrabold text-sm text-[#041B38]">
                          {(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com Resumo Financeiro & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E2E8F0] bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#041B38]">
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                {savingsTotal > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-medium">
                    <span>Economia Total Atacado:</span>
                    <span>- {savingsTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#041B38] pt-2 border-t border-slate-200">
                  <span>Total no Pix (-5%):</span>
                  <span className="font-display font-black text-lg text-[#16A34A]">
                    {pixTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Ou em até 6x no Cartão / Boleto PJ 28dd:</span>
                  <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-[#1863DC] hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Finalizar Pedido Corporativo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/5511977663741?text=Ol%C3%A1%2C%20gostaria%20de%20fechar%20meu%20pedido%20da%20Lothus%20no%20valor%20de%20${encodeURIComponent(pixTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}%20contendo%20${totalItems}%20itens.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white border border-emerald-300 text-[#16A34A] hover:bg-emerald-50 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar via WhatsApp B2B</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
