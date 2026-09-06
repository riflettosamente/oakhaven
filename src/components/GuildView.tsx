import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Medal, ChevronRight } from 'lucide-react';
import { PixelGuild } from './PixelIcon';
import { PlayerState, GameState, Badge } from '../types';
import { BADGES } from '../gameMechanics';

interface GuildViewProps {
  player: PlayerState;
  onNavigate: (state: GameState) => void;
  buyBadge: (badge: Badge) => void;
}

export const GuildView: React.FC<GuildViewProps> = ({
  player,
  onNavigate,
  buyBadge
}) => {
  return (
    <motion.div 
      key="state-guild"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm">
            <PixelGuild size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">La Gilda dei Mercanti</h1>
            <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">Titoli onorifici e prestigio commerciale</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider leading-none mb-0.5">Fama Attuale</span>
            <span className="text-lg font-bold text-indigo-700 tabular-nums">{player.pr} <span className="text-xs font-semibold">PR</span></span>
          </div>
          <button 
            onClick={() => onNavigate('BOARD')} 
            className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-95 border border-stone-300 cursor-pointer"
          >
            Torna alla Bacheca
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reputation Table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-bold uppercase text-stone-900 tracking-tight">Parametri di Consegna (PR)</h2>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
            {[
              { type: 'Breve', high: 6, low: 12, prHigh: 10, prLow: 5, prLate: 0, titleHigh: 'Corriere Fulmineo', titleLow: 'Affidabile', titleLate: 'In Ritardo' },
              { type: 'Media', high: 10, low: 20, prHigh: 20, prLow: 10, prLate: 0, titleHigh: 'Mercante d\'Elite', titleLow: 'Professionista', titleLate: 'Inefficiente' },
              { type: 'Lunga', high: 16, low: 32, prHigh: 40, prLow: 20, prLate: 0, titleHigh: 'Leggenda delle Strade', titleLow: 'Viaggiatore Esperto', titleLate: 'Viandante Sperduto' },
            ].map((row) => (
              <div key={row.type} className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${row.type === 'Breve' ? 'bg-stone-400' : row.type === 'Media' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-bold uppercase text-stone-800 tracking-tight">{row.type} Tratta</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center bg-white border border-emerald-200 p-2.5 rounded-xl">
                    <p className="text-base font-bold text-emerald-600 tabular-nums">+{row.prHigh}</p>
                    <p className="text-[9px] text-stone-600 font-bold uppercase text-center mt-0.5">{row.titleHigh}</p>
                    <p className="text-[9px] text-stone-400 font-medium mt-0.5">≤ {row.high} GG</p>
                  </div>
                  <div className="flex flex-col items-center bg-white border border-indigo-200 p-2.5 rounded-xl">
                    <p className="text-base font-bold text-indigo-600 tabular-nums">+{row.prLow}</p>
                    <p className="text-[9px] text-stone-600 font-bold uppercase text-center mt-0.5">{row.titleLow}</p>
                    <p className="text-[9px] text-stone-400 font-medium mt-0.5">≤ {row.low} GG</p>
                  </div>
                  <div className="flex flex-col items-center bg-white border border-stone-200 p-2.5 rounded-xl opacity-75">
                    <p className="text-base font-bold text-red-600 tabular-nums">+{row.prLate}</p>
                    <p className="text-[9px] text-stone-600 font-bold uppercase text-center mt-0.5">{row.titleLate}</p>
                    <p className="text-[9px] text-stone-400 font-medium mt-0.5">&gt; {row.low} GG</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Badges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
              <Medal size={20} />
            </div>
            <h2 className="text-lg font-bold uppercase text-stone-900 tracking-tight">Badge e Onorificenze</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const Icon = badge.icon;
              const isOwned = player.badges.includes(badge.id);
              return (
                <button 
                  key={badge.id}
                  disabled={player.pr < badge.cost || isOwned}
                  onClick={() => buyBadge(badge as Badge)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 shadow-sm ${
                    isOwned
                      ? 'bg-stone-50 border-stone-200 opacity-75 cursor-default'
                      : 'bg-white border-stone-200 hover:border-indigo-300 active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className={`p-2 rounded-xl border ${isOwned ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
                      <Icon size={20} />
                    </div>
                    {isOwned ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Acquisito</span>
                    ) : (
                      <div className="flex items-center gap-1 text-indigo-600 font-bold tabular-nums bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        <span className="text-xs">{badge.cost}</span>
                        <span className="text-[8px] font-semibold">PR</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 uppercase text-xs tracking-tight">{badge.name}</h4>
                    <p className="text-[10px] text-stone-500 font-medium leading-tight">{badge.description}</p>
                  </div>
                  
                  {!isOwned && player.pr >= badge.cost && (
                    <div className="flex justify-end pt-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 flex items-center gap-1">
                        Sblocca <ChevronRight size={14} />
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default GuildView;
