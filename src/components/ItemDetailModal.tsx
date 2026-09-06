import React from 'react';
import { motion } from 'motion/react';
import { X, Shield, CheckCircle2, Lock } from 'lucide-react';
import { ItemDetail, PlayerState } from '../types';

interface ItemDetailModalProps {
  itemDetail: ItemDetail | null;
  onClose: () => void;
  player: PlayerState;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  itemDetail,
  onClose,
  player
}) => {
  if (!itemDetail) return null;

  const isBadge = itemDetail.category === 'badge';
  const isStat = itemDetail.category === 'stat';
  const isActive = isBadge 
    ? player.badges.includes(itemDetail.id) 
    : !isStat && player.upgrades.includes(itemDetail.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" 
        onClick={onClose} 
      />
      
      <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg cursor-pointer"
        >
          <X size={20} />
        </button>
        
        <div className="flex gap-5 items-start">
          <div className={`shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center ${
            itemDetail.category === 'badge' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 
            itemDetail.category === 'stat' ? 'bg-stone-100 border-stone-200 text-stone-700' :
            'bg-amber-50 border-amber-200 text-amber-600'
          }`}>
            {React.createElement(itemDetail.icon || Shield, { size: 28 })}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-stone-900 uppercase">
                {itemDetail.name}
              </h3>
              {!isStat && isActive && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
                  Attivo
                </span>
              )}
            </div>
            
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-3">
              {isBadge 
                ? (player.badges.includes(itemDetail.id) ? 'Badge Attivo' : 'Proprietà del Badge') 
                : isStat
                ? 'Statistica Giocatore'
                : (player.upgrades.includes(itemDetail.id) ? 'Modulo Installato' : 'Effetto Modulo')}
            </p>
            
            <p className="text-stone-600 text-xs leading-relaxed font-medium">
              "{itemDetail.description || itemDetail.effect}"
            </p>

            {!isStat && (
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-stone-100 text-xs font-bold uppercase">
                {isActive ? (
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 size={16} />
                    Questo componente è attualmente installato
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <Lock size={16} />
                    {isBadge 
                      ? 'Badge non ancora ottenuto' 
                      : 'Acquistabile presso il Fabbro'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ItemDetailModal;
