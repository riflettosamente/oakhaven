import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Landmark, X } from 'lucide-react';
import { 
  PixelQuest, 
  PixelStore, 
  PixelBlacksmith, 
  PixelTavern, 
  PixelGuild, 
  PixelBook, 
  PixelCrate, 
  PixelCoins 
} from './PixelIcon';
import { Quest, PlayerState, GameState } from '../types';

interface BoardViewProps {
  player: PlayerState;
  questOptions: Quest[];
  currentTip: string;
  onNavigate: (state: GameState) => void;
  onOpenDeparture: (quest: Quest) => void;
  onOpenDepartureDirect: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  player,
  questOptions,
  currentTip,
  onNavigate,
  onOpenDeparture,
  onOpenDepartureDirect
}) => {
  return (
    <motion.div 
      key="state-board"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl w-full mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-6">
        <div>
          <h2 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <PixelQuest size={16} className="text-amber-600" /> Sede di {player.currentLocation}
          </h2>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-stone-900">
            Bacheca degli Incarichi
          </h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => onNavigate('EMPORIO')} 
            className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-amber-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Emporio</span>
            <PixelStore size={20} className="text-amber-600" />
          </button>
          <button 
            onClick={() => onNavigate('BLACKSMITH')} 
            className="px-4 py-2.5 bg-white hover:bg-sky-50 text-stone-800 hover:text-sky-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-sky-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Fabbro</span>
            <PixelBlacksmith size={20} className="text-sky-600" />
          </button>
          <button 
            onClick={() => onNavigate('TAVERN')} 
            className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-amber-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Taverna</span>
            <PixelTavern size={20} className="text-amber-700" />
          </button>
          <button 
            onClick={() => onNavigate('GUILD')} 
            className="px-4 py-2.5 bg-white hover:bg-indigo-50 text-stone-800 hover:text-indigo-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-indigo-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Gilda</span>
            <PixelGuild size={20} className="text-indigo-600" />
          </button>
          <button 
            onClick={() => onNavigate('JOURNAL')} 
            className="px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Diario</span>
            <PixelBook size={20} className="text-stone-700" />
          </button>
          <button 
            onClick={onOpenDepartureDirect} 
            className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-amber-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Porte della Città</span>
            <Landmark size={20} className="text-amber-700" />
          </button>
          <button 
            onClick={() => onNavigate('START')} 
            className="px-4 py-2.5 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-rose-200 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <span className="text-[10px] text-stone-500">Esci</span>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {questOptions.map((q, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Top badges: Tipo e Tappe */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  q.type === 'Breve' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : q.type === 'Media' 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {q.type}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full border border-stone-200">
                  {q.length} Tappe
                </span>
              </div>

              {/* Destination */}
              <div className="text-center py-2 mb-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Consegna a</p>
                <h3 className="text-2xl font-black text-stone-900 group-hover:text-amber-700 transition-colors mt-0.5 leading-tight">
                  {q.destination}
                </h3>
              </div>

              {/* 3 Metric cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Merci</span>
                  <div className="flex items-center gap-1 text-stone-900 font-black text-lg">
                    <PixelCrate size={16} className="text-amber-600" />
                    <span>{q.goods}</span>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Molt.</span>
                  <div className="flex items-center justify-center text-stone-900 font-black text-lg">
                    <span>x{q.goldMultiplier}</span>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Oro</span>
                  <div className="flex items-center gap-1 text-amber-900 font-black text-lg">
                    <PixelCoins size={16} />
                    <span>{(q.goods * 10) * q.goldMultiplier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Button */}
            <button 
              onClick={() => onOpenDeparture(q)}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-xs uppercase tracking-wider cursor-pointer text-center leading-snug"
            >
              <span>Accetta incarico e vai alle porte della città</span>
              <ChevronRight size={18} className="shrink-0" />
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-stone-500 font-medium italic text-center py-2">
        Suggerimento: {currentTip}
      </p>
    </motion.div>
  );
};
export default BoardView;
