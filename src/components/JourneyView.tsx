import React from 'react';
import { motion } from 'motion/react';
import { 
  Navigation, 
  ArrowRight, 
  Heart, 
  Target, 
  Calendar, 
  Home, 
  Check, 
  Flag, 
  X, 
  Cloud, 
  Mountain, 
  Landmark, 
  Ghost, 
  Smile, 
  ShieldCheck, 
  CloudSun, 
  Lock, 
  Compass, 
  Dices 
} from 'lucide-react';
import { PixelCrate } from './PixelIcon';
import { Quest, PlayerState, GameState } from '../types';

export interface JourneyViewProps {
  currentQuest: Quest | null;
  player: PlayerState;
  journeyStep: number;
  journeyHistory: any[];
  inspectedIcon: { step: number; type: 'weather' | 'terrain' | 'structure' | 'event' } | null;
  setInspectedIcon: (val: { step: number; type: 'weather' | 'terrain' | 'structure' | 'event' } | null) => void;
  stageHeroPhase: 'READY' | 'ACTIVE';
  revealedStageCards: { terrain: boolean; weather: boolean; structure: boolean; event: boolean };
  activeStructure: any;
  activeEncounter: any;
  encounterResolved: boolean;
  isRolling: boolean;
  flipStageCard: (phase: 'terrain' | 'weather' | 'structure' | 'event') => void;
  flipNextStageCard: () => void;
  flipAllStageCards: () => void;
  resolveStructure: (choice: string) => void;
  resolveEncounter: (choice: string) => void;
  completeCurrentStep: () => void;
  resolveStep: () => void;
  onNavigate: (state: GameState) => void;
}

