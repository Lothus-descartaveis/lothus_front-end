import React from 'react';
import { Layers, CheckCircle2 } from '../ui/Icon';
import { KIT_COMBOS } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

export const KitsB2B: React.FC = () => {
  const { addItem } = useCart();

  const handleAddCombo = (combo: typeof KIT_COMBOS[0]) => {
    const comboProduct: Product = {
      id: combo.id,
      name: combo.title,
      category: 'Kits & Combos B2B',
      categorySlug: 'kits-combos-b2b',
      price: combo.currentPrice,
      originalPrice: combo.originalPrice,
      discountPixPercent: 10,
      installmentsMax: 3,
      image: combo.image,
      badge: 'Combo B2B',
      rating: 5.0,
      reviewsCount: 24,
      sku: `COMBO-${combo.id.toUpperCase()}`,
      brand: 'Lothus Soluções',
      unit: 'Combo'
    };
    addItem(comboProduct, 1);
  };

  return (
    <section className="bg-slate-50/80 py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-center gap-2.5 mb-8">
          <Layers className="w-5 h-5 text-[#FB8C00]" />
          <div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#041B38]">
              A combinação perfeita para sua empresa: Kits & Combos B2B
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Packs prontos para operação com desconto cumulativo e frete consolidado em nota única
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {KIT_COMBOS.map((combo) => {
            const pixPrice = combo.currentPrice * 0.9;

            return (
              <div
                key={combo.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-card hover:border-slate-300 transition-all duration-200"
              >
                {/* Imagem do Combo à esquerda */}
                <div className="w-full sm:w-48 h-48 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center p-3 shrink-0 overflow-hidden">
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Detalhes à direita */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-amber-50 text-[#FB8C00] border border-amber-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide mb-2">
                      {combo.badge}
                    </span>
                    <h3 className="font-display font-bold text-sm text-[#041B38] leading-snug mb-2">
                      {combo.title}
                    </h3>
                    <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                      {combo.description}
                    </p>

                    {/* Itens Inclusos */}
                    <div className="space-y-1 mb-4">
                      {combo.itemsIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preço e Botão */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 line-through block">
                        De {combo.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display font-black text-lg text-[#041B38]">
                          {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-[10px] font-bold text-[#16A34A]">
                          no Pix (-10%)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="px-4 py-2 bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer h-[38px] flex items-center justify-center"
                    >
                      Adicionar Combo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
