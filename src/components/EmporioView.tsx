import React from 'react';
import { motion } from 'motion/react';
import { PixelStore, PixelCrate, PixelCoins } from './PixelIcon';
import { PlayerState, GameState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../gameMechanics';

interface EmporioViewProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate?: (state: GameState) => void;
  buyUpgrade: (item: ShopItem) => void;
  sellUpgrade: (item: ShopItem) => void;
}

export const EmporioView: React.FC<EmporioViewProps> = ({
  player,
  setPlayer,
  buyUpgrade,
  sellUpgrade
}) => {
  return (
    <motion.div 
      key="state-emporio"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm">
            <PixelStore size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">Emporio di {player.currentLocation}</h1>
            <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">Forniture per carovane e beni consumabili</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 text-amber-600">
              <PixelCrate size={20} />
            </div>
            <h2 className="text-lg font-bold uppercase text-stone-900 tracking-tight">Merci e Scorte</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-amber-600 tracking-wider mb-0.5 block">Carico Mercati</span>
                    <h3 className="text-lg font-bold uppercase text-stone-900">Carico Commerciale</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                    <PixelCrate size={26} />
                  </div>
                </div>
                
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[11px] text-stone-400 font-semibold uppercase mb-0.5">Scorte Carico</p>
                      <p className="text-2xl font-bold text-stone-900 tabular-nums">{player.goods} <span className="text-xs font-medium text-stone-400">/ {player.capacity}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-stone-400 font-semibold uppercase mb-0.5">Prezzo Unitario</p>
                      <div className="text-lg font-bold text-amber-600 tabular-nums inline-flex items-center gap-1">
                        <PixelCoins size={18} /> 10 Oro
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { if(player.goods > 0) setPlayer(p => ({ ...p, gold: p.gold + 10, goods: p.goods - 1 })); }}
                      className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-xs text-stone-700 transition-all border border-stone-300 cursor-pointer"
                    >
                      VENDI
                    </button>
                    <button 
                      disabled={player.goods >= player.capacity || player.gold < 10}
                      onClick={() => { setPlayer(p => ({ ...p, gold: p.gold - 10, goods: p.goods + 1 })); }}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 rounded-xl font-bold text-xs text-white transition-all shadow-sm cursor-pointer"
                    >
                      COMPRA
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-500 font-medium italic text-center">
                Essenziale per completare gli incarichi della bacheca e ricevere premi in oro e reputazione.
              </p>
            </div>

            <div className="space-y-3">
              {SHOP_ITEMS.filter(item => ['repair_kit', 'oil', 'lantern'].includes(item.id)).map((item) => {
                const isMaxOil = item.id === 'oil' && player.consumables.lanternOil >= 3;
                const isPurchasedUpgrade = item.type === 'upgrade' && player.upgrades.includes(item.id);
                const Icon = item.icon;

                return (
                  <div 
                    key={item.id}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 bg-white ${
                      isPurchasedUpgrade || isMaxOil
                        ? 'border-stone-200 opacity-75' 
                        : 'border-stone-200 hover:border-amber-400 shadow-sm'
                    }`}
                  >
                    <div className={`p-3 rounded-xl border ${isPurchasedUpgrade ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="font-bold text-stone-900 uppercase text-xs tracking-tight">{item.name}</h4>
                        {isPurchasedUpgrade && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">POSSEDUTO</span>}
                        {isMaxOil && <span className="text-[9px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold uppercase">Scorta Piena</span>}
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium leading-tight line-clamp-2">{item.effect}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-amber-600 font-bold text-xs tabular-nums">
                          <PixelCoins size={14} /> {item.cost} Oro
                        </div>
                        
                        <div className="flex gap-1.5 text-xs">
                          <button 
                            disabled={player.gold < item.cost || isMaxOil || (item.type === 'upgrade' && isPurchasedUpgrade)}
                            onClick={() => buyUpgrade(item as ShopItem)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold uppercase text-[10px] rounded-lg transition-all shadow-sm whitespace-nowrap cursor-pointer"
                          >
                            Compra
                          </button>
                          <button 
                            disabled={
                              (item.id === 'repair_kit' && player.consumables.repairKits <= 0) || 
                              (item.id === 'oil' && player.consumables.lanternOil <= 0) ||
                              (item.type === 'upgrade' && !isPurchasedUpgrade)
                            }
                            onClick={() => sellUpgrade(item as ShopItem)}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 font-bold uppercase text-[10px] rounded-lg transition-all border border-stone-300 whitespace-nowrap cursor-pointer"
                          >
                            Vendi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
export default EmporioView;
