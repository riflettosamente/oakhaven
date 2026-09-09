import React from 'react';
import { motion } from 'motion/react';
import { LogOut, AlertTriangle, ArrowLeft } from 'lucide-react';
import { PixelCoins, PixelCrate } from './PixelIcon';
import { PlayerState, GameState } from '../types';

interface ExitViewProps {
  player: PlayerState;
  onConfirmExit: () => void;
  onNavigate: (state: GameState) => void;
}

export const ExitView: React.FC<ExitViewProps> = ({
  player,
  onConfirmExit,
  onNavigate,
}) => {
  return (
    <motion.div
      key="state-exit"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="max-w-5xl mx-auto space-y-6 pb-16 w-full"
    >
      {/* Intestazione di Pagina - Stile uniforme alle altre zone della città */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-sm">
            <LogOut size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">
              Abbandona la Partita
            </h1>
            <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">
              Conferma per terminare la sessione corrente e tornare alla schermata iniziale
            </p>
          </div>
        </div>
      </div>

      {/* Box di Avviso */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-200">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle size={26} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-rose-950 uppercase tracking-wide">
              Attenzione: perderai tutti i progressi attuali!
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Lasciando la partita, l'avventura corrente verrà terminata. L'oro accumulato, le merci caricate sul carretto, i punti reputazione della Gilda e i progressi della carovana andranno persi definitivamente.
            </p>
          </div>
        </div>

        {/* Riepilogo sessione corrente che andrà persa */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            Stato Attuale della Partita
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Giorni Trascorsi</span>
              <span className="text-base font-black text-stone-800">{player.daysPassed}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Oro accumulato</span>
              <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                <PixelCoins size={15} /> {player.gold}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Merci nel carretto</span>
              <span className="text-base font-black text-stone-800 flex items-center justify-center gap-1">
                <PixelCrate size={15} /> {player.goods}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Reputazione</span>
              <span className="text-base font-black text-indigo-700">{player.pr} PR</span>
            </div>
          </div>
        </div>

        {/* Pulsanti di Scelta */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={() => onNavigate('BOARD')}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Continua a Giocare (Torna alla Bacheca)</span>
          </button>

          <button
            onClick={onConfirmExit}
            className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut size={16} />
            <span>Conferma e Torna al Menu</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExitView;
