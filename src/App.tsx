/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { PixelCrate } from './components/PixelIcon';
import GameManual from './components/GameManual';
import { ItemDetailModal } from './components/ItemDetailModal';
import { DepartureModal } from './components/DepartureModal';
import { TopBar } from './components/TopBar';
import { BoardView } from './components/BoardView';
import { EmporioView } from './components/EmporioView';
import { BlacksmithView } from './components/BlacksmithView';
import { TavernView } from './components/TavernView';
import { GuildView } from './components/GuildView';
import { JournalView } from './components/JournalView';
import { ResultsView } from './components/ResultsView';
import { GameOverView } from './components/GameOverView';
import { StartView } from './components/StartView';
import { JourneyView } from './components/JourneyView';
import { GameState, PlayerState, Quest, Badge, ItemDetail } from './types';

import {
  EVENT_TABLE,
  STRUCTURE_TABLE,
  WEATHER_TABLE,
  CAVERN_WEATHER,
  TERRAIN_TABLE,
  BADGES,
  TIPS,
  SHOP_ITEMS,
  generateTownName,
  INITIAL_TOWNS
} from './gameMechanics';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [totalDefeats, setTotalDefeats] = useState<number>(() => {
    const saved = localStorage.getItem('oakhaven_defeats');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('oakhaven_defeats', totalDefeats.toString());
  }, [totalDefeats]);

  const [player, setPlayer] = useState<PlayerState>({
    gold: 100,
    pr: 0,
    hp: 20,
    hpMax: 20,
    goods: 0,
    capacity: 10,
    armour: 0,
    daysPassed: 0,
    upgrades: [],
    badges: [],
    consumables: {
      repairKits: 0,
      lanternOil: 0
    },
    currentLocation: INITIAL_TOWNS[0],
    questHistory: [],
    stats: {
      totalDays: 0,
      completedQuests: 0,
      totalGoldEarned: 100,
      monstersFaced: 0,
      daysInTavern: 0,
      totalGoodsDelivered: 0,
      deathReason: ''
    }
  });

  const resetGame = () => {
    setPlayer({
      gold: 100,
      pr: 0,
      hp: 20,
      hpMax: 20,
      goods: 0,
      capacity: 10,
      armour: 0,
      daysPassed: 0,
      upgrades: [],
      badges: [],
      consumables: {
        repairKits: 0,
        lanternOil: 0
      },
      currentLocation: INITIAL_TOWNS[0],
      questHistory: [],
      stats: {
        totalDays: 0,
        completedQuests: 0,
        totalGoldEarned: 100,
        monstersFaced: 0,
        daysInTavern: 0,
        totalGoodsDelivered: 0,
        deathReason: ''
      }
    });
    setLog([]);
    setJourneyHistory([]);
    setJourneyStep(0);
    setStageHeroPhase('READY');
    setRevealedStageCards({ terrain: false, weather: false, structure: false, event: false });
    appliedCardEffectsRef.current = { terrain: false, weather: false, structure: false, event: false };
    setEncounterResolved(false);
    setActiveEncounter(null);
    setActiveStructure(null);
    setInspectedIcon(null);
    setCurrentQuest(null);
    setDepartureConfirmationQuest(null);
    setGameState('START');
  };

  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [departureConfirmationQuest, setDepartureConfirmationQuest] = useState<Quest | null>(null);
  const [questOptions, setQuestOptions] = useState<Quest[]>([]);
  const [journeyStep, setJourneyStep] = useState(0);
  const [log, setLog] = useState<{ 
    id: string, 
    message: string, 
    type: 'damage' | 'info' | 'success' | 'warning',
    motivation?: string,
    mitigation?: string[],
    stepDays?: number,
    totalDamage?: number,
    goodsLost?: number,
    goodsLostMotivation?: string,
    goodsLossNote?: string,
    armorBonus?: number,
    totalDaysPassed?: number,
    detailedDays?: { weather?: number, terrain?: number, event?: number, structure?: number },
    detailedDamage?: { weather?: number, terrain?: number, event?: number, structure?: number },
    weatherReport?: { name: string, damage: number, days: number, mitigation: string[], desc?: string },
    terrainReport?: { name: string, damage: number, days: number, goodsLost: number, motivation: string, mitigation: string[], desc?: string },
    eventReport?: { name: string, description: string, outcome?: string },
    structureReport?: { name: string, description: string, outcome?: string, icon?: any }
  }[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [activeEncounter, setActiveEncounter] = useState<any | null>(null);
  const [activeStructure, setActiveStructure] = useState<any | null>(null);
  const [showEncounterCard, setShowEncounterCard] = useState<'structure' | 'event' | boolean>(false);
  const [currentRolls, setCurrentRolls] = useState<{ weather?: number, terrain?: number, event?: number, structure?: number }>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [itemDetail, setItemDetail] = useState<any | null>(null);
  const [journeyHistory, setJourneyHistory] = useState<(any | null)[]>([]);
  const [inspectedIcon, setInspectedIcon] = useState<{ step: number; type: 'weather' | 'terrain' | 'structure' | 'event' } | null>(null);
  const [stageHeroPhase, setStageHeroPhase] = useState<'READY' | 'ACTIVE'>('READY');
  const [revealedStageCards, setRevealedStageCards] = useState<{
    terrain: boolean;
    weather: boolean;
    structure: boolean;
    event: boolean;
  }>({ terrain: false, weather: false, structure: false, event: false });
  const appliedCardEffectsRef = useRef<{
    terrain: boolean;
    weather: boolean;
    structure: boolean;
    event: boolean;
  }>({ terrain: false, weather: false, structure: false, event: false });
  const [encounterResolved, setEncounterResolved] = useState<boolean>(false);
  const [selectedJournalQuest, setSelectedJournalQuest] = useState<any | null>(null);
  const [currentTip, setCurrentTip] = useState("");

  const applyStageCardEffect = (phase: 'terrain' | 'weather' | 'structure' | 'event', stepItem: any) => {
    if (!stepItem) return;

    if (phase === 'terrain' && !appliedCardEffectsRef.current.terrain) {
      appliedCardEffectsRef.current.terrain = true;
      const dmg = stepItem.terrainReport?.damage || 0;
      const days = stepItem.terrainReport?.days || 0;
      const goodsLost = stepItem.goodsLostTerrain ?? stepItem.terrainReport?.goodsLost ?? 0;

      if (stepItem.terrain?.name === 'Caverna' && player.upgrades.includes('lantern') && player.consumables.lanternOil > 0) {
        setPlayer(p => ({
          ...p,
          consumables: { ...p.consumables, lanternOil: Math.max(0, p.consumables.lanternOil - 1) }
        }));
      }

      setPlayer(prev => {
        const newHp = Math.max(0, Math.min(prev.hpMax, prev.hp - dmg));
        let deathReason = prev.stats.deathReason;
        if (newHp <= 0 && !deathReason) {
          deathReason = `Terreno impervio (${stepItem.terrain?.name || 'Terreno'}): Il carretto è andato distrutto`;
        }
        return {
          ...prev,
          hp: newHp,
          daysPassed: prev.daysPassed + days,
          goods: Math.max(0, prev.goods - goodsLost),
          stats: {
            ...prev.stats,
            totalDays: prev.stats.totalDays + days,
            deathReason: deathReason
          }
        };
      });
    }

    if (phase === 'weather' && !appliedCardEffectsRef.current.weather) {
      appliedCardEffectsRef.current.weather = true;
      const dmg = stepItem.weatherReport?.damage || 0;
      const days = stepItem.weatherReport?.days || 0;
      const goodsLost = stepItem.goodsLostWeather || 0;

      if (stepItem.weather?.name === 'Nebbia' && player.upgrades.includes('lantern') && player.consumables.lanternOil > 0) {
        setPlayer(p => ({
          ...p,
          consumables: { ...p.consumables, lanternOil: Math.max(0, p.consumables.lanternOil - 1) }
        }));
      }

      setPlayer(prev => {
        const newHp = Math.max(0, Math.min(prev.hpMax, prev.hp - dmg));
        let deathReason = prev.stats.deathReason;
        if (newHp <= 0 && !deathReason) {
          deathReason = `Meteo avverso (${stepItem.weather?.name || 'Meteo'}): Il carretto è andato distrutto`;
        }
        return {
          ...prev,
          hp: newHp,
          daysPassed: prev.daysPassed + days,
          goods: Math.max(0, prev.goods - goodsLost),
          stats: {
            ...prev.stats,
            totalDays: prev.stats.totalDays + days,
            deathReason: deathReason
          }
        };
      });
    }

    if (phase === 'structure' && !appliedCardEffectsRef.current.structure) {
      appliedCardEffectsRef.current.structure = true;
      const structDmg = stepItem.detailedDamage?.structure || 0;
      const isShrine = stepItem.structureData?.id === 'shrine';

      setPlayer(prev => {
        const newHp = Math.max(0, Math.min(prev.hpMax, prev.hp - structDmg));
        return {
          ...prev,
          hp: newHp,
          pr: isShrine ? prev.pr + 1 : prev.pr
        };
      });
    }

    if (phase === 'event' && !appliedCardEffectsRef.current.event) {
      appliedCardEffectsRef.current.event = true;
      const eventDmg = stepItem.detailedDamage?.event || 0;
      const eventDays = stepItem.detailedDays?.event || 0;
      const goodsLost = stepItem.goodsLostEvent || 0;
      const isMonster = stepItem.eventData?.id === 'mostri' || stepItem.eventData?.name === 'Mostri';

      setPlayer(prev => {
        const newHp = Math.max(0, Math.min(prev.hpMax, prev.hp - eventDmg));
        let deathReason = prev.stats.deathReason;
        if (newHp <= 0 && !deathReason) {
          deathReason = `L'evento (${stepItem.eventData?.name || 'Evento'}) ha inflitto il colpo di grazia al carretto`;
        }
        return {
          ...prev,
          hp: newHp,
          daysPassed: prev.daysPassed + eventDays,
          goods: Math.max(0, prev.goods - goodsLost),
          stats: {
            ...prev.stats,
            totalDays: prev.stats.totalDays + eventDays,
            monstersFaced: isMonster ? prev.stats.monstersFaced + 1 : prev.stats.monstersFaced,
            deathReason: deathReason
          }
        };
      });
    }
  };

  const flipStageCard = (phase: 'terrain' | 'weather' | 'structure' | 'event') => {
    const stepItem = journeyHistory[journeyStep];
    if (!stepItem) return;

    // Strict sequential rule: a phase cannot be flipped until previous phases are revealed
    if (phase === 'terrain') {
      if (revealedStageCards.terrain) return;
    } else if (phase === 'weather') {
      if (!revealedStageCards.terrain || revealedStageCards.weather) return;
    } else if (phase === 'structure') {
      if (!revealedStageCards.weather || revealedStageCards.structure) return;
    } else if (phase === 'event') {
      if (!revealedStageCards.structure || revealedStageCards.event) return;
    }

    applyStageCardEffect(phase, stepItem);

    setRevealedStageCards(prev => ({
      ...prev,
      [phase]: true
    }));
  };

  const flipNextStageCard = () => {
    if (!revealedStageCards.terrain) flipStageCard('terrain');
    else if (!revealedStageCards.weather) flipStageCard('weather');
    else if (!revealedStageCards.structure) flipStageCard('structure');
    else if (!revealedStageCards.event) flipStageCard('event');
  };

  const flipAllStageCards = () => {
    const stepItem = journeyHistory[journeyStep];
    const allPhases: ('terrain' | 'weather' | 'structure' | 'event')[] = ['terrain', 'weather', 'structure', 'event'];
    allPhases.forEach(p => {
      applyStageCardEffect(p, stepItem);
    });
    setRevealedStageCards({ terrain: true, weather: true, structure: true, event: true });
  };

  const completeCurrentStep = () => {
    setJourneyStep(prev => prev + 1);
    setStageHeroPhase('READY');
    setRevealedStageCards({ terrain: false, weather: false, structure: false, event: false });
    appliedCardEffectsRef.current = { terrain: false, weather: false, structure: false, event: false };
    setActiveEncounter(null);
    setActiveStructure(null);
    setEncounterResolved(false);
  };

  useEffect(() => {
    if (gameState === 'BOARD') {
      const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
      setCurrentTip(randomTip);
    }
  }, [gameState]);

  // Drag Scroll Logic for Commercial Route
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Auto-scroll track smoothly to the active step or destination
  useEffect(() => {
    if (gameState === 'JOURNEY' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const stepWidth = 344;
      const townOffset = 280;
      
      let targetLeft = 0;
      if (journeyStep >= (currentQuest?.length || 0)) {
        targetLeft = container.scrollWidth;
      } else {
        const cardCenter = townOffset + (journeyStep * stepWidth) + (stepWidth / 2);
        targetLeft = Math.max(0, cardCenter - (container.clientWidth / 2));
      }

      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
    }
  }, [journeyStep, gameState, currentQuest?.length]);

  // Keyboard shortcuts (Space / Enter / Escape) for instant fluid progression
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Escape') {
        if (departureConfirmationQuest !== null) {
          e.preventDefault();
          setDepartureConfirmationQuest(null);
          return;
        }
        if (inspectedIcon !== null) {
          e.preventDefault();
          setInspectedIcon(null);
        }
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (gameState === 'JOURNEY') {
          if (inspectedIcon !== null) {
            e.preventDefault();
            setInspectedIcon(null);
            return;
          }
          if (journeyStep < (currentQuest?.length || 0)) {
            if (isRolling) return;
            if (stageHeroPhase === 'READY') {
              e.preventDefault();
              resolveStep();
            } else if (stageHeroPhase === 'ACTIVE') {
              if (!revealedStageCards.terrain) {
                e.preventDefault();
                flipStageCard('terrain');
              } else if (!revealedStageCards.weather) {
                e.preventDefault();
                flipStageCard('weather');
              } else if (!revealedStageCards.structure) {
                e.preventDefault();
                flipStageCard('structure');
              } else if (!revealedStageCards.event) {
                e.preventDefault();
                flipStageCard('event');
              } else if (!activeStructure && (!activeEncounter || encounterResolved)) {
                e.preventDefault();
                completeCurrentStep();
              }
            }
          } else if (!isRolling) {
            e.preventDefault();
            setGameState('RESULTS');
          }
        } else if (gameState === 'RESULTS') {
          e.preventDefault();
          completeQuest();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, journeyStep, isRolling, activeEncounter, activeStructure, inspectedIcon, currentQuest, departureConfirmationQuest, stageHeroPhase, encounterResolved, revealedStageCards]);

  const rewards = useMemo(() => {
    if (!currentQuest) return null;
    
    const days = player.daysPassed;
    let pr = 0;
    let prReason = "";
    
    const targetHigh = currentQuest.type === 'Breve' ? 6 : currentQuest.type === 'Media' ? 10 : 16;
    const targetLow = currentQuest.type === 'Breve' ? 12 : currentQuest.type === 'Media' ? 20 : 32;

    // CHECK FOR FAILURE: Insufficient Goods
    if (player.goods < currentQuest.goods) {
      return {
        isFailure: true,
        reason: "Carico Insufficiente",
        motivation: `Hai raggiunto ${currentQuest.destination} con solo ${player.goods} casse, ma ne erano richieste almeno ${currentQuest.goods}. La consegna è stata rifiutata.`,
        pr: currentQuest.type === 'Lunga' ? -10 : 0,
        tag: "Inaffidabile"
      };
    }

    let tag = "Viaggiatore";

    if (currentQuest.type === 'Breve') {
      if (days <= 6) {
        pr = 10;
        tag = "Corriere Fulmineo";
        prReason = `Eccellente! Hai raggiunto la destinazione in soli ${days} giorni (Termine bonus: 6gg).`;
      } else if (days <= 12) {
        pr = 5;
        tag = "Affidabile";
        prReason = `Ben fatto! Hai consegnato le merci in ${days} giorni (Entro il limite: 12gg).`;
      } else {
        pr = 0;
        tag = "In Ritardo";
        prReason = `Consegna in ritardo (${days} giorni). Hai superato il termine massimo di 12 giorni.`;
      }
    } else if (currentQuest.type === 'Media') {
      if (days <= 10) {
        pr = 20;
        tag = "Mercante d'Elite";
        prReason = `Straordinario! Consegna rapida in ${days} giorni (Termine bonus: 10gg).`;
      } else if (days <= 20) {
        pr = 10;
        tag = "Professionista";
        prReason = `Ottimo lavoro! Hai consegnato le merci in ${days} giorni (Entro il limite: 20gg).`;
      } else {
        pr = 0;
        tag = "Inefficiente";
        prReason = `Troppo tempo impiegato (${days} giorni). Hai superato il limite di 20 giorni.`;
      }
    } else { // Lunga
      if (days <= 16) {
        pr = 40;
        tag = "Leggenda delle Strade";
        prReason = `Incredibile! Una traversata leggendaria in ${days} giorni (Termine bonus: 16gg).`;
      } else if (days <= 32) {
        pr = 20;
        tag = "Viaggiatore Esperto";
        prReason = `Molto bene! Hai completato il lungo viaggio in ${days} giorni (Entro il limite: 32gg).`;
      } else {
        pr = 0;
        tag = "Viandante Sperduto";
        prReason = `Viaggio troppo lungo (${days} giorni). Hai superato il limite massimo di 32 giorni per questa spedizione.`;
      }
    }

    // Updated Reward Calculation: (Quantity * 10) * Multiplier
    const baseValuePerUnit = 10;
    let goodsVal = baseValuePerUnit;
    if (player.badges.includes('mercante_onesto')) goodsVal += 2;
    
    const questReq = currentQuest.goods;

    let multiplierBoost = player.badges.includes('eroe_strade') ? 2 : 0;
    const goldFromQuest = currentQuest.reward || Math.floor((questReq * goodsVal) * (currentQuest.goldMultiplier + multiplierBoost));
    
    // Surplus goods (if any) are kept by the player for now unless they trade them
    const totalGold = goldFromQuest;

    return {
      isFailure: false,
      totalGold,
      pr,
      goodsDelivered: questReq, // Only the required goods are considered "delivered" for the quest
      goldQuest: goldFromQuest,
      goldSurplus: 0,
      prReason,
      targetHigh,
      targetLow,
      tag
    };
  }, [currentQuest, player.daysPassed, player.goods, player.badges]);

  // --- HELPERS ---

  const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;

  const getNewQuests = (location: string) => {
    const types: ('Breve' | 'Media' | 'Lunga')[] = ['Breve', 'Media', 'Lunga'];
    
    return types.map((type, index) => {
      let length = 0;
      const d3 = Math.ceil(rollDice(6) / 2);
      if (type === 'Breve') length = d3 + 1;
      else if (type === 'Media') length = d3 + 4;
      else if (type === 'Lunga') length = d3 + 7;

      let multi = type === 'Breve' ? 2 : type === 'Media' ? 3 : 4;
      let goods = rollDice(10);
      let dest = generateTownName();
      // Ensure destination isn't the same as current location (or other quest destinations in the same batch)
      while (dest === location) {
        dest = generateTownName();
      }
      return { type, length, goods, goldMultiplier: multi, destination: dest };
    });
  };

  const startNewGame = () => {
    const startTown = generateTownName();
    setPlayer({
      gold: 100,
      pr: 0,
      hp: 20,
      hpMax: 20,
      goods: 0,
      capacity: 10,
      armour: 0,
      daysPassed: 0,
      upgrades: [],
      badges: [],
      consumables: { repairKits: 0, lanternOil: 0 },
      currentLocation: startTown,
      questHistory: [],
      stats: {
        totalDays: 0,
        completedQuests: 0,
        totalGoldEarned: 100,
        monstersFaced: 0,
        daysInTavern: 0,
        totalGoodsDelivered: 0,
        deathReason: ''
      }
    });
    const quests = getNewQuests(startTown);
    setQuestOptions(quests);
    setGameState('BOARD');
  };

  const restAtTavern = () => {
    if (player.gold >= 5) {
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold - 5,
        daysPassed: prev.daysPassed + 1,
        stats: {
          ...prev.stats,
          totalDays: prev.stats.totalDays + 1,
          daysInTavern: prev.stats.daysInTavern + 1
        }
      }));
      const newQuests = getNewQuests(player.currentLocation);
      setQuestOptions(newQuests);
      setNotification("Hai riposato un giorno nella Taverna. Nuove quest sono arrivate!");
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification("Non hai abbastanza Oro!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const acceptQuest = (quest: Quest) => {
    if (player.hp <= 0) return;
    if (player.goods < quest.goods) {
      setNotification(`Non hai abbastanza merci! Hai bisogno di almeno ${quest.goods} unità.`);
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setCurrentQuest({ ...quest, origin: player.currentLocation });
    setPlayer(prev => ({ ...prev, daysPassed: 0 }));
    setJourneyStep(0);
    setInspectedIcon(null);
    setStageHeroPhase('READY');
    setRevealedStageCards({ weather: false, terrain: false, structure: false, event: false });
    setEncounterResolved(false);
    setActiveEncounter(null);
    setActiveStructure(null);
    setJourneyHistory(new Array(quest.length).fill(null));
    setLog([{ id: Date.now().toString(), message: `Viaggio verso ${quest.destination} iniziato con ${player.goods} unità di merce!`, type: 'info' }]);
    setGameState('JOURNEY');
  };

  const resolveStep = async () => {
    if (!currentQuest) return;

    // Reset previous interactions at the start of a new roll
    setActiveStructure(null);
    setActiveEncounter(null);
    setShowEncounterCard(false);
    setInspectedIcon(null);
    setEncounterResolved(false);
    setRevealedStageCards({ terrain: false, weather: false, structure: false, event: false });
    appliedCardEffectsRef.current = { terrain: false, weather: false, structure: false, event: false };

    setIsRolling(true);

    // Weather Phase
    const weatherRoll = rollDice(6);
    const terrainIndex = rollDice(12) - 1;
    const eventRoll = rollDice(7);
    const structureRoll = rollDice(10);

    setCurrentRolls({ weather: weatherRoll, terrain: terrainIndex + 1, event: eventRoll, structure: structureRoll });

    setTimeout(() => {
      setIsRolling(false);
      calculateStepEffects(weatherRoll, terrainIndex, eventRoll, structureRoll);
    }, 350);
  };

  const calculateStepEffects = (wRoll: number, tIdx: number, eRoll: number, sRoll: number) => {
    const terrain = TERRAIN_TABLE[tIdx];
    const weather = terrain.name === 'Caverna' ? CAVERN_WEATHER[wRoll - 1] : WEATHER_TABLE[wRoll - 1];
    const event = EVENT_TABLE[eRoll - 1];
    const structure = STRUCTURE_TABLE[sRoll - 1];
    
    // Initializers
    const weatherReport = { name: weather.name, damage: weather.hpDamage, days: weather.extraDays, mitigation: [] as string[] };
    const terrainReport = { name: terrain.name, damage: terrain.damage, days: terrain.time, goodsLost: 0, motivation: "", mitigation: [] as string[], desc: terrain.desc };
    const eventReport = { name: event.name, description: event.description, outcome: "" };
    const structureReport = { name: structure.name, description: structure.description, outcome: "", icon: structure.icon };
    
    let eventDmg = 0;
    let structDmg = 0;
    let goodsLostWeather = 0;
    let goodsLostTerrain = 0;
    let goodsLostEvent = 0;
    let goodsLostStructure = 0;

    // Apply Upgrades/Badges for armour
    let finalArmour = player.armour;
    let tempArmour = 0; // Bonus from accampamento militare
    
    // Apply IMMEDIATE Structure Effects
    if (structure.id === 'camp') {
      tempArmour = 2;
      structureReport.outcome = "Pattuglie militari proteggono la zona: +2 Difesa.";
    }

    if (player.upgrades.includes('steel_frame')) finalArmour = 4;
    else if (player.upgrades.includes('iron_plates')) finalArmour = 2;
    else if (player.upgrades.includes('wood_ref')) finalArmour = 1;

    const totalArmour = finalArmour + tempArmour;

    // Environmental Reduction: armor no longer mitigates Meteo/Terrain as per latest rules
    const envReduction = 0; 
    // Combat Reduction applies to Monsters, Bandits, and Animals
    const combatReduction = totalArmour;

    if (envReduction > 0) {
      weatherReport.mitigation.push(`Armatura: -${envReduction} HP`);
      terrainReport.mitigation.push(`Armatura: -${envReduction} HP`);
    }
    
    if (tempArmour > 0) {
      // We don't add it to reports yet, as it only applies to combat
    }

    let weatherMit = envReduction;
    let terrainMit = envReduction;

    // Sospensioni a Molla (Weather bonus HP)
    if (player.upgrades.includes('springs')) {
      if (['Soleggiato', 'Pioggia', 'Temporale'].includes(weather.name)) {
        weatherMit += 2;
        weatherReport.mitigation.push(`Sospensioni a Molla: Bonus stabilità (+2 HP con ${weather.name})`);
      }
    }

    // Ruote Chiodate (Terrain)
    if (player.upgrades.includes('wheels')) {
      if (['Montagna', 'Ghiacciaio', 'Vulcano'].includes(terrain.name)) {
        terrainMit += 2;
        terrainReport.mitigation.push(`Ruote Chiodate: Danni ridotti (-2 HP)`);
      }
    } else {
      if (terrain.name === 'Ghiacciaio') {
        terrainReport.days += 1;
        terrainReport.goodsLost += 1;
        terrainReport.motivation = "Senza ruote chiodate scivoli sul ghiaccio!";
      } else if (terrain.name === 'Montagna') {
        terrainReport.days += 1;
        terrainReport.motivation = "La salita ripida senza ruote chiodate rallenta il viaggio.";
      }
    }

    // Lanterna (Caverna)
    if (terrain.name === 'Caverna') {
      const hasOil = player.consumables.lanternOil > 0;
      const hasLantern = player.upgrades.includes('lantern');
      
      if (hasLantern && hasOil) {
        // Mechanics: con Lanterna (0 giorni) e -2 danni subiti
        terrainMit += 2;
        terrainReport.days = 0;
        terrainReport.mitigation.push("Lanterna a Olio: Percorso illuminato (-2 HP, 0 Giorni)");

        // Mitigation for Cavern Weather: All weather extra days reduced to 0 with lantern
        weatherReport.days = 0;
        weatherReport.mitigation.push("Lanterna a Olio: Illumina il percorso (0 giorni extra)");
      } else {
        terrainReport.motivation = "L'oscurità della caverna è opprimente.";
      }

      // Special check for Allagamento Improvviso in Cavern (50% chance to lose goods)
      if (weather.name === 'Allagamento Improvviso') {
        if (Math.random() < 0.5) {
          terrainReport.goodsLost += 1;
          terrainReport.motivation = "La piena travolge parte del carico!";
        }
      }
    }

    // Trattamento Ignifugo (Vulcano)
    if (terrain.name === 'Vulcano') {
      if (player.upgrades.includes('fireproof')) {
        terrainMit += terrain.damage;
        terrainReport.mitigation.push("Trattamento Ignifugo: Danni annullati (0 HP)");
      }
    }

    // Amico dei Boschi badge (Terrain)
    if (player.badges.includes('amico_boschi') && terrain.name === 'Bosco') {
      terrainMit += terrain.damage;
      terrainReport.days = 0;
      terrainReport.mitigation.push(`Badge Amico dei Boschi: -${terrain.damage} HP e 0 Giorni`);
    }

    // Fiume Risk
    if (terrain.name === 'Fiume' && (weather.name === 'Pioggia' || weather.name === 'Temporale')) {
      if (!player.badges.includes('veterano_fiume')) {
        let chance = 0.5; // Probabilità base
        if (player.upgrades.includes('case')) {
          chance = 0.25; // Dimezzato
          terrainReport.mitigation.push("Cassa Sigillata: Chance perdita dimezzata");
        }
        
        if (Math.random() < chance) {
          goodsLostTerrain = 1;
          terrainReport.motivation = "Fiume in piena: perdi merce!";
        } else {
          terrainReport.mitigation.push("Sei riuscito a salvare il carico dal fiume!");
        }
      } else {
        terrainReport.mitigation.push("Badge Veterano del Fiume: Merce Salvata!");
      }
    }

    // Signore del Meteo badge
    if (player.badges.includes('signore_meteo') && (weather.name === 'Nuvoloso' || weather.name === 'Nebbia')) {
      weatherReport.days -= weather.extraDays;
      weatherReport.mitigation.push("Badge Signore del Meteo: Tempo recuperato!");
    }

    // Lanterna Logic (Weather & Terrain)
    if (weather.name === 'Nebbia' || terrain.name === 'Caverna') {
      if (player.upgrades.includes('lantern') && player.consumables.lanternOil > 0) {
        if (weather.name === 'Nebbia') {
          weatherMit += weather.hpDamage;
          weatherReport.days -= weather.extraDays;
          weatherReport.mitigation.push("Lanterna ad Olio: Nebbia dissipata");
        }
      } else if (terrain.name === 'Caverna') {
        // Penalty if no lantern in cavern is not strictly defined in table, but we can keep a slight penalty or just use table values
      }
    }

    // Special Goods Loss for Caverna Allagamento
    if (terrain.name === 'Caverna' && weather.name === 'Allagamento Improvviso') {
      if (Math.random() > 0.5) {
        goodsLostWeather = 1;
        weatherReport.mitigation.push("Allagamento: Merce persa!");
      }
    }

    // Final calculations for environment
    // Nuvoloso handles its bonus via weatherReport.damage = -1 later
    
    // Additional Weather Goods Loss (Example: Temporale)
    if (weather.name === 'Temporale') {
      if (Math.random() > 0.8) {
        goodsLostWeather = 1;
      }
    }

    // Armor Mitigation Parts
    const actualWeatherMitArmor = Math.min(weather.hpDamage, envReduction);
    const actualTerrainMitArmor = Math.min(terrain.damage, envReduction);
    let mitParts: string[] = [];
    if (actualWeatherMitArmor > 0) mitParts.push(`-${actualWeatherMitArmor} HP (Meteo)`);
    if (actualTerrainMitArmor > 0) mitParts.push(`-${actualTerrainMitArmor} HP (Terreno)`);

    // Environmental Damage Resolution
    // If Nuvoloso or springs bonus exceeds damage, it becomes healing (negative damage)
    if (weather.name === 'Nuvoloso' && !player.upgrades.includes('springs')) {
      weatherReport.damage = -1; // Specific bonus for Nuvoloso if no springs override
    } else {
      weatherReport.damage = weatherReport.damage - weatherMit;
    }
    terrainReport.damage = Math.max(0, terrainReport.damage - terrainMit);

    // Cartografo Badge
    if (player.badges.includes('cartografo')) {
      if (rollDice(6) >= 4) {
        terrainReport.days = Math.max(1, terrainReport.days - 1);
        terrainReport.mitigation.push("Badge Cartografo: Scorciatoia!");
      }
    }

    // Total Results
    let totalDmg = weatherReport.damage + terrainReport.damage;
    let totalDays = weatherReport.days + terrainReport.days;
    let totalGoodsLost = goodsLostWeather + goodsLostTerrain;

    // Event Resolution (Immediate ones)
    if (eRoll === 4) { // Mostri
      let monsterDmg = 4; 
      if (weather.name === 'Nuvoloso') {
        monsterDmg = Math.max(0, monsterDmg - 1);
      }
      
      if (player.badges.includes('scorta_armata')) {
         monsterDmg = Math.ceil(monsterDmg / 2);
         if (monsterDmg > 0) mitParts.push("Scorta Armata (Danni dimezzati)");
      }

      const actualMonsterMit = Math.min(monsterDmg, combatReduction);
      if (actualMonsterMit > 0) mitParts.push(`-${actualMonsterMit} HP (Mostri)`);

      const netMonsterDmg = Math.max(0, monsterDmg - combatReduction);
      eventDmg = netMonsterDmg;
      totalDmg += netMonsterDmg;
      
      const combatMitigationMsg = combatReduction > 0 ? ` (ridotti da armatura${tempArmour > 0 ? ' e Difesa Militare' : ''}${weather.name === 'Nuvoloso' ? ' e meteo' : ''})` : '';
      eventReport.outcome = `Attacco improvviso! Subisci ${netMonsterDmg} danni${combatMitigationMsg}.`;
    } else if (eRoll === 5) { // Esploratore
      totalDays = Math.max(0, totalDays - 1);
      eventReport.outcome = "L'esploratore ti mostra una scorciatoia sicura: -1 Giorno di viaggio.";
    } else if (eRoll === 7) { // Trappole
      if (structure.id === 'camp') {
        eventDmg = 0;
        eventReport.outcome = "L'Accampamento Militare ha bonificato la zona: le Trappole dei Coboldi vengono evitate!";
      } else {
        let trapDmg = 5;
        // Traps are NOT mitigated by armor as per latest specific list (Animali, Banditi, Mostri)
        eventDmg = trapDmg;
        totalDmg += trapDmg;
        totalDays += 1;
        
        eventReport.outcome = `Il carretto finisce in una trappola dei Coboldi: subisci ${trapDmg} danni e vieni rallentato (+1 Giorno).`;
      }
    } else if (eRoll === 2) { // Animali Selvatici
      eventReport.outcome = "Branchi di animali selvatici circondano il carretto!";
    } else if (eRoll === 1) { // Viandante
      eventReport.outcome = "Un viandante solitario ti fa un segno dalla strada.";
    } else if (eRoll === 3) { // Banditi
      eventReport.outcome = "Tensioni lungo il cammino: dei banditi sbarrano la strada!";
    } else if (eRoll === 6) { // Bardo
      eventReport.outcome = "Un bardo itinerante chiede un passaggio per la prossima tappa.";
    } else {
      eventReport.outcome = "Viaggio tranquillo.";
    }

    const armorMitigationNote = mitParts.length > 0 ? `Armatura Carretto: ${mitParts.join(' e ')}.` : "";

    // Goods Loss Note Calculation
    let goodsLossParts: string[] = [];
    if (goodsLostWeather > 0) goodsLossParts.push(`-${goodsLostWeather} (${weather.name})`);
    if (goodsLostTerrain > 0) goodsLossParts.push(`-${goodsLostTerrain} (${terrain.name})`);
    if (goodsLostEvent > 0) goodsLossParts.push(`-${goodsLostEvent} (${event.name})`);
    if (goodsLostStructure > 0) goodsLossParts.push(`-${goodsLostStructure} (${structure.name})`);
    
    const goodsLossNote = goodsLossParts.length > 0 ? `Perdita Merci: ${goodsLossParts.join(', ')}.` : "";

    // Apply Dynamic Structure Effects (Healing/Repair/PR)
    if (structure.id === 'dwarf') {
      structDmg = -5;
      structureReport.outcome = "I Fabbri Nanici riparano i danni della tappa e rinforzano il carretto: +5 HP.";
      totalDmg += structDmg;
    } else if (structure.id === 'shrine') {
      structureReport.outcome = "Il santuario ti ispira e la gente parla bene di te: +1 Punti Reputazione.";
    } else if (structure.id === 'spring') {
      structDmg = -1;
      structureReport.outcome = "L'acqua pura rigenera le bestie: +1 HP.";
      totalDmg += structDmg;
    }

    const currentTurnLogId = (Date.now() + 1).toString();

    const result = {
      origin: player.currentLocation,
      destination: currentQuest.destination,
      weather,
      terrain,
      weatherReport: { ...weatherReport, desc: weather.desc },
      terrainReport: { ...terrainReport },
      structureData: structure,
      event: event.name !== 'Nessun Evento' ? `${event.name}: ${event.description}` : "",
      eventData: event,
      eventReport: { ...eventReport },
      structureReport: { ...structureReport },
      armorMitigationNote,
      goodsLossNote,
      totalDamage: totalDmg, 
      detailedDamage: {
        weather: weatherReport.damage,
        terrain: terrainReport.damage,
        event: eventDmg,
        structure: structDmg
      },
      detailedDays: {
        weather: weatherReport.days,
        terrain: terrainReport.days,
        event: (totalDays - (weatherReport.days + terrainReport.days))
      },
      stepDays: totalDays,
      totalDaysPassed: player.daysPassed + totalDays,
      goodsLost: totalGoodsLost,
      goodsLostWeather,
      goodsLostTerrain,
      goodsLostEvent,
      goodsLostStructure,
      goodsLostMotivation: terrainReport.motivation || (weatherReport.damage > 0 || terrainReport.damage > 0 ? weather.name + " e " + terrain.name : ""),
      activeUpgrades: player.upgrades.filter(u => 
        weatherReport.mitigation.some(m => m.includes(SHOP_ITEMS.find(si => si.id === u)?.name || '')) ||
        terrainReport.mitigation.some(m => m.includes(SHOP_ITEMS.find(si => si.id === u)?.name || ''))
      ),
      activeBadges: player.badges.filter(b =>
        weatherReport.mitigation.some(m => m.includes('Badge')) ||
        terrainReport.mitigation.some(m => m.includes('Badge')) ||
        eventReport.outcome.includes('Scorta Armata')
      )
    };

    setJourneyHistory(prev => {
      const next = [...prev];
      next[journeyStep] = result;
      return next;
    });

    setLog(prev => [
      { 
        id: currentTurnLogId, 
        message: `Tappa ${journeyStep + 1}: Esplorazione conclusa.`, 
        type: totalDmg > 15 ? 'damage' : 'info',
        totalDamage: totalDmg,
        detailedDamage: {
          weather: weatherReport.damage,
          terrain: terrainReport.damage,
          event: eventDmg,
          structure: structDmg
        },
        detailedDays: {
          weather: weatherReport.days,
          terrain: terrainReport.days,
          event: (totalDays - (weatherReport.days + terrainReport.days))
        },
        stepDays: totalDays,
        goodsLost: totalGoodsLost,
        armorBonus: totalArmour,
        armorMitigationNote,
        goodsLossNote,
        totalDaysPassed: player.daysPassed + totalDays,
        weatherReport: { ...weatherReport, desc: weather.desc },
        terrainReport,
        eventReport,
        structureReport,
        activeUpgrades: player.upgrades.filter(u => 
          weatherReport.mitigation.some(m => m.includes(SHOP_ITEMS.find(si => si.id === u)?.name || '')) ||
          terrainReport.mitigation.some(m => m.includes(SHOP_ITEMS.find(si => si.id === u)?.name || ''))
        ),
        activeBadges: player.badges.filter(b =>
          weatherReport.mitigation.some(m => m.includes('Badge')) ||
          terrainReport.mitigation.some(m => m.includes('Badge')) ||
          eventReport.outcome.includes('Scorta Armata')
        )
      },
      ...prev
    ]);

    // Check for INTERACTIVE Structure
    if (['village', 'wizard'].includes(structure.id)) {
      setActiveStructure({
        id: structure.id,
        data: structure,
        logId: currentTurnLogId
      });
    } else {
      setActiveStructure(null);
    }

    // Interactive Event Kick-off (Viandante: 1, Animali: 2, Banditi: 3, Bardo: 6)
    if ([1, 2, 3, 6].includes(eRoll)) {
      setActiveEncounter({
        type: eRoll,
        data: event,
        logId: currentTurnLogId,
        weather: weather.name
      });
    } else {
      setActiveEncounter(null);
    }

    setEncounterResolved(false);
    setStageHeroPhase('ACTIVE');
  };

  const resolveStructure = (choice: string) => {
    if (!activeStructure) return;

    const { id } = activeStructure;
    let logMsg = "";
    let canAfford = true;

    if (id === 'village') {
      if (choice === 'repair') {
        if (player.gold >= 10) {
          setPlayer(p => ({ ...p, gold: p.gold - 10, hp: Math.min(p.hpMax, p.hp + 5) }));
          logMsg = "Riparazione professionale al villaggio: +5 HP.";
        } else canAfford = false;
      } else if (choice === 'oil') {
        if (player.gold >= 10 && player.upgrades.includes('lantern')) {
          setPlayer(p => ({ ...p, gold: p.gold - 10, consumables: { ...p.consumables, lanternOil: p.consumables.lanternOil + 1 } }));
          logMsg = "Ricarica lanterna al villaggio: +1 Carica.";
        } else if (!player.upgrades.includes('lantern')) {
          setNotification("Hai bisogno della Lanterna!");
          setTimeout(() => setNotification(null), 2000);
          return;
        } else canAfford = false;
      } else if (choice === 'skip') {
        logMsg = "Hai lasciato il villaggio.";
      }
    } else if (id === 'wizard') {
      if (choice === 'spell') {
        if (player.gold >= 5) {
          setPlayer(p => ({ ...p, gold: p.gold - 5, daysPassed: Math.max(0, p.daysPassed - 2) }));
          logMsg = "Il Mago lancia Passo Veloce: -2 Giorni di viaggio!";
          // We need to signal that days were reduced for the history update below
          const dayReduction = 2;

          setJourneyHistory(prev => {
            const next = [...prev];
            if (next[journeyStep]) {
              const newDetailedDays = {
                ...(next[journeyStep].detailedDays || { weather: 0, terrain: 0, event: 0 }),
                event: (next[journeyStep].detailedDays?.event || 0) - dayReduction
              };
              next[journeyStep] = {
                ...next[journeyStep],
                stepDays: (next[journeyStep].stepDays || 0) - dayReduction,
                detailedDays: newDetailedDays,
                totalDaysPassed: Math.max(0, (next[journeyStep].totalDaysPassed || 0) - dayReduction)
              };
            }
            return next;
          });

          setLog(prev => prev.map(l => {
            if (l.id === activeStructure.logId) {
              const newDetailedDays = {
                ...(l.detailedDays || { weather: 0, terrain: 0, event: 0 }),
                event: (l.detailedDays?.event || 0) - dayReduction
              };
              return {
                ...l,
                detailedDays: newDetailedDays,
                totalDaysPassed: Math.max(0, (l.totalDaysPassed || 0) - dayReduction)
              };
            }
            return l;
          }));
        } else canAfford = false;
      } else if (choice === 'skip') {
        logMsg = "Hai declinato l'offerta del Mago.";
      }
    }

    if (!canAfford) {
      setNotification("Non hai abbastanza Oro!");
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    if (logMsg) {
      // Extract healing from logMsg if any (e.g. "+10 HP")
      const healMatch = logMsg.match(/\+(\d+) HP/);
      const healingValue = healMatch ? parseInt(healMatch[1]) : 0;
      const interactiveDmg = -healingValue; // Healing is negative damage

      setLog(prev => prev.map(l => {
        if (l.id === activeStructure.logId) {
          const newTotalDmg = (l.totalDamage || 0) + interactiveDmg;
          const newDetailed = {
            ...(l.detailedDamage || { weather: 0, terrain: 0, event: 0, structure: 0 }),
            structure: (l.detailedDamage?.structure || 0) + interactiveDmg
          };
          return {
            ...l,
            totalDamage: newTotalDmg,
            detailedDamage: newDetailed,
            structureReport: { ...l.structureReport!, outcome: logMsg }
          };
        }
        return l;
      }));
      
      setJourneyHistory(prev => {
        const next = [...prev];
        if (next[journeyStep]) {
          const newTotalDmg = (next[journeyStep].totalDamage || 0) + interactiveDmg;
          const newDetailed = {
            ...(next[journeyStep].detailedDamage || { weather: 0, terrain: 0, event: 0, structure: 0 }),
            structure: (next[journeyStep].detailedDamage?.structure || 0) + interactiveDmg
          };
          next[journeyStep] = {
            ...next[journeyStep],
            totalDamage: newTotalDmg,
            detailedDamage: newDetailed,
            structureReport: { ...next[journeyStep].structureReport, outcome: logMsg }
          };
        }
        return next;
      });
    }

    setActiveStructure(null);
  };

  const resolveEncounter = (choice: string) => {
    if (!activeEncounter) return;

    const { type } = activeEncounter;
    let logMsg = "";
    let canAfford = true;
    let motivation = "";
    let mitigation: string[] = [];

    // Calculate current armor for mitigation logs
    let currArmour = 0;
    if (player.upgrades.includes('steel_frame')) currArmour = 4;
    else if (player.upgrades.includes('iron_plates')) currArmour = 2;
    else if (player.upgrades.includes('wood_ref')) currArmour = 1;
    
    let tempArmour = 0;
    const structureRoll = currentRolls.structure;
    if (structureRoll > 0) {
      const structure = STRUCTURE_TABLE[structureRoll - 1];
      if (structure && structure.id === 'camp') {
        tempArmour = 2;
      }
    }

    // Military Defense (+2) applies to Bandits, Monsters, and Wild Animals.
    // Monsters are handled in resolveStep, so here we consider Bandits and Wild Animals.
    const isCombat = type === 2 || type === 3;
    const currentDmgReduction = isCombat ? (currArmour + tempArmour) : 0;
    
    if (tempArmour > 0 && isCombat) {
      mitigation.push(`Difesa Militare: -${tempArmour} HP`);
    }
    
    if (currArmour > 0 && isCombat) {
       mitigation.push(`Armatura: -${currArmour} HP`);
    }

    const isCloudy = activeEncounter.weather === 'Nuvoloso';

    if (type === 1) { // Viandante
      if (choice === 'oil') {
        if (player.gold >= 5) {
          setPlayer(p => ({ 
            ...p, 
            gold: p.gold - 5, 
            consumables: { ...p.consumables, lanternOil: p.consumables.lanternOil + 1 } 
          }));
          logMsg = "Hai comprato 1 Carica Lanterna.";
          motivation = "Scambio col Viandante";
        } else canAfford = false;
      } else if (choice === 'repair') {
        if (player.gold >= 10) {
          setPlayer(p => ({ 
            ...p, 
            gold: p.gold - 10, 
            hp: Math.min(p.hpMax, p.hp + 5) 
          }));
          logMsg = "Hai riparato 5 HP.";
          motivation = "Intervento del Viandante";
        } else canAfford = false;
      } else if (choice === 'skip') {
        logMsg = "Hai proseguito senza fermarti.";
      }
    } else if (type === 2) { // Animali Selvatici
      if (choice === 'lose') {
        if (player.goods > 0) {
          let goodsToLose = 1;
          if (player.upgrades.includes('case') && Math.random() < 0.5) {
            goodsToLose = 0;
            logMsg = "I predatori attaccano, ma la Cassa Sigillata resiste: merce salvata!";
            motivation = "Cassa sigillata";
          } else {
            setPlayer(p => ({ ...p, goods: p.goods - 1 }));
            logMsg = "Hai perso 1 unità di merce.";
            motivation = "Cibo per distrarre le bestie";
          }
        } else {
          let dmg = 4;
          if (isCloudy) {
            dmg = Math.max(0, dmg - 1);
            mitigation.push("Meteo Nuvoloso: -1 HP");
          }
          let finalDmg = Math.max(0, dmg - currentDmgReduction);
          setPlayer(p => {
            const nextHp = Math.max(0, p.hp - finalDmg);
            return { 
              ...p, 
              hp: nextHp,
              stats: {
                ...p.stats,
                deathReason: nextHp <= 0 ? `L'attacco ferino di ${activeEncounter.data.name} ha distrutto il carretto` : p.stats.deathReason
              }
            };
          });
          logMsg = `Non hai merci! Subisci ${finalDmg} danni.`;
          motivation = "Attacco di animali affamati";
        }
      } else if (choice === 'defend') {
        let dmg = 4;
        if (isCloudy) {
          dmg = Math.max(0, dmg - 1);
          mitigation.push("Meteo Nuvoloso: -1 HP");
        }
        let finalDmg = Math.max(0, dmg - currentDmgReduction);
        setPlayer(p => {
          const nextHp = Math.max(0, p.hp - finalDmg);
          return { 
            ...p, 
            hp: nextHp,
            stats: {
              ...p.stats,
              deathReason: nextHp <= 0 ? `L'aggressione selvatica (${activeEncounter.data.name}) ha distrutto il carretto` : p.stats.deathReason
            }
          };
        });
        logMsg = `Hai difeso il carico subendo ${finalDmg} danni.`;
        motivation = "Difesa del carico riuscita";
      }
    } else if (type === 3) { // Banditi
      if (choice === 'pay_goods') {
        if (player.goods > 0) {
          setPlayer(p => ({ ...p, goods: p.goods - 1 }));
          logMsg = "Hai consegnato 1 unità di merce come pedaggio.";
          motivation = "Scatole cedute per passare";
        } else canAfford = false;
      } else if (choice === 'pay_gold') {
        if (player.gold >= 20) {
          setPlayer(p => ({ ...p, gold: p.gold - 20 }));
          logMsg = "Hai pagato 20 Oro ai banditi.";
          motivation = "Monete cedute per passare";
        } else canAfford = false;
      } else if (choice === 'refuse') {
        let dmg = 5;
        // Scorta Armata badge specifically covers Banditi
        let baseDmg = dmg;
        if (player.badges.includes('scorta_armata')) {
          baseDmg = Math.ceil(baseDmg / 2);
          mitigation.push("Scorta Armata: Danni dimezzati");
        }
        
        let finalDmg = Math.max(0, baseDmg - currentDmgReduction);
        
        setPlayer(p => {
          const nextHp = Math.max(0, p.hp - finalDmg);
          return { 
            ...p, 
            hp: nextHp,
            stats: {
              ...p.stats,
              deathReason: nextHp <= 0 ? `L'assalto stradale dei ${activeEncounter.data.name} ha distrutto il carretto` : p.stats.deathReason
            }
          };
        });
        logMsg = `Hai rifiutato! Il carretto subisce ${finalDmg} danni forzati.`;
        motivation = "Attacco dei Banditi dopo rifiuto";
      }
    } else if (type === 6) { // Bardo Itinerante
      if (choice === 'give_ride') {
        if (player.goods > 0) {
          setPlayer(p => ({ 
            ...p, 
            goods: p.goods - 1,
            pr: p.pr + 5
          }));
          logMsg = "Hai dato un passaggio al Bardo: +5 PR!";
          motivation = "Le tue gesta vengono cantate";
        } else canAfford = false;
      } else if (choice === 'skip') {
        logMsg = "Hai proseguito senza caricare il Bardo.";
      }
    }

    if (!canAfford) {
      setNotification("Non hai abbastanza risorse!");
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    if (logMsg && activeEncounter.logId) {
      const outcome = logMsg + (motivation ? ` (${motivation})` : "") + (mitigation.length > 0 ? ` [${mitigation.join(', ')}]` : "");
      
      // Extract damage from logMsg if any (e.g. "subisce 5 danni")
      const dmgMatch = logMsg.match(/subisce (\d+) danni/);
      const interactiveDmg = dmgMatch ? parseInt(dmgMatch[1]) : 0;

      // Extract goods loss
      let interactiveGoodsLost = 0;
      if (choice === 'pay_goods' || (type === 2 && choice === 'lose' && player.goods > 0) || (type === 6 && choice === 'give_ride')) {
        interactiveGoodsLost = 1;
      }

      setLog(prev => prev.map(l => {
        if (l.id === activeEncounter.logId) {
          const newTotalDmg = (l.totalDamage || 0) + interactiveDmg;
          const newDetailed = {
            ...(l.detailedDamage || { weather: 0, terrain: 0, event: 0, structure: 0 }),
            event: (l.detailedDamage?.event || 0) + interactiveDmg
          };
          
          let updatedGoodsLossNote = l.goodsLossNote || "";
          if (interactiveGoodsLost > 0) {
            const part = `-${interactiveGoodsLost} (${activeEncounter.name})`;
            updatedGoodsLossNote = updatedGoodsLossNote 
              ? updatedGoodsLossNote.replace(/\.?$/, `, ${part}.`)
              : `Perdita Merci: ${part}.`;
          }

          return {
            ...l,
            totalDamage: newTotalDmg,
            detailedDamage: newDetailed,
            goodsLostNote: updatedGoodsLossNote,
            eventReport: l.eventReport ? { 
              ...l.eventReport, 
              outcome: outcome
            } : undefined
          };
        }
        return l;
      }));

      setJourneyHistory(prev => {
        const next = [...prev];
        if (next[journeyStep]) {
          const newTotalDmg = (next[journeyStep].totalDamage || 0) + interactiveDmg;
          const newDetailed = {
            ...(next[journeyStep].detailedDamage || { weather: 0, terrain: 0, event: 0, structure: 0 }),
            event: (next[journeyStep].detailedDamage?.event || 0) + interactiveDmg
          };

          let updatedGoodsLossNote = next[journeyStep].goodsLossNote || "";
          if (interactiveGoodsLost > 0) {
            const part = `-${interactiveGoodsLost} (${activeEncounter.name})`;
            updatedGoodsLossNote = updatedGoodsLossNote 
              ? updatedGoodsLossNote.replace(/\.?$/, `, ${part}.`)
              : `Perdita Merci: ${part}.`;
          }

          next[journeyStep] = {
            ...next[journeyStep],
            totalDamage: newTotalDmg,
            detailedDamage: newDetailed,
            goodsLostNote: updatedGoodsLossNote,
            eventReport: { ...next[journeyStep].eventReport || {}, outcome: outcome }
          };
        }
        return next;
      });
    }
    setEncounterResolved(true);
  };

  useEffect(() => {
    if (player.hp <= 0 && gameState !== 'GAMEOVER') {
      setGameState('GAMEOVER');
      setTotalDefeats(d => d + 1);
      if (!player.stats.deathReason) {
        setPlayer(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            deathReason: "Cedimento del telaio"
          }
        }));
      }
      setLog(prev => [
        { 
          id: Date.now().toString(), 
          message: "Spedizione Fallita! Carretto distrutto.", 
          type: 'damage',
          motivation: "Il tuo carretto ha subito troppi danni ed è crollato. I buoi sono scappati e il carico è andato perduto tra le terre selvagge."
        },
        ...prev
      ]);
    }
  }, [journeyStep, currentQuest, gameState, player.hp]);

  const completeQuest = () => {
    if (!rewards || !currentQuest) return;

    if (rewards.isFailure) {
      setLog(prev => [{ 
        id: Date.now().toString(), 
        message: `Spedizione fallita a ${currentQuest.destination}!`, 
        type: 'damage' 
      }, ...prev]);
      
      setPlayer(prev => ({
        ...prev,
        pr: Math.max(0, prev.pr + (rewards.pr || 0)),
        currentLocation: currentQuest.destination,
        goods: prev.goods,
        questHistory: [{
          id: Date.now().toString(),
          date: (prev.stats?.totalDays || 0),
          quest: { ...currentQuest },
          rewards: { ...rewards },
          journey: [...journeyHistory],
          status: 'failure'
        }, ...(prev.questHistory || [])]
      }));
    } else {
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold + (rewards.totalGold || 0),
        pr: Math.max(0, prev.pr + (rewards.pr || 0)),
        currentLocation: currentQuest.destination,
        goods: Math.max(0, prev.goods - currentQuest.goods),
        questHistory: [{
          id: Date.now().toString(),
          date: (prev.stats?.totalDays || 0),
          quest: { ...currentQuest },
          rewards: { ...rewards },
          journey: [...journeyHistory],
          status: 'success'
        }, ...(prev.questHistory || [])],
        stats: {
          ...prev.stats,
          completedQuests: prev.stats.completedQuests + 1,
          totalGoldEarned: prev.stats.totalGoldEarned + (rewards.totalGold || 0),
          totalGoodsDelivered: prev.stats.totalGoodsDelivered + (rewards.goodsDelivered || 0)
        }
      }));
      
      setLog(prev => [{ 
        id: Date.now().toString(), 
        message: `Spedizione completata a ${currentQuest.destination}!`, 
        type: 'success' 
      }, ...prev]);
    }

    // CHECK FOR BANKRUPTCY
    if (player.gold < 10 && player.goods === 0) {
      setGameState('GAMEOVER');
      setTotalDefeats(d => d + 1);
      setLog(prev => [{ 
        id: `bank-${Date.now()}`, 
        message: "Bancarotta! Carriera finita.", 
        type: 'damage',
        motivation: "Non hai abbastanza oro per comprare nuove merci e non hai merci in inventario. I tuoi viaggi finiscono qui."
      }, ...prev]);
      return;
    }

    setQuestOptions(getNewQuests(currentQuest.destination));
    setCurrentQuest(null);
    setGameState('BOARD');
  };

  const buyUpgrade = (item: any) => {
    if (player.gold >= item.cost) {
      // Check for dependencies
      if (item.id === 'iron_plates' && !player.upgrades.includes('wood_ref')) return;
      if (item.id === 'steel_frame' && !player.upgrades.includes('iron_plates')) return;
      if (item.id === 'oil' && !player.upgrades.includes('lantern')) return;

      setPlayer(p => {
        if (item.type === 'consumable') {
          if (item.id === 'repair_kit') {
            return {
              ...p,
              gold: p.gold - item.cost,
              consumables: {
                ...p.consumables,
                repairKits: p.consumables.repairKits + 1
              }
            };
          } else if (item.id === 'oil') {
            return {
              ...p,
              gold: p.gold - item.cost,
              consumables: {
                ...p.consumables,
                lanternOil: p.consumables.lanternOil + 1
              }
            };
          }
          return p;
        } else {
          let newUpgrades = [...p.upgrades, item.id];
          let newArmour = p.armour;
          let newCapacity = p.capacity;
          let newConsumables = { ...p.consumables };

          if (item.id === 'wood_ref') newArmour = Math.max(newArmour, 1);
          if (item.id === 'iron_plates') newArmour = Math.max(newArmour, 2);
          if (item.id === 'steel_frame') newArmour = Math.max(newArmour, 4);
          if (item.id === 'lantern') newConsumables.lanternOil = 3;
          if (item.id === 'cargo_expand') newCapacity += 5;

          return {
            ...p,
            gold: p.gold - item.cost,
            upgrades: newUpgrades,
            armour: newArmour,
            capacity: newCapacity,
            consumables: newConsumables
          };
        }
      });
    }
  };

  const sellUpgrade = (item: any) => {
    const isConsumable = ['repair_kit', 'oil'].includes(item.id);
    const hasConsumable = (item.id === 'repair_kit' && player.consumables.repairKits > 0) || 
                         (item.id === 'oil' && player.consumables.lanternOil > 0);
    const hasUpgrade = player.upgrades.includes(item.id);

    if (hasUpgrade || hasConsumable) {
      // Check for dependencies (cannot sell if something else depends on it)
      if (item.id === 'wood_ref' && player.upgrades.includes('iron_plates')) return;
      if (item.id === 'iron_plates' && player.upgrades.includes('steel_frame')) return;
      
      setPlayer(p => {
        let newUpgrades = [...p.upgrades];
        let newConsumables = { ...p.consumables };
        let newArmour = p.armour;
        let newCapacity = p.capacity;

        if (isConsumable) {
          if (item.id === 'repair_kit') newConsumables.repairKits -= 1;
          if (item.id === 'oil') newConsumables.lanternOil -= 1;
        } else {
          newUpgrades = newUpgrades.filter(id => id !== item.id);
          
          // Recalculate Armour based on remaining upgrades
          if (newUpgrades.includes('steel_frame')) newArmour = 4;
          else if (newUpgrades.includes('iron_plates')) newArmour = 2;
          else if (newUpgrades.includes('wood_ref')) newArmour = 1;
          else newArmour = 0;
          
          if (item.id === 'cargo_expand') newCapacity -= 5;
          if (item.id === 'lantern') newConsumables.lanternOil = 0;
        }

        return {
          ...p,
          gold: p.gold + item.cost,
          upgrades: newUpgrades,
          armour: newArmour,
          capacity: newCapacity,
          consumables: newConsumables
        };
      });
    }
  };

  const buyBadge = (badge: any) => {
    if (player.pr >= badge.cost && !player.badges.includes(badge.id)) {
      setPlayer(p => ({
        ...p,
        pr: p.pr - badge.cost,
        badges: [...p.badges, badge.id]
      }));
    }
  };

  const useRepairKit = () => {
    if (player.consumables.repairKits > 0 && player.hp < player.hpMax) {
      const heal = player.badges.includes('meccanico_esperto') ? 10 : 5;
      setPlayer(p => ({
        ...p,
        hp: Math.min(p.hpMax, p.hp + heal),
        consumables: { ...p.consumables, repairKits: p.consumables.repairKits - 1 }
      }));
    }
  };

  return (
    <div className="h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-amber-200 selection:text-amber-950 overflow-hidden">
      {gameState !== 'START' && gameState !== 'MANUAL' && (
        <TopBar 
          player={player} 
          itemDetail={itemDetail} 
          setItemDetail={setItemDetail} 
          useRepairKit={useRepairKit} 
        />
      )}

      <main className="flex-1 overflow-y-auto bg-stone-100/70 p-4 relative flex flex-col items-center custom-scrollbar gap-4">
        <AnimatePresence>
          {notification && (
            <motion.div 
              key="notification-alert"
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className="fixed top-0 left-1/2 z-50 bg-amber-600 border border-amber-500 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-wider shadow-lg flex items-center gap-3 text-sm"
            >
              <PixelCrate size={20} className="animate-bounce" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameState === 'START' && (
            <StartView 
              totalDefeats={totalDefeats}
              onStartNewGame={startNewGame}
              onOpenManual={() => setGameState('MANUAL')}
            />
          )}

          {gameState === 'MANUAL' && (
            <motion.div
              key="state-manual"
              className="w-full h-full overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setGameState('START')}
                className="fixed top-4 left-4 z-50 px-4 py-2 bg-white text-stone-800 border border-stone-200 rounded-xl shadow-sm hover:bg-stone-50 font-bold uppercase text-xs tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={16} /> Indietro
              </button>
              <GameManual />
            </motion.div>
          )}

          {gameState === 'BOARD' && (
            <BoardView 
              player={player}
              questOptions={questOptions}
              currentTip={currentTip}
              onNavigate={setGameState}
              onOpenDeparture={(q) => setDepartureConfirmationQuest(q)}
              onOpenDepartureDirect={() => {
                const q = departureConfirmationQuest || currentQuest || (questOptions.length > 0 ? questOptions[0] : null);
                if (q) {
                  setDepartureConfirmationQuest(q);
                } else {
                  setNotification("Nessun incarico disponibile al momento!");
                  setTimeout(() => setNotification(null), 3000);
                }
              }}
              onExitGame={resetGame}
            />
          )}

          {gameState === 'JOURNEY' && (
            <JourneyView
              currentQuest={currentQuest}
              player={player}
              journeyStep={journeyStep}
              journeyHistory={journeyHistory}
              inspectedIcon={inspectedIcon}
              setInspectedIcon={setInspectedIcon}
              stageHeroPhase={stageHeroPhase}
              revealedStageCards={revealedStageCards}
              activeStructure={activeStructure}
              activeEncounter={activeEncounter}
              encounterResolved={encounterResolved}
              isRolling={isRolling}
              flipStageCard={flipStageCard}
              flipNextStageCard={flipNextStageCard}
              flipAllStageCards={flipAllStageCards}
              resolveStructure={resolveStructure}
              resolveEncounter={resolveEncounter}
              completeCurrentStep={completeCurrentStep}
              resolveStep={resolveStep}
              onNavigate={setGameState}
            />
          )}

          {gameState === 'TAVERN' && (
            <TavernView 
              onRestAtTavern={restAtTavern} 
              onNavigate={setGameState} 
            />
          )}

          {gameState === 'EMPORIO' && (
            <EmporioView 
              player={player} 
              setPlayer={setPlayer} 
              onNavigate={setGameState} 
              buyUpgrade={buyUpgrade} 
              sellUpgrade={sellUpgrade} 
            />
          )}

          {gameState === 'BLACKSMITH' && (
            <BlacksmithView 
              player={player} 
              onNavigate={setGameState} 
              buyUpgrade={buyUpgrade} 
              sellUpgrade={sellUpgrade} 
            />
          )}

          {gameState === 'GUILD' && (
            <GuildView 
              player={player} 
              onNavigate={setGameState} 
              buyBadge={buyBadge} 
            />
          )}

          {gameState === 'JOURNAL' && (
            <JournalView 
              player={player} 
              selectedJournalQuest={selectedJournalQuest} 
              setSelectedJournalQuest={setSelectedJournalQuest} 
              onNavigate={setGameState} 
            />
          )}

          {gameState === 'RESULTS' && (
            <ResultsView 
              player={player} 
              currentQuest={currentQuest} 
              rewards={rewards} 
              onCompleteQuest={completeQuest} 
            />
          )}

          {gameState === 'GAMEOVER' && (
            <GameOverView 
              player={player} 
              onResetGame={resetGame} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Global Overlays */}
      <AnimatePresence>
        {itemDetail && (
          <ItemDetailModal 
            itemDetail={itemDetail} 
            player={player} 
            onClose={() => setItemDetail(null)} 
          />
        )}

        {departureConfirmationQuest && (
          <DepartureModal
            quest={departureConfirmationQuest}
            questOptions={questOptions}
            player={player}
            onClose={() => setDepartureConfirmationQuest(null)}
            onSelectQuest={(q) => setDepartureConfirmationQuest(q)}
            onConfirmDeparture={(quest) => {
              setDepartureConfirmationQuest(null);
              acceptQuest(quest);
            }}
            onNavigate={(state) => {
              setDepartureConfirmationQuest(null);
              setGameState(state);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

