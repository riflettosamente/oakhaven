import React from 'react';
import { motion } from 'motion/react';
import { Skull, ArrowLeft } from 'lucide-react';
import { PlayerState } from '../types';

interface GameOverViewProps {
  player: PlayerState;
  onResetGame: () => void;
}

export const GameOverView: React.FC<GameOverViewProps> = ({
  player,
  onResetGame
}) => {
  return (
    <motion.div 
      key="state-gameover"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-3xl w-full mx-auto py-8 px-4 flex flex-col items-center space-y-6"
    >
      <div className="w-16 h-16 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center justify-center shadow-sm">
        <Skull size={32} />
      </div>
      
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold uppercase text-stone-900">Game Over</h1>
        <div className="inline-block px-3 py-1 bg-red-50 border border-red-200 rounded-full">
          <p className="text-xs font-bold uppercase text-red-700">Causa: {player.stats.deathReason || 'Destino Avverso'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Il Tuo Destino */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-3">Il Tuo Destino</h3>
          <div className="space-y-2">
            {player.pr < 50 && (
              <div className="space-y-1">
                <p className="text-lg font-bold text-stone-900 uppercase">Vagabondo</p>
                <p className="text-stone-600 text-xs leading-relaxed font-medium italic">"Sei finito a mendicare nelle taverne, raccontando storie di viaggi mai conclusi."</p>
              </div>
            )}
            {player.pr >= 50 && player.pr <= 200 && (
              <div className="space-y-1">
                <p className="text-lg font-bold text-stone-900 uppercase">Apprendista Debitore</p>
                <p className="text-stone-600 text-xs leading-relaxed font-medium italic">"I creditori hanno sequestrato tutto. Ora lavori per ripagare i debiti."</p>
              </div>
            )}
            {player.pr > 200 && player.pr <= 500 && (
              <div className="space-y-1">
                <p className="text-lg font-bold text-stone-900 uppercase">Caduta di un Eroe</p>
                <p className="text-stone-600 text-xs leading-relaxed font-medium italic">"Il tuo nome resterà nei registri, come monito per chi affronta la sorte senza preparazione."</p>
              </div>
            )}
            {player.pr > 500 && (
              <div className="space-y-1">
                <p className="text-lg font-bold text-stone-900 uppercase">Leggenda Decaduta</p>
                <p className="text-stone-600 text-xs leading-relaxed font-medium italic">"Anche se il carro è distrutto, i menestrelli cantano ancora delle tue imprese."</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistiche Finali */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm grid grid-cols-2 gap-3">
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 col-span-2 flex justify-between items-center">
            <div>
              <p className="text-[9px] text-red-600 font-bold uppercase tracking-wider">Integrità Finale</p>
              <p className="text-base font-bold text-red-700">{player.hp} / {player.hpMax} HP</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Carro</p>
              <p className="text-xs font-bold text-red-700 uppercase">Distrutto</p>
            </div>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Giorni Totali</p>
            <p className="text-base font-bold text-stone-900">{player.stats.totalDays}</p>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Tappe Concluse</p>
            <p className="text-base font-bold text-stone-900">{player.stats.completedQuests}</p>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Oro Accumulato</p>
            <p className="text-base font-bold text-amber-600">{player.stats.totalGoldEarned}</p>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Mostri Affrontati</p>
            <p className="text-base font-bold text-stone-900">{player.stats.monstersFaced}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onResetGame}
        className="px-8 py-3.5 bg-stone-900 text-white font-bold uppercase text-xs rounded-xl hover:bg-stone-800 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Torna al Menu Principale
      </button>
    </motion.div>
  );
};
export default GameOverView;
