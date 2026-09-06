import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Skull } from 'lucide-react';
import { PixelCrate, PixelBook } from './PixelIcon';

interface StartViewProps {
  totalDefeats: number;
  onStartNewGame: () => void;
  onOpenManual: () => void;
}

export const StartView: React.FC<StartViewProps> = ({
  totalDefeats,
  onStartNewGame,
  onOpenManual
}) => {
  return (
    <motion.div 
      key="state-start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-lg w-full mx-auto my-auto bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col items-center justify-center text-center gap-6"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs">
          <PixelCrate size={48} className="text-amber-700" />
        </div>
        {totalDefeats > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
            <Skull size={16} className="text-amber-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Fallimenti Carriera: {totalDefeats}
            </span>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-stone-900 leading-tight mb-2">
          Il Mercante di <span className="text-amber-700 underline decoration-amber-500/40 decoration-4 underline-offset-6">Oakhaven</span>
        </h1>
        <p className="text-base text-stone-600 max-w-sm mx-auto font-medium">
          Carica le merci, affronta le intemperie e scala i ranghi della gilda commerciale.
        </p>
      </div>
      <div className="w-full flex flex-col gap-3">
        <button 
          onClick={onStartNewGame}
          className="w-full py-4 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Inizia Carriera</span>
          <ChevronRight size={20} />
        </button>
        <button
          onClick={onOpenManual}
          className="w-full py-3 px-8 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <PixelBook size={18} />
          Manuale di Gioco
        </button>
      </div>
    </motion.div>
  );
};
export default StartView;
