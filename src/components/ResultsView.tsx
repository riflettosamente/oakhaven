import React from 'react';
import { motion } from 'motion/react';
import { Skull, ChevronRight } from 'lucide-react';
import { PixelGuild } from './PixelIcon';
import { Quest, PlayerState, QuestRewards } from '../types';

interface ResultsViewProps {
  player: PlayerState;
  currentQuest: Quest | null;
  rewards: QuestRewards | null;
  onCompleteQuest: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  player,
  currentQuest,
  rewards,
  onCompleteQuest
}) => {
  return (
    <motion.div 
      key="state-results"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-3xl w-full mx-auto py-6 px-4 flex flex-col items-center text-center space-y-6"
    >
      {rewards?.isFailure ? (
        <div className="space-y-3">
          <div className="w-16 h-16 bg-red-50 text-red-600 border border-red-200 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
            <Skull size={32} />
          </div>
          {rewards?.tag && (
            <div className="inline-block px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide">
              {rewards.tag}
            </div>
          )}
          <h1 className="text-3xl font-bold uppercase text-stone-900">Carico Insufficiente</h1>
          <p className="text-stone-500 text-sm font-medium max-w-md mx-auto">{rewards.motivation}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl mx-auto flex items-center justify-center shadow-sm relative">
            <PixelGuild size={32} />
          </div>

          {rewards?.tag && (
            <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
              {rewards.tag}
            </div>
          )}
          
          <h1 className="text-3xl font-bold uppercase text-stone-900">Obiettivo Raggiunto</h1>
          <p className="text-stone-500 text-sm font-medium">Hai consegnato con successo le merci a <span className="font-bold text-stone-800">{currentQuest?.destination}</span>.</p>
        </div>
      )}

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GOLD BOX */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl text-left shadow-sm relative overflow-hidden">
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">Riepilogo Ricompensa</p>
          <h3 className="text-lg font-bold text-stone-900 uppercase mb-4">Guadagno Oro</h3>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-xs">
              <span className="text-stone-500 font-medium">Carico Consegnato</span>
              <span className="font-bold text-stone-900">{rewards?.goodsDelivered} Casse</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-xs">
              <span className="text-stone-500 font-medium">Premio di Consegna</span>
              <span className="font-bold text-amber-600">+{rewards?.goldQuest} Oro</span>
            </div>
            {rewards && rewards.goldSurplus > 0 && (
              <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-xs">
                <span className="text-stone-500 font-medium">Bonus Eccedenze</span>
                <span className="font-bold text-amber-600">+{rewards.goldSurplus} Oro</span>
              </div>
            )}
            {currentQuest && player.goods > currentQuest.goods && (
              <div className="mt-3 p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <p className="text-[10px] text-amber-800 font-bold uppercase mb-0.5">Eccedenze in Magazzino</p>
                <p className="text-[11px] text-stone-600 font-medium">Hai conservato <span className="text-amber-700 font-bold">{player.goods - currentQuest.goods} unità</span> in eccedenza. Puoi venderle all'Emporio.</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Profitto Totale</p>
                <p className="text-stone-700 font-bold text-xs uppercase">Ricavo Netto</p>
              </div>
              <span className="text-2xl font-bold text-amber-600 tabular-nums">{rewards?.totalGold} <span className="text-sm font-semibold text-stone-500">Oro</span></span>
            </div>
          </div>
        </div>

        {/* REPUTATION BOX */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl text-left shadow-sm relative overflow-hidden">
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Riepilogo Fama</p>
          <h3 className="text-lg font-bold text-stone-900 uppercase mb-4">Reputazione</h3>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-xs">
              <span className="text-stone-500 font-medium">Viaggio Effettivo</span>
              <span className="font-bold text-stone-900">{player.daysPassed} Giorni</span>
            </div>

            <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 space-y-1">
              <p className="text-[9px] font-bold uppercase text-stone-500 tracking-wider mb-1">Tabella di Marcia (PR)</p>
              <div className="flex justify-between items-center text-[11px]">
                <span className={`font-medium ${player.daysPassed <= (rewards?.targetHigh || 0) ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>Rapido (Bonus)</span>
                <span className={`font-bold ${player.daysPassed <= (rewards?.targetHigh || 0) ? 'text-emerald-700' : 'text-stone-600'}`}>≤ {rewards?.targetHigh} gg</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className={`font-medium ${player.daysPassed > (rewards?.targetHigh || 0) && player.daysPassed <= (rewards?.targetLow || 0) ? 'text-indigo-700 font-bold' : 'text-stone-500'}`}>In Tempo (Standard)</span>
                <span className={`font-bold ${player.daysPassed > (rewards?.targetHigh || 0) && player.daysPassed <= (rewards?.targetLow || 0) ? 'text-indigo-700' : 'text-stone-600'}`}>≤ {rewards?.targetLow} gg</span>
              </div>
              <div className="flex justify-between items-center text-[11px] opacity-75">
                <span className="text-stone-500 font-medium">Ritardo (Malus)</span>
                <span className="text-stone-600 font-bold">&gt; {rewards?.targetLow} gg</span>
              </div>
            </div>
            
            <div className="p-2 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
              <p className="text-[11px] text-indigo-900 font-medium italic">
                "{rewards?.prReason}"
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-200">
              <span className="text-stone-700 font-bold text-xs uppercase">Onore Guadagnato</span>
              <span className={`text-2xl font-bold tabular-nums ${(rewards?.pr || 0) >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                {(rewards?.pr || 0) > 0 ? '+' : ''}{rewards?.pr || 0} <span className="text-sm font-semibold text-stone-500">PR</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onCompleteQuest}
        className="px-8 py-3 bg-stone-900 text-white font-bold uppercase text-xs rounded-xl hover:bg-stone-800 transition-all active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer"
      >
        {rewards?.isFailure ? "Continua Carriera" : "Prossima Tappa"} <ChevronRight size={16} />
      </button>
    </motion.div>
  );
};
export default ResultsView;
