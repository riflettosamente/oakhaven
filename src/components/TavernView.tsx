import React from 'react';
import { motion } from 'motion/react';
import { Smile } from 'lucide-react';
import { PixelTavern, PixelCoins } from './PixelIcon';
import { GameState } from '../types';

interface TavernViewProps {
  onRestAtTavern: () => void;
  onNavigate?: (state: GameState) => void;
}

export const TavernView: React.FC<TavernViewProps> = ({
  onRestAtTavern
}) => {
  return (
    <motion.div 
      key="state-tavern"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-4xl mx-auto py-4"
    >
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-56 bg-amber-50/70 border-b border-amber-100 relative flex items-center justify-center overflow-hidden">
          <div className="relative text-center z-10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
              <PixelTavern size={36} />
            </div>
            <div>
              <h2 className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">Punto di Ristoro</h2>
              <h1 className="text-2xl font-bold uppercase text-stone-900">La Taverna del Viandante</h1>
            </div>
          </div>
        </div>
        
        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <p className="text-sm font-medium leading-relaxed text-stone-600">
              Il focolare scoppietta allegramente mentre il profumo di stufato riempie la sala. 
              Un posto ideale per riposare prima della prossima tratta commerciale e attendere che arrivino nuove proposte di lavoro sulla bacheca.
            </p>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500">
                <span>Costo per Notte</span>
                <div className="flex items-center gap-1 text-amber-600 font-bold text-sm"><PixelCoins size={18} /> 2 Oro</div>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500">
                <span>Tempo Trascorso</span>
                <span className="text-xs text-stone-800 font-bold">1 Giorno</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500">
                <span>Beneficio</span>
                <span className="text-xs text-emerald-700 font-bold">Aggiorna Incarichi Bacheca</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <button 
              onClick={onRestAtTavern}
              className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Smile size={18} />
              Riposa e Passa un Giorno (-2 Oro)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default TavernView;
