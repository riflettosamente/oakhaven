import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, History, MapPin, Flag, Star } from 'lucide-react';
import { PixelBook, PixelCoins } from './PixelIcon';
import { PlayerState, GameState, JournalEntry } from '../types';

interface JournalViewProps {
  player: PlayerState;
  selectedJournalQuest: JournalEntry | null;
  setSelectedJournalQuest: (entry: JournalEntry | null) => void;
  onNavigate: (state: GameState) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  player,
  selectedJournalQuest,
  setSelectedJournalQuest,
  onNavigate
}) => {
  return (
    <motion.div 
      key="state-journal"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-6xl mx-auto flex flex-col bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[75vh]"
    >
      <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
            <PixelBook size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase text-stone-900">Diario di Viaggio</h2>
            <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider">Cronache delle carovane commerciali</p>
          </div>
        </div>
        <button 
          onClick={() => { onNavigate('BOARD'); setSelectedJournalQuest(null); }}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all text-xs font-bold uppercase flex items-center gap-2 border border-stone-300 cursor-pointer"
        >
          <ArrowLeft size={16} /> Torna alla Bacheca
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List of Quest History */}
        <div className="w-72 border-r border-stone-200 flex flex-col bg-stone-50/40">
          <div className="p-3 bg-stone-100/70 border-b border-stone-200">
            <p className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Spedizioni Concluse</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {(player.questHistory || []).length === 0 ? (
              <div className="text-center py-12 px-4">
                <History size={28} className="text-stone-300 mx-auto mb-2" />
                <p className="text-stone-400 text-xs font-medium">Nessuna missione registrata</p>
              </div>
            ) : (
              (player.questHistory || []).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedJournalQuest(entry)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedJournalQuest?.id === entry.id 
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                    : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedJournalQuest?.id === entry.id ? 'text-indigo-600' : 'text-stone-400'}`}>
                      Giorno {entry.date}
                    </span>
                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      entry.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.status === 'success' ? 'Completata' : 'Fallita'}
                    </div>
                  </div>
                  <h4 className={`font-bold uppercase tracking-tight text-xs truncate ${selectedJournalQuest?.id === entry.id ? 'text-indigo-950' : 'text-stone-800'}`}>
                    {entry.quest.origin && `${entry.quest.origin} → `}{entry.quest.destination}
                  </h4>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6">
          {selectedJournalQuest ? (
            <div className="space-y-8 pb-12">
              <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-stone-200 pb-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                    Spedizione #{(player.questHistory || []).length - (player.questHistory || []).indexOf(selectedJournalQuest)}
                  </span>
                  <h3 className="text-2xl font-bold uppercase text-stone-900">Carovana per {selectedJournalQuest.quest.destination}</h3>
                  {selectedJournalQuest.quest.origin && (
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-500 mt-1">
                      <MapPin size={16} className="text-amber-600" />
                      <span>{selectedJournalQuest.quest.origin}</span>
                      <ArrowRight size={14} className="text-stone-400" />
                      <Flag size={16} className="text-amber-600" />
                      <span className="text-stone-800">{selectedJournalQuest.quest.destination}</span>
                    </div>
                  )}
                  <div className="flex gap-4 items-center pt-2">
                    <div className="flex items-center gap-1.5">
                      <PixelCoins size={20} />
                      <span className="text-base font-bold text-stone-900">{selectedJournalQuest.rewards.totalGold} <span className="text-xs text-stone-400 uppercase font-medium">Oro</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                      <span className="text-base font-bold text-stone-900">{selectedJournalQuest.rewards.pr} <span className="text-xs text-stone-400 uppercase font-medium">PR</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 min-w-[200px]">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Dettagli Tratta</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500 font-medium">Tipo:</span>
                      <span className="text-stone-900 font-bold uppercase">{selectedJournalQuest.quest.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500 font-medium">Carico:</span>
                      <span className="text-stone-900 font-bold">{selectedJournalQuest.quest.goods} Unità</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500 font-medium">Stato:</span>
                      <span className={`font-bold uppercase ${selectedJournalQuest.status === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                        {selectedJournalQuest.status === 'success' ? 'Riuscita' : 'Fallita'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <section className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Cronaca Tappa per Tappa</h4>

                <div className="grid grid-cols-1 gap-4">
                  {selectedJournalQuest.journey.map((step: any, i: number) => step && (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center font-bold text-xs text-stone-600">
                          {i + 1}
                        </div>
                        <div className="w-px flex-1 bg-stone-200" />
                      </div>
                      
                      <div className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-200">
                            <div className="flex items-center gap-3">
                              {React.createElement(step.weather.icon, { size: 20, className: "text-blue-500" })}
                              <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase text-stone-800">Tappa {i + 1}: {step.terrain.name} ({step.weather.name})</span>
                                {step.origin && step.destination && (
                                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-500 mt-0.5">
                                    <span>{step.origin}</span>
                                    <ArrowRight size={12} className="text-stone-400" />
                                    <span className="text-stone-800">{step.destination}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-xs font-bold text-stone-500 uppercase">
                              Giorno {step.totalDaysPassed}
                            </div>
                          </div>

                          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                  <th className="px-3 py-2 font-bold uppercase text-stone-500 text-[10px]">Elemento</th>
                                  <th className="px-3 py-2 font-bold uppercase text-stone-500 text-[10px] text-right">Danno HP</th>
                                  <th className="px-3 py-2 font-bold uppercase text-stone-500 text-[10px] text-right">Tempo</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                <tr>
                                  <td className="px-3 py-2">
                                    <span className="font-bold text-stone-800">Meteo ({step.weather.name})</span>
                                    <p className="text-[10px] text-stone-400 font-medium">{step.weather.desc}</p>
                                  </td>
                                  <td className={`px-3 py-2 font-bold text-right ${step.detailedDamage?.weather > 0 ? 'text-red-600' : 'text-stone-500'}`}>
                                    {step.detailedDamage?.weather > 0 ? `-${step.detailedDamage.weather} HP` : '0 HP'}
                                  </td>
                                  <td className="px-3 py-2 font-bold text-stone-600 text-right">{step.detailedDays?.weather || step.weatherReport.days} GG</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2">
                                    <span className="font-bold text-stone-800">Terreno ({step.terrain.name})</span>
                                    <p className="text-[10px] text-stone-400 font-medium">{step.terrain.desc}</p>
                                  </td>
                                  <td className={`px-3 py-2 font-bold text-right ${step.detailedDamage?.terrain > 0 ? 'text-red-600' : 'text-stone-500'}`}>
                                    {step.detailedDamage?.terrain > 0 ? `-${step.detailedDamage.terrain} HP` : '0 HP'}
                                  </td>
                                  <td className="px-3 py-2 font-bold text-stone-600 text-right">{step.detailedDays?.terrain || step.terrainReport.days} GG</td>
                                </tr>
                                {step.eventReport && step.eventReport.name !== 'Nessun Evento' && (
                                  <tr>
                                    <td className="px-3 py-2">
                                      <span className="font-bold text-stone-800">Evento: {step.eventReport.name || step.eventData?.name}</span>
                                      <p className="text-[10px] text-stone-400 font-medium">{step.eventData?.description || 'Viaggio regolare'}</p>
                                    </td>
                                    <td className={`px-3 py-2 font-bold text-right ${step.detailedDamage?.event > 0 ? 'text-red-600' : 'text-stone-500'}`}>
                                      {step.detailedDamage?.event > 0 ? `-${step.detailedDamage.event} HP` : '0 HP'}
                                    </td>
                                    <td className="px-3 py-2 font-bold text-stone-600 text-right">
                                      {step.detailedDays?.event > 0 ? `+${step.detailedDays.event} GG` : '0 GG'}
                                    </td>
                                  </tr>
                                )}
                                <tr className="bg-stone-50/80 font-bold">
                                  <td className="px-3 py-2 text-stone-800 uppercase text-[11px]">Totale Tappa</td>
                                  <td className={`px-3 py-2 text-right ${step.totalDamage > 0 ? 'text-red-600' : 'text-stone-700'}`}>
                                    {step.totalDamage > 0 ? `-${step.totalDamage}` : '0'} HP
                                  </td>
                                  <td className="px-3 py-2 text-stone-800 text-right">
                                    {step.stepDays} GG
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400">
              <History size={36} className="text-stone-300 mb-3" />
              <h3 className="text-base font-bold uppercase text-stone-600 mb-1">Cronache di Viaggio</h3>
              <p className="text-xs max-w-xs text-stone-400">Seleziona una missione per rivedere il resoconto completo tappa per tappa.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default JournalView;