export function JourneyView({
  currentQuest,
  player,
  journeyStep,
  journeyHistory,
  inspectedIcon,
  setInspectedIcon,
  stageHeroPhase,
  revealedStageCards,
  activeStructure,
  activeEncounter,
  encounterResolved,
  isRolling,
  flipStageCard,
  flipNextStageCard,
  flipAllStageCards,
  resolveStructure,
  resolveEncounter,
  completeCurrentStep,
  resolveStep,
  onNavigate,
}: JourneyViewProps) {
  return (
    <motion.div 
      key="state-journey"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex-1 max-w-5xl mx-auto flex flex-col gap-4 p-2 relative overflow-y-auto"
    >
      {/* TOP: Header compatto & Metriche rotta */}
      <div className="w-full bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 rounded-xl text-white shadow-xs">
            <Navigation size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Rotta {currentQuest?.type} • {currentQuest?.length} Tappe
              </span>
            </div>
            <p className="text-base font-black text-stone-900 flex items-center gap-2 mt-0.5">
              <span>{player.currentLocation}</span>
              <ArrowRight size={16} className="text-amber-500" />
              <span className="text-amber-700">{currentQuest?.destination}</span>
            </p>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          {/* Salute Carretto */}
          <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <Heart size={18} className={player.hp <= 5 ? 'text-red-500 animate-pulse' : 'text-rose-500'} />
            <div>
              <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <span>Salute Carretto</span>
                <span className={player.hp <= 5 ? 'text-red-600 font-black' : 'text-stone-700'}>{player.hp}/{player.hpMax}</span>
              </div>
              <div className="w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-0.5">
                <div 
                  className={`h-full transition-all duration-300 ${player.hp <= 5 ? 'bg-red-500' : player.hp <= 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, (player.hp / player.hpMax) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Carico Trasportato */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <PixelCrate size={18} className="text-amber-600" />
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">Carico Trasportato</p>
              <p className="text-xs font-black text-stone-800 leading-tight mt-0.5">
                {player.goods} <span className="text-[10px] font-medium text-stone-400">casse</span>
              </p>
            </div>
          </div>

          {/* Carico Necessario per la Quest */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
            player.goods >= (currentQuest?.goods || 0)
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-rose-50/70 border-rose-200'
          }`}>
            <Target size={18} className={player.goods >= (currentQuest?.goods || 0) ? 'text-emerald-600' : 'text-rose-600'} />
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">Carico Necessario</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-black text-stone-800 leading-tight">
                  {currentQuest?.goods || 0} <span className="text-[10px] font-medium text-stone-400">casse</span>
                </span>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                  player.goods >= (currentQuest?.goods || 0)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {player.goods >= (currentQuest?.goods || 0) ? 'OK' : 'Mancante'}
                </span>
              </div>
            </div>
          </div>

          {/* Tempo di Arrivo */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <Calendar size={18} className="text-stone-500" />
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">Tempo di Arrivo</p>
              <p className="text-xs font-black text-stone-800 leading-tight mt-0.5">
                {player.daysPassed} <span className="text-[10px] font-medium text-stone-400">gg</span>
                {currentQuest && (
                  <span className="text-[10px] font-bold text-amber-600 ml-1.5" title="Bonus fama">
                    (max {currentQuest.type === 'Breve' ? 6 : currentQuest.type === 'Media' ? 10 : 16}gg)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STEPPER LINEARE A NODI */}
      <div className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 shadow-xs">
        <div className="relative flex items-start justify-between">
          {/* Background Track Line */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-stone-200 -translate-y-1/2 z-0" />
          {/* Active Progress Line */}
          <div 
            className="absolute top-4 left-6 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ 
              width: `${Math.min(100, Math.max(0, (journeyStep / (currentQuest?.length || 1)) * 100))}%` 
            }}
          />

          {/* Origin Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center shadow-xs border-2 border-white">
              <Home size={14} />
            </div>
            <span className="text-[10px] font-bold text-stone-600 mt-1 uppercase tracking-wider max-w-[85px] truncate text-center">
              {player.currentLocation}
            </span>
            <span className="mt-1.5 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
              Partenza
            </span>
          </div>

          {/* Step Nodes con Resoconto a Icone Cliccabili */}
          {Array.from({ length: currentQuest?.length || 0 }).map((_, i) => {
            const isDone = i < journeyStep;
            const isCurrent = i === journeyStep;
            const stepData = journeyHistory[i];

            return (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all border-2 ${
                    isCurrent
                      ? 'bg-amber-500 text-white border-white ring-4 ring-amber-400/40 shadow-sm scale-110'
                      : isDone
                      ? 'bg-emerald-600 text-white border-white shadow-xs'
                      : 'bg-stone-100 text-stone-400 border-stone-300'
                  }`}>
                    {isDone ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                    isCurrent ? 'text-amber-700 font-black' : isDone ? 'text-emerald-700' : 'text-stone-400'
                  }`}>
                    Tappa {i + 1}
                  </span>

                  {/* RESOCONTO SOTTO IL NODO IN FORMA DI ICONE SINGOLARMENTE CLICCABILI */}
                  {isDone && stepData ? (
                    <div className="mt-1.5 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 bg-stone-50 border border-stone-200/90 rounded-lg p-1 shadow-2xs">
                        {/* 1. TERRENO */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedIcon(inspectedIcon?.step === i && inspectedIcon?.type === 'terrain' ? null : { step: i, type: 'terrain' });
                          }}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            inspectedIcon?.step === i && inspectedIcon?.type === 'terrain'
                              ? 'bg-emerald-600 text-white shadow-xs scale-110'
                              : 'text-emerald-600 hover:bg-emerald-100 hover:scale-105'
                          }`}
                          title={`Terreno: ${stepData.terrain?.name} (Clicca per resoconto ed effetti)`}
                        >
                          {React.createElement(stepData.terrain?.icon || Mountain, { size: 14 })}
                        </button>

                        {/* 2. METEO */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedIcon(inspectedIcon?.step === i && inspectedIcon?.type === 'weather' ? null : { step: i, type: 'weather' });
                          }}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            inspectedIcon?.step === i && inspectedIcon?.type === 'weather'
                              ? 'bg-sky-500 text-white shadow-xs scale-110'
                              : 'text-sky-600 hover:bg-sky-100 hover:scale-105'
                          }`}
                          title={`Meteo: ${stepData.weather?.name} (Clicca per resoconto ed effetti)`}
                        >
                          {React.createElement(stepData.weather?.icon || Cloud, { size: 14 })}
                        </button>

                        {/* 3. STRUTTURA */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedIcon(inspectedIcon?.step === i && inspectedIcon?.type === 'structure' ? null : { step: i, type: 'structure' });
                          }}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            inspectedIcon?.step === i && inspectedIcon?.type === 'structure'
                              ? 'bg-indigo-600 text-white shadow-xs scale-110'
                              : 'text-indigo-600 hover:bg-indigo-100 hover:scale-105'
                          }`}
                          title={`Struttura: ${stepData.structureReport?.name || stepData.structureData?.name || 'Nessuna'} (Clicca per resoconto ed effetti)`}
                        >
                          {React.createElement(stepData.structureReport?.icon || stepData.structureData?.icon || Landmark, { size: 14 })}
                        </button>

                        {/* 4. EVENTO */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedIcon(inspectedIcon?.step === i && inspectedIcon?.type === 'event' ? null : { step: i, type: 'event' });
                          }}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            inspectedIcon?.step === i && inspectedIcon?.type === 'event'
                              ? 'bg-amber-600 text-white shadow-xs scale-110'
                              : 'text-amber-600 hover:bg-amber-100 hover:scale-105'
                          }`}
                          title={`Evento: ${stepData.eventData?.name || 'Nessun Evento'} (Clicca per resoconto ed effetti)`}
                        >
                          {stepData.eventData?.name === 'Nessun Evento'
                            ? <Smile size={14} />
                            : React.createElement(stepData.eventData?.icon || Ghost, { size: 14 })}
                        </button>
                      </div>

                      <span className={`text-[9px] font-black tracking-tight ${stepData.totalDamage > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {stepData.totalDamage > 0 ? `-${stepData.totalDamage} HP` : '0 HP'}
                      </span>
                    </div>
                  ) : isCurrent ? (
                    <div className="mt-1.5">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                        In corso
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1.5">
                      <span className="text-[9px] font-semibold text-stone-400">
                        In attesa
                      </span>
                    </div>
                  )}
                </div>

                {/* POPOVER RESOCONTO SINGOLO CON EFFETTO AL CLICK DELL'ICONA */}
                {inspectedIcon?.step === i && stepData && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className={`absolute top-full mt-2 z-40 w-72 bg-white text-stone-800 border-2 rounded-2xl p-3.5 shadow-xl text-left transition-all ${
                      inspectedIcon.type === 'weather' ? 'border-sky-400 ring-4 ring-sky-100' :
                      inspectedIcon.type === 'terrain' ? 'border-emerald-400 ring-4 ring-emerald-100' :
                      inspectedIcon.type === 'structure' ? 'border-indigo-400 ring-4 ring-indigo-100' :
                      'border-amber-400 ring-4 ring-amber-100'
                    } ${
                      i === 0 ? 'left-0' : i === (currentQuest?.length || 1) - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                    }`}
                  >
                    {/* Header Popover con Titolo e Bottone Chiudi */}
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-2.5">
                      <span className={`px-2 py-0.5 font-black text-[10px] uppercase tracking-wider rounded-md border ${
                        inspectedIcon.type === 'weather' ? 'bg-sky-50 border-sky-200 text-sky-700' :
                        inspectedIcon.type === 'terrain' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        inspectedIcon.type === 'structure' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                        'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {inspectedIcon.type === 'weather' && `Resoconto Meteo • Tappa #${i + 1}`}
                        {inspectedIcon.type === 'terrain' && `Resoconto Terreno • Tappa #${i + 1}`}
                        {inspectedIcon.type === 'structure' && `Resoconto Struttura • Tappa #${i + 1}`}
                        {inspectedIcon.type === 'event' && `Resoconto Evento • Tappa #${i + 1}`}
                      </span>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setInspectedIcon(null); }}
                        className="text-stone-400 hover:text-stone-700 p-0.5 rounded hover:bg-stone-100 cursor-pointer text-xs"
                        title="Chiudi"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Contenuto Singolo: METEO */}
                    {inspectedIcon.type === 'weather' && (
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-200 shrink-0">
                            {React.createElement(stepData.weather?.icon || Cloud, { size: 20 })}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-stone-900 text-sm truncate">{stepData.weather?.name}</h4>
                            <span className="text-[10px] font-semibold text-sky-700">Condizione Atmosferica</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 italic leading-relaxed bg-stone-50 p-2 rounded-xl border border-stone-200/70">
                          "{stepData.weather?.desc}"
                        </p>

                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Effetto Riscontrato:
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold">
                            <span className={`px-2 py-0.5 rounded-lg border ${stepData.weatherReport?.damage > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>
                              Danno: {stepData.weatherReport?.damage > 0 ? `-${stepData.weatherReport.damage}` : '0'} HP
                            </span>
                            <span className="px-2 py-0.5 rounded-lg border bg-amber-50 border-amber-200 text-amber-800">
                              Durata: +{stepData.weatherReport?.days || 0} GG
                            </span>
                          </div>

                          {(stepData.goodsLostWeather > 0 || (stepData.weatherReport?.goodsLost || 0) > 0) && (
                            <div className="mt-2 text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-medium flex items-center gap-1.5">
                              📦 <span>Perdita Merci: -{stepData.goodsLostWeather || stepData.weatherReport?.goodsLost} ({stepData.weather?.name})</span>
                            </div>
                          )}

                          {stepData.weatherReport?.mitigation && stepData.weatherReport.mitigation.length > 0 && (
                            <div className="mt-2 text-[10px] text-sky-800 bg-sky-50 border border-sky-200 rounded-lg p-1.5 font-medium flex items-center gap-1.5">
                              <ShieldCheck size={13} className="shrink-0 text-sky-600" />
                              <span>Mitigato da: {stepData.weatherReport.mitigation.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contenuto Singolo: TERRENO */}
                    {inspectedIcon.type === 'terrain' && (
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
                            {React.createElement(stepData.terrain?.icon || Mountain, { size: 20 })}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-stone-900 text-sm truncate">{stepData.terrain?.name}</h4>
                            <span className="text-[10px] font-semibold text-emerald-700">Fondo Stradale & Percorso</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 italic leading-relaxed bg-stone-50 p-2 rounded-xl border border-stone-200/70">
                          "{stepData.terrain?.desc}"
                        </p>

                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Effetto Riscontrato:
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold">
                            <span className={`px-2 py-0.5 rounded-lg border ${stepData.terrainReport?.damage > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-stone-100 border-stone-200 text-stone-600'}`}>
                              Danno: {stepData.terrainReport?.damage > 0 ? `-${stepData.terrainReport.damage}` : '0'} HP
                            </span>
                            <span className="px-2 py-0.5 rounded-lg border bg-amber-50 border-amber-200 text-amber-800">
                              Durata: {stepData.terrainReport?.days || 0} GG
                            </span>
                          </div>

                          {stepData.terrainReport?.mitigation && stepData.terrainReport.mitigation.length > 0 && (
                            <div className="mt-2 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 font-medium flex items-center gap-1.5">
                              <ShieldCheck size={13} className="shrink-0 text-emerald-600" />
                              <span>Mitigato da: {stepData.terrainReport.mitigation.join(', ')}</span>
                            </div>
                          )}

                          {stepData.terrainReport?.goodsLost > 0 && (
                            <div className="mt-2 text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-medium">
                              📦 Merci perse: -{stepData.terrainReport.goodsLost} ({stepData.terrainReport.motivation})
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contenuto Singolo: STRUTTURA */}
                    {inspectedIcon.type === 'structure' && (
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200 shrink-0">
                            {React.createElement(stepData.structureReport?.icon || stepData.structureData?.icon || Landmark, { size: 20 })}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-stone-900 text-sm truncate">
                              {stepData.structureReport?.name || stepData.structureData?.name || 'Sentiero Selvaggio'}
                            </h4>
                            <span className="text-[10px] font-semibold text-indigo-700">Insediamento o Punto d'Interesse</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2 rounded-xl border border-stone-200/70">
                          {stepData.structureReport?.description || stepData.structureData?.description || 'Il sentiero prosegue nella natura senza costruzioni o villaggi.'}
                        </p>

                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Effetto Riscontrato:
                          </span>
                          <div className="text-xs text-indigo-950 bg-indigo-50 border border-indigo-200 rounded-xl p-2 font-semibold leading-relaxed">
                            {stepData.structureReport?.outcome || (stepData.detailedDamage?.structure ? `Danno subito: -${stepData.detailedDamage.structure} HP` : 'Nessun impatto o beneficio durante il passaggio.')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contenuto Singolo: EVENTO */}
                    {inspectedIcon.type === 'event' && (
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 shrink-0">
                            {stepData.eventData?.name === 'Nessun Evento'
                              ? <Smile size={20} />
                              : React.createElement(stepData.eventData?.icon || Ghost, { size: 20 })}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-stone-900 text-sm truncate">
                              {stepData.eventData?.name || 'Nessun Evento'}
                            </h4>
                            <span className="text-[10px] font-semibold text-amber-700">Incontro o Imprevisto</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2 rounded-xl border border-stone-200/70">
                          {stepData.eventData?.description || 'Nessun particolare ostacolo incontrato lungo la strada.'}
                        </p>

                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Effetto Riscontrato:
                          </span>
                          <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-xl p-2 font-semibold leading-relaxed">
                            {stepData.eventReport?.outcome || (stepData.detailedDamage?.event ? `Danni evento: -${stepData.detailedDamage.event} HP` : 'Nessun danno o perdita di merci.')}
                          </div>
                          {stepData.goodsLostEvent > 0 && (
                            <div className="mt-2 text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-medium">
                              📦 Perdita Merci: -{stepData.goodsLostEvent} ({stepData.eventData?.name || 'Evento'})
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Destination Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white transition-all ${
              journeyStep >= (currentQuest?.length || 0)
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 shadow-md animate-bounce'
                : 'bg-stone-100 text-stone-400 border-stone-300'
            }`}>
              <Flag size={14} />
            </div>
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider max-w-[85px] truncate text-center ${
              journeyStep >= (currentQuest?.length || 0) ? 'text-emerald-700 font-black' : 'text-stone-400'
            }`}>
              {currentQuest?.destination}
            </span>
            <span className="mt-1.5 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
              Arrivo
            </span>
          </div>
        </div>
      </div>

      {/* CRUSCOTTO CENTRALE PROTAGONISTA (HERO STAGE) */}
      <div className="w-full flex-1 flex flex-col justify-center">

        {journeyStep >= (currentQuest?.length || 0) ? (

          /* CASO 2: Tutte le Tappe Completate - Arrivo a Destinazione */
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center gap-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center shadow-xs">
              <Flag size={40} className="animate-bounce" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest rounded-full">
                Viaggio Concluso con Successo
              </span>
              <h3 className="text-3xl font-black text-stone-900 mt-2 uppercase tracking-tight">
                Sei arrivato alle porte di {currentQuest?.destination}!
              </h3>
              <p className="text-sm text-stone-500 max-w-lg mx-auto mt-1 font-medium">
                La carovana ha superato tutte le tappe della rotta mercantile. È il momento di entrare in città, scaricare le merci e riscuotere la ricompensa.
              </p>
            </div>

            {/* Riepilogo Veloce */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Merci Salve</span>
                <span className="text-lg font-black text-stone-800">{player.goods} / {currentQuest?.goods}</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Giorni Totali</span>
                <span className="text-lg font-black text-stone-800">{player.daysPassed} gg</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Salute Carro</span>
                <span className="text-lg font-black text-emerald-600">{player.hp} HP</span>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('RESULTS')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-0.5 cursor-pointer active:scale-95"
            >
              <span>Entra in Città e Riscuoti la Ricompensa</span>
              <span className="text-[10px] text-emerald-100 font-normal opacity-90">(o premi Spazio / Invio)</span>
            </button>
          </motion.div>
        ) : isRolling ? (

          /* CASO 3: Esplorazione / Lancio dei Dadi in corso */
          <div className="w-full bg-white border border-stone-200 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center gap-4">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
              className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center shadow-xs"
            >
              <Dices size={32} />
            </motion.div>
            <div>
              <h4 className="text-lg font-black text-stone-900 uppercase tracking-tight">
                Esplorando la Tappa #{journeyStep + 1}...
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Verifica del meteo, del terreno e delle insidie sul cammino...
              </p>
            </div>
          </div>
        ) : stageHeroPhase === 'ACTIVE' && journeyHistory[journeyStep] ? (

          /* SEZIONE TAPPA: LE QUATTRO FASI (METEO, TERRENO, STRUTTURA, EVENTO) */
          (() => {
            const stepItem = journeyHistory[journeyStep];
            const isTerrainFlipped = revealedStageCards.terrain;
            const isWeatherFlipped = revealedStageCards.weather;
            const isStructureFlipped = revealedStageCards.structure;
            const isEventFlipped = revealedStageCards.event;

            const nextToFlip = !isTerrainFlipped
              ? 'terrain'
              : !isWeatherFlipped
              ? 'weather'
              : !isStructureFlipped
              ? 'structure'
              : !isEventFlipped
              ? 'event'
              : null;

            const allFlipped = isTerrainFlipped && isWeatherFlipped && isStructureFlipped && isEventFlipped;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white border-2 border-stone-200 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col gap-6"
              >
                {/* Intestazione Sezione Tappa con indicatore sequenziale delle 4 fasi */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase rounded-full">
                      Tappa #{journeyStep + 1} di {currentQuest?.length}
                    </span>
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Rotta verso {currentQuest?.destination}
                    </span>
                  </div>

                  {/* Sequenza dei 4 Badge Fasi da Sinistra verso Destra: 1. Terreno, 2. Meteo, 3. Struttura, 4. Evento */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-bold">
                    <button
                      type="button"
                      disabled={isTerrainFlipped || nextToFlip !== 'terrain'}
                      onClick={() => flipStageCard('terrain')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                        isTerrainFlipped
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs cursor-default'
                          : nextToFlip === 'terrain'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/50 animate-pulse cursor-pointer'
                          : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>1. Terreno</span>
                      {isTerrainFlipped && <Check size={12} strokeWidth={3} />}
                    </button>

                    <span className="text-stone-300 font-black">›</span>

                    <button
                      type="button"
                      disabled={isWeatherFlipped || nextToFlip !== 'weather'}
                      onClick={nextToFlip === 'weather' ? () => flipStageCard('weather') : undefined}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                        isWeatherFlipped
                          ? 'bg-sky-600 text-white border-sky-700 shadow-2xs cursor-default'
                          : nextToFlip === 'weather'
                          ? 'bg-sky-50 text-sky-800 border-sky-300 ring-2 ring-sky-400/50 animate-pulse cursor-pointer'
                          : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>2. Meteo</span>
                      {isWeatherFlipped && <Check size={12} strokeWidth={3} />}
                    </button>

                    <span className="text-stone-300 font-black">›</span>

                    <button
                      type="button"
                      disabled={isStructureFlipped || nextToFlip !== 'structure'}
                      onClick={nextToFlip === 'structure' ? () => flipStageCard('structure') : undefined}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                        isStructureFlipped
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs cursor-default'
                          : nextToFlip === 'structure'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-2 ring-indigo-400/50 animate-pulse cursor-pointer'
                          : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>3. Struttura</span>
                      {isStructureFlipped && <Check size={12} strokeWidth={3} />}
                    </button>

                    <span className="text-stone-300 font-black">›</span>

                    <button
                      type="button"
                      disabled={isEventFlipped || nextToFlip !== 'event'}
                      onClick={nextToFlip === 'event' ? () => flipStageCard('event') : undefined}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                        isEventFlipped
                          ? 'bg-amber-600 text-white border-amber-700 shadow-2xs cursor-default'
                          : nextToFlip === 'event'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/50 animate-pulse cursor-pointer'
                          : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>4. Evento</span>
                      {isEventFlipped && <Check size={12} strokeWidth={3} />}
                    </button>
                  </div>
                </div>

                {/* GRIGLIA A 4 CARTE: DA SINISTRA VERSO DESTRA IN ORDINE SEQUENZIALE (1. Terreno, 2. Meteo, 3. Struttura, 4. Evento) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-stretch">
                  
                  {/* 1. CARTA FASE: TERRENO */}
                  <div className="w-full flex">
                    {!isTerrainFlipped ? (
                      <div
                        onClick={() => flipStageCard('terrain')}
                        className={`w-full min-h-[380px] rounded-3xl p-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 bg-gradient-to-b from-stone-900 via-stone-800 to-emerald-950 text-emerald-100 border-2 ${
                          nextToFlip === 'terrain'
                            ? 'border-emerald-400 shadow-lg ring-4 ring-emerald-400/30 scale-[1.02] -translate-y-1'
                            : 'border-stone-700 hover:border-emerald-500/70'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between border-b border-emerald-800/40 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                            Fase 1
                          </span>
                          <span className="text-[10px] font-bold text-emerald-300/70">Coperta</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 my-auto">
                          <div className="w-16 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-inner">
                            <Mountain size={34} />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-white uppercase tracking-wider">
                              Terreno & Suolo
                            </h4>
                            <p className="text-[11px] text-emerald-200/80 font-medium mt-1 max-w-[170px] leading-snug">
                              Fondo stradale, asperità e logorio del carico
                            </p>
                          </div>
                        </div>

                        <div className="w-full pt-3 border-t border-emerald-800/40">
                          <span className={`w-full py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                            nextToFlip === 'terrain'
                              ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100'
                              : 'bg-stone-800/60 border-stone-700 text-stone-400'
                          }`}>
                            {nextToFlip === 'terrain' ? (
                              <span>✨ Clicca per Girare</span>
                            ) : (
                              <span className="flex items-center gap-1"><Lock size={12} /> Clicca per sbloccare</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full min-h-[380px] rounded-3xl p-5 flex flex-col justify-between bg-emerald-50/70 border-2 border-emerald-300 text-stone-800 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 border-b border-emerald-200 pb-2.5 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-md">
                              1. Terreno
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                              <Check size={12} strokeWidth={3} /> Scoperta
                            </span>
                          </div>

                          <div className="flex items-start gap-2.5 mb-3">
                            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 shrink-0">
                              {React.createElement(stepItem.terrain?.icon || Mountain, { size: 24 })}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-stone-900 uppercase truncate">
                                {stepItem.terrain?.name}
                              </h4>
                              <span className="text-[10px] font-semibold text-emerald-700">Percorrenza Rotta</span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 italic leading-relaxed bg-white/80 p-2.5 rounded-xl border border-emerald-100 mb-3">
                            "{stepItem.terrain?.desc}"
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-emerald-200">
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                            Effetto Terreno:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                            <span className={`px-2 py-1 rounded-lg border ${
                              stepItem.terrainReport?.damage > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}>
                              Usura: {stepItem.terrainReport?.damage > 0 ? `-${stepItem.terrainReport.damage} HP` : '0 HP'}
                            </span>
                            <span className="px-2 py-1 rounded-lg border bg-amber-50 border-amber-200 text-amber-800">
                              {stepItem.terrainReport?.days || 0} GG
                            </span>
                          </div>
                          {stepItem.terrainReport?.goodsLost > 0 && (
                            <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-bold leading-tight">
                              📦 Persa {stepItem.terrainReport.goodsLost} merce ({stepItem.terrainReport.motivation})
                            </div>
                          )}
                          {stepItem.terrainReport?.mitigation && stepItem.terrainReport.mitigation.length > 0 && (
                            <div className="text-[10px] text-emerald-900 bg-emerald-100/80 border border-emerald-200 rounded-lg p-1.5 font-medium leading-tight">
                              🛡️ {stepItem.terrainReport.mitigation.join(' • ')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 2. CARTA FASE: METEO */}
                  <div className="w-full flex">
                    {!isWeatherFlipped ? (
                      <div
                        onClick={nextToFlip === 'weather' ? () => flipStageCard('weather') : undefined}
                        className={`w-full min-h-[380px] rounded-3xl p-4 flex flex-col justify-between items-center text-center transition-all duration-300 ${
                          nextToFlip === 'weather'
                            ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-sky-950 text-sky-100 border-2 border-sky-400 shadow-lg ring-4 ring-sky-400/30 scale-[1.02] -translate-y-1 cursor-pointer'
                            : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-500 border-2 border-slate-800 opacity-60 cursor-not-allowed select-none'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between border-b border-sky-800/40 pb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            nextToFlip === 'weather'
                              ? 'text-sky-400 bg-sky-950/80 border-sky-700/60'
                              : 'text-slate-500 bg-slate-900 border-slate-800'
                          }`}>
                            Fase 2
                          </span>
                          <span className="text-[10px] font-bold text-sky-300/70">
                            {nextToFlip === 'weather' ? 'Da girare' : 'Bloccata'}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-3 my-auto">
                          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-inner ${
                            nextToFlip === 'weather'
                              ? 'bg-sky-900/60 border-sky-500/40 text-sky-300'
                              : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}>
                            <CloudSun size={34} />
                          </div>
                          <div>
                            <h4 className={`text-base font-black uppercase tracking-wider ${
                              nextToFlip === 'weather' ? 'text-white' : 'text-slate-400'
                            }`}>
                              Meteo & Cielo
                            </h4>
                            <p className={`text-[11px] font-medium mt-1 max-w-[170px] leading-snug ${
                              nextToFlip === 'weather' ? 'text-sky-200/80' : 'text-slate-500'
                            }`}>
                              Condizioni atmosferiche e visibilità sul cammino
                            </p>
                          </div>
                        </div>

                        <div className="w-full pt-3 border-t border-sky-800/40">
                          {nextToFlip === 'weather' ? (
                            <span className="w-full py-2.5 px-3 rounded-xl border border-sky-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all bg-sky-500/30 text-sky-100">
                              <span>✨ Clicca per Girare</span>
                            </span>
                          ) : (
                            <span className="w-full py-2.5 px-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 bg-slate-900/80">
                              <Lock size={12} />
                              <span>Bloccata</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full min-h-[380px] rounded-3xl p-5 flex flex-col justify-between bg-sky-50/70 border-2 border-sky-300 text-stone-800 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 border-b border-sky-200 pb-2.5 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 border border-sky-300 text-sky-800 px-2 py-0.5 rounded-md">
                              2. Meteo
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-sky-700">
                              <Check size={12} strokeWidth={3} /> Scoperta
                            </span>
                          </div>

                          <div className="flex items-start gap-2.5 mb-3">
                            <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl border border-sky-200 shrink-0">
                              {React.createElement(stepItem.weather?.icon || Cloud, { size: 24 })}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-stone-900 uppercase truncate">
                                {stepItem.weather?.name}
                              </h4>
                              <span className="text-[10px] font-semibold text-sky-700">Clima della Tappa</span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 italic leading-relaxed bg-white/80 p-2.5 rounded-xl border border-sky-100 mb-3">
                            "{stepItem.weather?.desc}"
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-sky-200">
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                            Effetto Meteo:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                            <span className={`px-2 py-1 rounded-lg border ${
                              stepItem.weatherReport?.damage > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}>
                              {stepItem.weatherReport?.damage > 0 ? `-${stepItem.weatherReport.damage} HP` : '0 HP'}
                            </span>
                            <span className="px-2 py-1 rounded-lg border bg-amber-50 border-amber-200 text-amber-800">
                              +{stepItem.weatherReport?.days || 0} GG
                            </span>
                          </div>
                          {(stepItem.goodsLostWeather > 0 || (stepItem.weatherReport?.goodsLost || 0) > 0) && (
                            <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-bold leading-tight">
                              📦 Persa {stepItem.goodsLostWeather || stepItem.weatherReport?.goodsLost} merce ({stepItem.weather?.name})
                            </div>
                          )}
                          {stepItem.weatherReport?.mitigation && stepItem.weatherReport.mitigation.length > 0 && (
                            <div className="text-[10px] text-sky-900 bg-sky-100/80 border border-sky-200 rounded-lg p-1.5 font-medium leading-tight">
                              🛡️ {stepItem.weatherReport.mitigation.join(' • ')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 3. CARTA FASE: STRUTTURA */}
                  <div className="w-full flex">
                    {!isStructureFlipped ? (
                      <div
                        onClick={nextToFlip === 'structure' ? () => flipStageCard('structure') : undefined}
                        className={`w-full min-h-[380px] rounded-3xl p-4 flex flex-col justify-between items-center text-center transition-all duration-300 ${
                          nextToFlip === 'structure'
                            ? 'bg-gradient-to-b from-stone-900 via-slate-800 to-indigo-950 text-indigo-100 border-2 border-indigo-400 shadow-lg ring-4 ring-indigo-400/30 scale-[1.02] -translate-y-1 cursor-pointer'
                            : 'bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 text-stone-500 border-2 border-stone-800 opacity-60 cursor-not-allowed select-none'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between border-b border-indigo-800/40 pb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            nextToFlip === 'structure'
                              ? 'text-indigo-400 bg-indigo-950/80 border-indigo-700/60'
                              : 'text-stone-500 bg-stone-900 border-stone-800'
                          }`}>
                            Fase 3
                          </span>
                          <span className="text-[10px] font-bold text-indigo-300/70">
                            {nextToFlip === 'structure' ? 'Da girare' : 'Bloccata'}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-3 my-auto">
                          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-inner ${
                            nextToFlip === 'structure'
                              ? 'bg-indigo-900/60 border-indigo-500/40 text-indigo-300'
                              : 'bg-stone-900 border-stone-800 text-stone-600'
                          }`}>
                            <Landmark size={34} />
                          </div>
                          <div>
                            <h4 className={`text-base font-black uppercase tracking-wider ${
                              nextToFlip === 'structure' ? 'text-white' : 'text-stone-400'
                            }`}>
                              Struttura
                            </h4>
                            <p className={`text-[11px] font-medium mt-1 max-w-[170px] leading-snug ${
                              nextToFlip === 'structure' ? 'text-indigo-200/80' : 'text-stone-500'
                            }`}>
                              Insediamenti, santuari, villaggi o sentieri aperti
                            </p>
                          </div>
                        </div>

                        <div className="w-full pt-3 border-t border-indigo-800/40">
                          {nextToFlip === 'structure' ? (
                            <span className="w-full py-2.5 px-3 rounded-xl border border-indigo-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all bg-indigo-500/30 text-indigo-100">
                              <span>✨ Clicca per Girare</span>
                            </span>
                          ) : (
                            <span className="w-full py-2.5 px-3 rounded-xl border border-stone-800 text-xs font-bold text-stone-500 flex items-center justify-center gap-1.5 bg-stone-900/80">
                              <Lock size={12} />
                              <span>Bloccata</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full min-h-[380px] rounded-3xl p-5 flex flex-col justify-between bg-indigo-50/70 border-2 border-indigo-300 text-stone-800 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 border-b border-indigo-200 pb-2.5 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 border border-indigo-300 text-indigo-800 px-2 py-0.5 rounded-md">
                              3. Struttura
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700">
                              <Check size={12} strokeWidth={3} /> Scoperta
                            </span>
                          </div>

                          <div className="flex items-start gap-2.5 mb-3">
                            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                              {React.createElement(stepItem.structureData?.icon || stepItem.structureReport?.icon || Landmark, { size: 24 })}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-stone-900 uppercase truncate">
                                {stepItem.structureData?.name || stepItem.structureReport?.name || 'Sentiero Selvaggio'}
                              </h4>
                              <span className="text-[10px] font-semibold text-indigo-700">Punto d'Interesse</span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-indigo-100 mb-3">
                            "{stepItem.structureData?.description || stepItem.structureReport?.description || 'Il sentiero prosegue senza costruzioni o templi.'}"
                          </p>
                        </div>

                        {activeStructure ? (
                          <div className="flex flex-col gap-2 pt-2 border-t border-indigo-200">
                            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-wider">
                              Scegli il Servizio:
                            </span>
                            <div className="flex flex-col gap-1.5">
                              {activeStructure.data.options?.map((opt: any) => (
                                <button
                                  key={opt.id}
                                  onClick={() => resolveStructure(opt.id!)}
                                  className="p-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 rounded-xl transition-all text-left cursor-pointer active:scale-98 shadow-2xs group/opt"
                                >
                                  <div className="text-xs font-black text-stone-900 group-hover/opt:text-white uppercase leading-tight">
                                    {opt.label}
                                  </div>
                                  <div className="text-[10px] text-stone-500 group-hover/opt:text-indigo-100 font-medium">
                                    {opt.sub}
                                  </div>
                                </button>
                              ))}
                              <button
                                onClick={() => resolveStructure('skip')}
                                className="text-[10px] font-bold text-stone-500 hover:text-stone-800 text-center py-1 cursor-pointer underline"
                              >
                                Riparti senza fermarti
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 pt-2 border-t border-indigo-200">
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                              Esito Struttura:
                            </span>
                            <div className="text-xs text-indigo-950 bg-white/90 border border-indigo-200 rounded-xl p-2.5 font-semibold leading-relaxed">
                              {stepItem.structureReport?.outcome || (stepItem.structureData?.id === 'none' ? 'Nessun rifugio: carovana prosegue spedita.' : stepItem.structureData?.description)}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* 4. CARTA FASE: EVENTO */}
                  <div className="w-full flex">
                    {!isEventFlipped ? (
                      <div
                        onClick={nextToFlip === 'event' ? () => flipStageCard('event') : undefined}
                        className={`w-full min-h-[380px] rounded-3xl p-4 flex flex-col justify-between items-center text-center transition-all duration-300 ${
                          nextToFlip === 'event'
                            ? 'bg-gradient-to-b from-stone-900 via-stone-800 to-amber-950 text-amber-100 border-2 border-amber-400 shadow-lg ring-4 ring-amber-400/30 scale-[1.02] -translate-y-1 cursor-pointer'
                            : 'bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 text-stone-500 border-2 border-stone-800 opacity-60 cursor-not-allowed select-none'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between border-b border-amber-800/40 pb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            nextToFlip === 'event'
                              ? 'text-amber-400 bg-amber-950/80 border-amber-700/60'
                              : 'text-stone-500 bg-stone-900 border-stone-800'
                          }`}>
                            Fase 4
                          </span>
                          <span className="text-[10px] font-bold text-amber-300/70">
                            {nextToFlip === 'event' ? 'Da girare' : 'Bloccata'}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-3 my-auto">
                          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-inner ${
                            nextToFlip === 'event'
                              ? 'bg-amber-900/60 border-amber-500/40 text-amber-300'
                              : 'bg-stone-900 border-stone-800 text-stone-600'
                          }`}>
                            <Ghost size={34} />
                          </div>
                          <div>
                            <h4 className={`text-base font-black uppercase tracking-wider ${
                              nextToFlip === 'event' ? 'text-white' : 'text-stone-400'
                            }`}>
                              Evento
                            </h4>
                            <p className={`text-[11px] font-medium mt-1 max-w-[170px] leading-snug ${
                              nextToFlip === 'event' ? 'text-amber-200/80' : 'text-stone-500'
                            }`}>
                              Incontri casuali, pericoli o bizzarrie sulla rotta
                            </p>
                          </div>
                        </div>

                        <div className="w-full pt-3 border-t border-amber-800/40">
                          {nextToFlip === 'event' ? (
                            <span className="w-full py-2.5 px-3 rounded-xl border border-amber-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all bg-amber-500/30 text-amber-100">
                              <span>✨ Clicca per Girare</span>
                            </span>
                          ) : (
                            <span className="w-full py-2.5 px-3 rounded-xl border border-stone-800 text-xs font-bold text-stone-500 flex items-center justify-center gap-1.5 bg-stone-900/80">
                              <Lock size={12} />
                              <span>Bloccata</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full min-h-[380px] rounded-3xl p-5 flex flex-col justify-between bg-amber-50/70 border-2 border-amber-300 text-stone-800 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2.5 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 border border-amber-300 text-amber-800 px-2 py-0.5 rounded-md">
                              4. Evento
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
                              <Check size={12} strokeWidth={3} /> Scoperta
                            </span>
                          </div>

                          <div className="flex items-start gap-2.5 mb-3">
                            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
                              {stepItem.eventData?.name === 'Nessun Evento'
                                ? <Smile size={24} />
                                : React.createElement(stepItem.eventData?.icon || Ghost, { size: 24 })}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-stone-900 uppercase truncate">
                                {stepItem.eventData?.name || 'Nessun Evento'}
                              </h4>
                              <span className="text-[10px] font-semibold text-amber-700">Imprevisto della Rotta</span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-100 mb-3">
                            "{stepItem.eventData?.description || 'Nessun particolare ostacolo incontrato lungo la strada.'}"
                          </p>
                        </div>

                        {activeEncounter && !encounterResolved ? (
                          <div className="flex flex-col gap-2 pt-2 border-t border-amber-200">
                            <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">
                              Reazione all'Incontro:
                            </span>
                            <div className="flex flex-col gap-1.5">
                              {activeEncounter.data.options?.map((opt: any) => (
                                <button
                                  key={opt.id}
                                  onClick={() => resolveEncounter(opt.id!)}
                                  className="p-2 bg-white hover:bg-amber-600 hover:text-white border border-amber-200 hover:border-amber-600 rounded-xl transition-all text-left cursor-pointer active:scale-98 shadow-2xs group/opt"
                                >
                                  <div className="text-xs font-black text-stone-900 group-hover/opt:text-white uppercase leading-tight">
                                    {opt.label}
                                  </div>
                                  <div className="text-[10px] text-stone-500 group-hover/opt:text-amber-100 font-medium">
                                    {opt.sub}
                                  </div>
                                </button>
                              ))}
                              {activeEncounter.data.options?.some((opt: any) => opt.id === 'skip') && (
                                <button
                                  onClick={() => resolveEncounter('skip')}
                                  className="text-[10px] font-bold text-stone-500 hover:text-stone-800 text-center py-1 cursor-pointer underline"
                                >
                                  Ignora e prosegui
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 pt-2 border-t border-amber-200">
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                              Esito Evento:
                            </span>
                            <div className="text-xs text-stone-900 bg-white/90 border border-amber-200 rounded-xl p-2.5 font-semibold leading-relaxed">
                              {stepItem.eventReport?.outcome || (stepItem.eventData?.name === 'Nessun Evento' ? 'Tragitto trascorso in totale serenità.' : stepItem.eventData?.description)}
                            </div>
                            {stepItem.goodsLostEvent > 0 && (
                              <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-bold">
                                📦 Persa {stepItem.goodsLostEvent} merce ({stepItem.eventData?.name || 'Evento'})
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                </div>

                {/* BARRA AZIONE FINALE DELLA TAPPA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 pt-5">
                  {!allFlipped ? (
                    <>
                      <div className="text-xs text-stone-500 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span>Gira le carte da sinistra verso destra cliccandoci sopra per scoprire le fasi</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={flipAllStageCards}
                          className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
                        >
                          Gira Tutte
                        </button>
                        <button
                          type="button"
                          onClick={flipNextStageCard}
                          className="flex-1 sm:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <span>Gira Prossima Carta</span>
                          <ArrowRight size={14} />
                          <span className="text-[10px] text-amber-100 font-normal ml-1 hidden sm:inline">(Spazio)</span>
                        </button>
                      </div>
                    </>
                  ) : activeStructure ? (
                    <div className="w-full flex items-center justify-between text-xs text-indigo-800 font-bold bg-indigo-50 border border-indigo-200 p-3 rounded-2xl">
                      <span>Effettua una scelta alla Struttura (Fase 3) per poter proseguire il viaggio.</span>
                    </div>
                  ) : activeEncounter && !encounterResolved ? (
                    <div className="w-full flex items-center justify-between text-xs text-amber-900 font-bold bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                      <span>Scegli come reagire all'Incontro (Fase 4) per poter proseguire il viaggio.</span>
                    </div>
                  ) : (
                    /* TUTTE E 4 LE FASI GIRATE E RISOLTE */
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs font-bold text-stone-600">
                        <span className="text-stone-400 uppercase text-[10px]">Bilancio Tappa #{journeyStep + 1}:</span>
                        <span className={stepItem.totalDamage > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {stepItem.totalDamage > 0 ? `-${stepItem.totalDamage} HP` : '0 HP'}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-700">+{stepItem.stepDays} GG</span>
                        {stepItem.goodsLost > 0 && (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-rose-600">-{stepItem.goodsLost} Merci</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={completeCurrentStep}
                        className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ml-auto"
                      >
                        {journeyStep + 1 < (currentQuest?.length || 0) ? (
                          <>
                            <span>Completa Tappa #{journeyStep + 1} e Prosegui</span>
                            <ArrowRight size={16} />
                          </>
                        ) : (
                          <>
                            <Flag size={16} />
                            <span>Entra alle Porte di {currentQuest?.destination}!</span>
                          </>
                        )}
                        <span className="text-[10px] text-emerald-100 font-normal ml-1">(o premi Spazio / Invio)</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()
        ) : (

          /* CASO: Pronti a Esplorare la Tappa Corrente (READY) */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center gap-6"
          >
            <div className="w-18 h-18 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
              <Compass size={36} />
            </div>

            <div>
              <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-widest rounded-full border border-stone-200">
                Tappa #{journeyStep + 1} di {currentQuest?.length}
              </span>
              <h3 className="text-2xl font-black text-stone-900 mt-2 uppercase tracking-tight">
                La Strada Ti Attende
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 font-medium">
                Avanza lungo la rotta per scoprire le condizioni atmosferiche del cammino, il terreno, le strutture e gli eventi imprevisti.
              </p>
            </div>

            {/* Indicatore Dotazioni */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
              <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-600">
                🛡️ {player.armour > 0 ? `Armatura: +${player.armour} mitigazione` : 'Nessuna armatura'}
              </span>
              <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-600">
                🪓 Riparazioni: {player.consumables?.repairKits || 0}
              </span>
              <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-600">
                🏮 Olio Lanterna: {player.consumables?.lanternOil || 0}
              </span>
            </div>

            {/* Grande Pulsante d'Azione */}
            <button 
              onClick={resolveStep}
              className="w-full max-w-sm py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Dices size={20} />
                <span>Esplora Tappa #{journeyStep + 1}</span>
              </div>
              <span className="text-[10px] text-amber-100 font-normal opacity-90">(o premi Spazio / Invio)</span>
            </button>

            {/* Ultima Tappa Superata (Riepilogo Rapido) */}
            {journeyStep > 0 && journeyHistory[journeyStep - 1] && (
              <div className="w-full max-w-md border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-400 uppercase text-[10px]">Ultima tappa completata:</span>
                <button 
                  onClick={() => setInspectedIcon({ step: journeyStep - 1, type: 'weather' })}
                  className="text-amber-600 hover:text-amber-700 font-bold underline cursor-pointer text-xs"
                >
                  Tappa #{journeyStep}: {journeyHistory[journeyStep - 1].weather.name} ({journeyHistory[journeyStep - 1].totalDamage > 0 ? `-${journeyHistory[journeyStep - 1].totalDamage} HP` : '0 danni'})
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

    </motion.div>
  );
}
