import React from 'react';
import { motion } from 'motion/react';
import { Wrench, Lock, ChevronRight } from 'lucide-react';
import { PixelCoins } from './PixelIcon';
import { PlayerState, GameState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../gameMechanics';

interface BlacksmithViewProps {
  player: PlayerState;
  onNavigate: (state: GameState) => void;
  buyUpgrade: (item: ShopItem) => void;
  sellUpgrade: (item: ShopItem) => void;
}

export const BlacksmithView: React.FC<BlacksmithViewProps> = ({
  player,
  onNavigate,
  buyUpgrade,
  sellUpgrade
}) => {
  return (
    <motion.div 
      key="state-blacksmith"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
            <Wrench size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">Il Fabbro di {player.currentLocation}</h1>
            <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">Miglioramenti strutturali e rinforzi per il carretto</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('BOARD')} 
          className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-95 border border-stone-300 cursor-pointer"
        >
          Torna alla Bacheca
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_ITEMS.filter(item => item.type === 'upgrade' && item.id !== 'lantern').map((item) => {
            const isPurchased = player.upgrades.includes(item.id);
            const Icon = item.icon;

            let isLocked = false;
            let requirementText = "";
            
            if (item.id === 'iron_plates' && !player.upgrades.includes('wood_ref')) {
              isLocked = true;
              requirementText = "Richiede Rinforzi in Legno";
            }
            if (item.id === 'steel_frame' && !player.upgrades.includes('iron_plates')) {
              isLocked = true;
              requirementText = "Richiede Piastre in Ferro";
            }

            const cannotSell = (item.id === 'wood_ref' && player.upgrades.includes('iron_plates')) ||
                              (item.id === 'iron_plates' && player.upgrades.includes('steel_frame'));

            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 bg-white shadow-sm ${
                  isPurchased ? 'border-blue-200 bg-blue-50/20' : isLocked ? 'border-stone-200 opacity-60' : 'border-stone-200 hover:border-blue-300'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`shrink-0 p-3 rounded-xl border ${
                    isPurchased 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : isLocked
                        ? 'bg-stone-100 border-stone-200 text-stone-400'
                        : 'bg-blue-50/50 border-blue-100 text-blue-600'
                  }`}>
                    {isLocked ? <Lock size={22} /> : <Icon size={22} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-bold text-stone-900 uppercase text-xs tracking-tight truncate">{item.name}</h4>
                      {isPurchased && (
                        <span className="shrink-0 text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Installato</span>
                      )}
                      {isLocked && (
                        <span className="shrink-0 text-[9px] bg-stone-100 text-stone-500 border border-stone-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Bloccato</span>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-stone-500 font-medium leading-tight">
                      {isLocked ? (
                        <span className="flex flex-col gap-0.5">
                          <span className="text-red-600 font-bold">{requirementText}</span>
                          <span className="opacity-75 italic">{item.effect}</span>
                        </span>
                      ) : item.effect}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs tabular-nums">
                      <PixelCoins size={14} /> {item.cost} Oro
                    </div>
                    {!isPurchased && !isLocked && (
                      <ChevronRight size={16} className="text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!isPurchased ? (
                      <button 
                        disabled={player.gold < item.cost || isLocked}
                        onClick={() => buyUpgrade(item as ShopItem)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold uppercase text-[10px] rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        Compra
                      </button>
                    ) : (
                      <button 
                        disabled={cannotSell}
                        onClick={() => sellUpgrade(item as ShopItem)}
                        className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 disabled:opacity-40 font-bold uppercase text-[10px] rounded-lg transition-all cursor-pointer"
                      >
                        {cannotSell ? 'In uso' : 'Vendi'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
export default BlacksmithView;
