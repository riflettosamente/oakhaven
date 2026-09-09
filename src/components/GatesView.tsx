import React from 'react';
import { motion } from 'motion/react';
import { Landmark, ChevronRight, Heart, MapPin, AlertTriangle } from 'lucide-react';
import { 
  PixelCrate, 
  PixelBlacksmith, 
  PixelStore, 
  PixelGuild, 
  PixelTavern, 
  PixelCoins, 
  PixelQuest 
} from './PixelIcon';
import { Quest, PlayerState, GameState } from '../types';

interface GatesViewProps {
  player: PlayerState;
  quest: Quest | null;
  questOptions: Quest[];
  onSelectQuest: (q: Quest) => void;
  onConfirmDeparture: (q: Quest) => void;
  onNavigate: (state: GameState) => void;
}

export const GatesView: React.FC<GatesViewProps> = ({
  player,
  quest,
  questOptions,
  onSelectQuest,
  onConfirmDeparture,
  onNavigate
}) => {
  // Se non c'è una quest selezionata ma ci sono opzioni, seleziona la prima come default
  const activeQuest = quest || (questOptions.length > 0 ? questOptions[0] : null);

  return (
    <motion.div 
      key="state-gates"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="max-w-5xl mx-auto space-y-6 pb-16 w-full"
    >
      {/* Intestazione di Pagina - Stile uniforme alle altre zone della città */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm">
            <Landmark size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">
              Porte della Città di {player.currentLocation}
            </h1>
            <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">
              Uscita verso le terre selvagge e controlli pre-partenza della carovana
            </p>
          </div>
        </div>
      </div>

      {!activeQuest ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <PixelQuest size={28} />
          </div>
          <h2 className="text-xl font-bold uppercase text-stone-900">Nessun Incarico Selezionato</h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Per varcare le porte della città devi prima accettare un incarico commerciale alla bacheca.
          </p>
          <button
            onClick={() => onNavigate('BOARD')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Vai alla Bacheca</span>
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sezione Destinazione Selezionata */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Spedizione Attiva
                  </span>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    {activeQuest.type}
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase text-stone-900 mt-1 flex items-center gap-2">
                  <MapPin size={22} className="text-amber-600" />
                  Destinazione: {activeQuest.destination}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Lunghezza</span>
                  <span className="text-sm font-black text-stone-800">{activeQuest.length} tappe</span>
                </div>
                <div className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ricompensa</span>
                  <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                    <PixelCoins size={14} /> +{activeQuest.reward} Oro
                  </span>
                </div>
              </div>
            </div>

            {/* Se ci sono più incarichi disponibili, consenti di selezionarli rapidamente */}
            {questOptions.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Cambia Incarico:
                </span>
                {questOptions.map((q, idx) => {
                  const isSelected = activeQuest.destination === q.destination;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectQuest(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {q.destination} ({q.length} tappe • {q.goods} merci)
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checklist / Controlli Pre-partenza */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Controlli Pre-Partenza della Carovana
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Domanda 1: Merce */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                player.goods >= activeQuest.goods 
                  ? 'bg-white border-emerald-200 shadow-xs' 
                  : 'bg-rose-50/50 border-rose-200 shadow-xs'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      player.goods >= activeQuest.goods 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      <PixelCrate size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                        Hai controllato se hai abbastanza merce?
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-black text-stone-900">
                          Carico a bordo: {player.goods} / {activeQuest.goods} casse
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          player.goods >= activeQuest.goods 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {player.goods >= activeQuest.goods ? 'Pronto' : 'Insufficiente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {player.goods >= activeQuest.goods 
                      ? 'Hai caricato tutte le merci richieste per portare a termine la spedizione con successo.' 
                      : `Ti mancano ${activeQuest.goods - player.goods} casse di merce per completare la fornitura. Puoi rifornirti all'Emporio.`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onNavigate('EMPORIO')}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-amber-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-amber-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <PixelStore size={16} className="text-amber-600" />
                    <span>Vai all'Emporio</span>
                  </button>
                </div>
              </div>

              {/* Domanda 2: Riparazione Carretto */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                player.hp >= player.hpMax 
                  ? 'bg-white border-stone-200 shadow-xs' 
                  : player.hp <= 5 
                  ? 'bg-rose-50/50 border-rose-200 shadow-xs' 
                  : 'bg-amber-50/50 border-amber-200 shadow-xs'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      player.hp >= player.hpMax 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : player.hp <= 5 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                        Il carretto deve essere riparato?
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-black text-stone-900">
                          Salute Carretto: {player.hp} / {player.hpMax} PV
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          player.hp >= player.hpMax 
                            ? 'bg-stone-100 text-stone-700 border border-stone-300' 
                            : player.hp <= 5 
                            ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {player.hp >= player.hpMax ? 'Integro' : player.hp <= 5 ? 'Critico' : 'Danneggiato'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {player.hp >= player.hpMax 
                      ? 'La struttura del carretto è integra e pronta a reggere le asperità della strada.' 
                      : 'Il carretto presenta danni strutturali. Riparalo dal fabbro per evitare di subire rotture catastrofiche.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onNavigate('BLACKSMITH')}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-sky-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-sky-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <PixelBlacksmith size={16} className="text-sky-600" />
                    <span>Vai al Fabbro</span>
                  </button>
                </div>
              </div>

              {/* Domanda 3: Gilda dei Mercanti */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <PixelGuild size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                        La Gilda dei Mercanti
                      </h4>
                      <p className="text-sm font-black text-indigo-700 mt-0.5">
                        {player.pr} Punti Reputazione
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Hai ancora {player.pr} punti Reputazione, vuoi dare un'occhiata alla Gilda prima di partire per verificare privilegi e titoli?
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onNavigate('GUILD')}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-950 font-bold rounded-xl border border-indigo-200 hover:border-indigo-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 uppercase"
                  >
                    <PixelGuild size={16} className="text-indigo-600" />
                    <span>VAI ALLA GILDA</span>
                  </button>
                </div>
              </div>

              {/* Domanda 4: Taverna */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <PixelTavern size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                        Punto di Ristoro
                      </h4>
                      <p className="text-sm font-black text-stone-900 mt-0.5">
                        La Taverna del Viandante
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Puoi anche riposare alla Taverna per far trascorrere del tempo e rigenerare le opportunità commerciali in bacheca.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onNavigate('TAVERN')}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-amber-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-amber-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 uppercase"
                  >
                    <PixelTavern size={16} className="text-amber-700" />
                    <span>VAI ALLA TAVERNA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pulsante Principale di Partenza */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Pronto per il viaggio?
              </p>
              <p className="text-sm text-stone-800 font-semibold">
                Una volta superate le porte della città, affronterai la strada fino a <strong className="text-stone-900">{activeQuest.destination}</strong>.
              </p>
            </div>

            <button
              onClick={() => onConfirmDeparture(activeQuest)}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95"
            >
              <span>PARTI PER LA SPEDIZIONE</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default GatesView;
