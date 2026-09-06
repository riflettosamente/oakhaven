import React from 'react';
import { motion } from 'motion/react';
import { X, Landmark, ChevronRight, Heart } from 'lucide-react';
import { PixelCrate, PixelBlacksmith, PixelStore, PixelGuild, PixelTavern } from './PixelIcon';
import { Quest, PlayerState, GameState } from '../types';

interface DepartureModalProps {
  quest: Quest | null;
  questOptions: Quest[];
  player: PlayerState;
  onClose: () => void;
  onSelectQuest: (q: Quest) => void;
  onConfirmDeparture: (q: Quest) => void;
  onNavigate: (state: GameState) => void;
}

export const DepartureModal: React.FC<DepartureModalProps> = ({
  quest,
  questOptions,
  player,
  onClose,
  onSelectQuest,
  onConfirmDeparture,
  onNavigate
}) => {
  if (!quest) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" 
        onClick={onClose} 
      />
      
      <div className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1.5 rounded-lg cursor-pointer"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Landmark size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Porte della Città</span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-stone-900 leading-tight">
              Porte della Città
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              <span className="text-stone-800 font-bold">Sei sicuro di voler partire?</span> Incarico per <strong className="text-stone-900">{quest.destination}</strong> ({quest.length} tappe • {quest.type})
            </p>
          </div>
        </div>

        {questOptions.length > 1 && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Incarico:</span>
            <div className="flex flex-wrap gap-1.5">
              {questOptions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectQuest(q)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    quest.destination === q.destination
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {q.destination} ({q.length} tappe)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Checklist / Domande */}
        <div className="space-y-3">
          {/* Domanda 1: Merce */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            player.goods >= quest.goods 
              ? 'bg-emerald-50/60 border-emerald-200' 
              : 'bg-rose-50/70 border-rose-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                player.goods >= quest.goods 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-rose-100 text-rose-700'
              }`}>
                <PixelCrate size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-800">
                  Hai controllato se hai abbastanza merce?
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black text-stone-900">
                    Carico a bordo: {player.goods} / {quest.goods} casse
                  </span>
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                    player.goods >= quest.goods 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {player.goods >= quest.goods ? 'Pronto' : 'Insufficiente'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  {player.goods >= quest.goods 
                    ? 'Hai le merci necessarie per portare a termine con successo l\'incarico.' 
                    : `Ti mancano ${quest.goods - player.goods} casse. Puoi acquistarne all'Emporio prima di partire.`}
                </p>
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('EMPORIO');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-amber-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-amber-300 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <PixelStore size={16} className="text-amber-600" />
                    <span>Vai all'Emporio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Domanda 2: Riparazione Carretto */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            player.hp >= player.hpMax 
              ? 'bg-stone-50 border-stone-200' 
              : player.hp <= 5 
              ? 'bg-rose-50/70 border-rose-200' 
              : 'bg-amber-50/60 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                player.hp >= player.hpMax 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : player.hp <= 5 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <Heart size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-800">
                  Il carretto deve essere riparato?
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black text-stone-900">
                    Salute Carretto: {player.hp} / {player.hpMax} PV
                  </span>
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                    player.hp >= player.hpMax 
                      ? 'bg-stone-100 text-stone-700 border border-stone-300' 
                      : player.hp <= 5 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {player.hp >= player.hpMax ? 'Integro' : player.hp <= 5 ? 'Critico' : 'Danneggiato'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  {player.hp >= player.hpMax 
                    ? 'Il carretto è integro e pronto al viaggio.' 
                    : 'Il carretto è danneggiato. Considera di farlo riparare dal Fabbro prima di metterti in strada!'}
                </p>
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('BLACKSMITH');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-sky-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-sky-300 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <PixelBlacksmith size={16} className="text-sky-600" />
                    <span>Vai al Fabbro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Domanda 3: Punti Reputazione e Gilda */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <PixelGuild size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-900 leading-snug">
                  Hai ancora <span className="text-indigo-800 font-black">{player.pr} punti Reputazione</span>, vuoi dare un'occhiata alla Gilda prima di partire?
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5 mb-2.5 font-medium">
                  Consulta il tuo rango di mercante, i traguardi raggiunti e i privilegi commerciali sbloccati.
                </p>

                <div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('GUILD');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-950 font-bold rounded-xl border border-indigo-200 hover:border-indigo-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 uppercase"
                  >
                    <PixelGuild size={16} className="text-indigo-600" />
                    <span>VAI ALLA GILDA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Domanda 4: Riposo in Taverna */}
          <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <PixelTavern size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-900 leading-snug">
                  Puoi anche riposare alla Taverna
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5 mb-2.5 font-medium">
                  Ascolta le voci dei viandanti, recupera le forze o raccogli utili consigli prima di partire.
                </p>

                <div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('TAVERN');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-amber-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-amber-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 uppercase"
                  >
                    <PixelTavern size={16} className="text-amber-700" />
                    <span>VAI ALLA TAVERNA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottoni di conferma/annulla */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Rimani in Città
          </button>

          <button
            onClick={() => onConfirmDeparture(quest)}
            className="w-full sm:w-auto px-7 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Conferma e Parti</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default DepartureModal;
