/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Heart, 
  Map as MapIcon, 
  ChevronRight, 
  RotateCcw, 
  Dices,
  Cloud,
  CloudMoon,
  Sun,
  CloudRain,
  CloudLightning,
  MapPin,
  Trees,
  Mountain,
  Flame,
  User,
  Users,
  Skull,
  Eye,
  Moon,
  Wrench,
  Truck,
  FlameKindling,
  Award,
  Smile,
  Zap,
  Navigation,
  Compass,
  Home,
  Landmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Flag,
  Waves,
  ArrowLeft,
  ArrowRight,
  History,
  Snowflake,
  Droplets,
  Cat,
  Ghost,
  Footprints,
  Lock,
  CloudSun,
  ShieldCheck,
  Wind,
  Star,
  Medal,
  X,
  Calendar,
  Music,
  Target,
  AlertTriangle
} from 'lucide-react';
import { PixelCrate, PixelCoins, PixelQuest, PixelBook, PixelStore, PixelBlacksmith, PixelTavern, PixelGuild } from './components/PixelIcon';
import GameManual from './components/GameManual';

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

// --- TIPI E COSTANTI ---

type GameState = 'START' | 'BOARD' | 'JOURNEY' | 'SHOP' | 'GUILD' | 'RESULTS' | 'GAMEOVER' | 'EMPORIO' | 'BLACKSMITH' | 'TAVERN' | 'JOURNAL' | 'MANUAL';

interface PlayerState {
  gold: number;
  pr: number; // Reputation Points
  hp: number;
  hpMax: number;
  goods: number;
  capacity: number;
  armour: number;
  daysPassed: number;
  upgrades: string[];
  badges: string[];
  consumables: {
    repairKits: number;
    lanternOil: number;
  };
  currentLocation: string;
  questHistory: any[];
  stats: {
    totalDays: number;
    completedQuests: number;
    totalGoldEarned: number;
    monstersFaced: number;
    daysInTavern: number;
    totalGoodsDelivered: number;
    deathReason: string;
  };
}

interface Quest {
  type: 'Breve' | 'Media' | 'Lunga';
  length: number;
  goods: number;
  goldMultiplier: number;
  destination: string;
  origin?: string;
  reward?: number;
}

// --- FINE TABELLE CENTRALIZZATE ---

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

  // --- COMPONENTS ---
  const TopBar = () => (
    <div className="w-full bg-white/95 border-b border-stone-200 px-4 py-2 lg:px-6 flex flex-col lg:flex-row gap-4 items-center select-none font-sans sticky top-0 z-40 backdrop-blur-sm shadow-xs">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
          <User className="text-amber-700" size={20} />
        </div>
        <div className="shrink-0">
          <h2 className="text-stone-400 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Località attuale</h2>
          <p className="text-stone-900 text-sm font-black leading-tight">{player.currentLocation}</p>
        </div>
        <div className="flex gap-2 ml-2 pl-3 border-l border-stone-200">
          <button 
            onClick={() => setItemDetail(itemDetail?.id === 'stat-days' ? null : {
              id: 'stat-days',
              name: 'Giorni di Viaggio',
              description: 'Il tempo totale trascorso dall\'inizio della tua carriera come mercante.',
              category: 'stat',
              icon: Calendar,
              color: 'text-stone-500'
            })}
            className={`flex flex-col items-center hover:bg-stone-100 p-1 px-2.5 rounded-lg transition-colors cursor-pointer ${itemDetail?.id === 'stat-days' ? 'bg-stone-100 ring-1 ring-stone-300' : ''}`}
          >
            <span className="text-stone-900 font-black text-base leading-none">{player.stats.totalDays}</span>
            <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Giorni</span>
          </button>
          <button 
            onClick={() => setItemDetail(itemDetail?.id === 'stat-gold' ? null : {
              id: 'stat-gold',
              name: 'Oro',
              description: 'La tua ricchezza attuale. Usala per acquistare merci, upgrade e riparazioni presso empori e fabbri.',
              category: 'stat',
              icon: PixelCoins,
              color: 'text-amber-600'
            })}
            className={`flex flex-col items-center hover:bg-amber-50/70 p-1 px-2.5 rounded-lg transition-colors cursor-pointer ${itemDetail?.id === 'stat-gold' ? 'bg-amber-50 ring-1 ring-amber-300' : ''}`}
          >
            <div className="flex items-center gap-1">
              <span className="text-amber-700 font-black text-base leading-none">{player.gold}</span>
              <PixelCoins size={14} />
            </div>
            <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Oro</span>
          </button>
          <button 
            onClick={() => setItemDetail(itemDetail?.id === 'stat-pr' ? null : {
              id: 'stat-pr',
              name: 'Reputazione',
              description: 'I Punti Reputazione servono ad acquisire i Badge presso la Gilda cittadina. Ogni Badge sbloccato ti permetterà di affrontare i tuoi viaggi con maggiore serenità e vantaggi unici.',
              category: 'stat',
              icon: Star,
              color: 'text-indigo-600'
            })}
            className={`flex flex-col items-center hover:bg-indigo-50/70 p-1 px-2.5 rounded-lg transition-colors cursor-pointer ${itemDetail?.id === 'stat-pr' ? 'bg-indigo-50 ring-1 ring-indigo-300' : ''}`}
          >
            <span className="text-indigo-700 font-black text-base leading-none">{player.pr}</span>
            <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Rep.</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-4 w-full items-center">
        <div className="flex-1 w-full max-w-md">
          <div className="flex justify-between items-center mb-1 px-1">
            <span className="flex items-center gap-1.5 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
              <Truck size={14} className="text-amber-600" /> Integrità Carretto
            </span>
            <span className={`font-black text-xs ${player.hp < 5 ? 'text-rose-600 animate-pulse' : 'text-stone-800'}`}>
              {player.hp} <span className="text-[10px] text-stone-400 font-semibold">/ {player.hpMax}</span>
            </span>
          </div>
          <div className="flex gap-0.5 h-3 bg-stone-100 p-0.5 rounded-sm border border-stone-200">
            {Array.from({ length: 20 }).map((_, i) => {
              const isActive = i < player.hp;
              const colorClass = player.hp > 15 ? 'bg-emerald-500' : 
                                 player.hp < 5 ? 'bg-rose-500' : 
                                 'bg-amber-500';
              
              return (
                <div 
                  key={i}
                  className={`flex-1 rounded-[1px] transition-all duration-500 ${
                    isActive ? colorClass : 'bg-stone-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 shrink-0 bg-stone-50 p-1.5 px-3 rounded-xl border border-stone-200">
          <button 
            onClick={() => setItemDetail(itemDetail?.id === 'stat-goods' ? null : {
              id: 'stat-goods',
              name: 'Merci e Carico',
              description: 'Il carico attuale del tuo carretto. Consegna le merci a destinazione per completare la Quest. Più alto è il carico, più rischi corri, ma migliori saranno i guadagni.',
              category: 'stat',
              icon: PixelCrate,
              color: 'text-amber-700'
            })}
            className={`flex flex-col items-center hover:bg-white p-1 px-2 rounded-lg transition-colors cursor-pointer ${itemDetail?.id === 'stat-goods' ? 'bg-white ring-1 ring-stone-300' : ''}`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <PixelCrate size={16} className="text-amber-600" />
              <span className="text-stone-900 font-black text-base leading-none">{player.goods} / {player.capacity}</span>
            </div>
            <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Merci</span>
          </button>
          <button 
            onClick={() => setItemDetail(itemDetail?.id === 'stat-armour' ? null : {
              id: 'stat-armour',
              name: 'Armatura Carretto',
              description: 'Protegge il tuo carretto dai danni. Ogni punto di armatura sottrae 1 da ogni danno ricevuto (Meteo, Terreno, Eventi e Strutture).',
              category: 'stat',
              icon: Shield,
              color: 'text-sky-600'
            })}
            className={`flex flex-col items-center hover:bg-white p-1 px-2 rounded-lg transition-colors cursor-pointer ${itemDetail?.id === 'stat-armour' ? 'bg-white ring-1 ring-stone-300' : ''}`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Shield size={16} className="text-sky-600" />
              <span className="text-stone-900 font-black text-base leading-none">{player.armour}</span>
            </div>
            <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Armatura</span>
          </button>
        </div>

        {/* Upgrades Section */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider ml-1">Upgrade</span>
          <div className="flex gap-1.5 p-1.5 bg-stone-50 rounded-xl border border-stone-200 overflow-x-auto max-w-[300px] md:max-w-sm lg:max-w-md no-scrollbar">
            {SHOP_ITEMS.filter(item => item.type === 'upgrade').map(upgrade => {
              const isActive = player.upgrades.includes(upgrade.id);
              const isSelected = itemDetail?.id === upgrade.id;
              const Icon = upgrade.icon;
              return (
                <button 
                  key={upgrade.id}
                  onClick={() => setItemDetail(isSelected ? null : { ...upgrade, category: 'upgrade' })}
                  title={upgrade.name + (upgrade.id === 'lantern' && isActive ? ` (${player.consumables.lanternOil} cariche)` : '')}
                  className={`p-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs' 
                      : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60'
                  } ${isSelected ? 'ring-2 ring-amber-500 scale-105' : ''}`}
                >
                  <div className="relative">
                    <Icon size={16} />
                    {upgrade.id === 'lantern' && isActive && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${player.consumables.lanternOil > 0 ? 'bg-sky-400' : 'bg-rose-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${player.consumables.lanternOil > 0 ? 'bg-sky-500' : 'bg-rose-500'}`}></span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider ml-1">Badge</span>
          <div className="flex gap-1.5 p-1.5 bg-stone-50 rounded-xl border border-stone-200 overflow-x-auto max-w-[300px] md:max-w-sm lg:max-w-md no-scrollbar">
            {BADGES.map(badge => {
              const isActive = player.badges.includes(badge.id);
              const isSelected = itemDetail?.id === badge.id;
              const Icon = badge.icon;
              return (
                <button 
                  key={badge.id}
                  onClick={() => setItemDetail(isSelected ? null : { ...badge, category: 'badge' })}
                  className={`p-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs' 
                      : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60'
                  } ${isSelected ? 'ring-2 ring-indigo-500 scale-105' : ''}`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 shrink-0 lg:ml-auto">
        <button 
          disabled={player.consumables.repairKits === 0 || player.hp >= player.hpMax}
          onClick={useRepairKit}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 disabled:opacity-40 transition-all rounded-lg text-xs font-bold border border-stone-200 text-stone-800 shadow-xs cursor-pointer"
        >
          <Wrench size={16} className="text-amber-600"/> Ripara ({player.consumables.repairKits})
        </button>
        <div className={`flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-bold border border-stone-200 shadow-xs transition-colors ${player.consumables.lanternOil === 0 ? 'text-rose-600 border-rose-200' : 'text-sky-700'}`}>
          <FlameKindling size={16} /> Olio ({player.consumables.lanternOil})
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-amber-200 selection:text-amber-950 overflow-hidden">
      {gameState !== 'START' && gameState !== 'MANUAL' && <TopBar />}

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
            <motion.div 
              key="state-start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-lg w-full mx-auto my-auto bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs">
                  <PixelCrate size={48} className="text-amber-700" />
                </div>
                {totalDefeats > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                    <Skull size={16} className="text-amber-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Fallimenti Carriera: {totalDefeats}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-stone-900 leading-tight mb-2">
                  Il Mercante di <span className="text-amber-700 underline decoration-amber-500/40 decoration-4 underline-offset-6">Oakhaven</span>
                </h1>
                <p className="text-base text-stone-600 max-w-sm mx-auto font-medium">
                  Carica le merci, affronta le intemperie e scala i ranghi della gilda commerciale.
                </p>
              </div>
              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={startNewGame}
                  className="w-full py-4 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Inizia Carriera</span>
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => setGameState('MANUAL')}
                  className="w-full py-3 px-8 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PixelBook size={18} />
                  Manuale di Gioco
                </button>
              </div>
            </motion.div>
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
                    onClick={() => setGameState('EMPORIO')} 
                    className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-amber-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-500">Emporio</span>
                    <PixelStore size={20} className="text-amber-600" />
                  </button>
                  <button 
                    onClick={() => setGameState('BLACKSMITH')} 
                    className="px-4 py-2.5 bg-white hover:bg-sky-50 text-stone-800 hover:text-sky-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-sky-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-500">Fabbro</span>
                    <PixelBlacksmith size={20} className="text-sky-600" />
                  </button>
                  <button 
                    onClick={() => setGameState('TAVERN')} 
                    className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-amber-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-500">Taverna</span>
                    <PixelTavern size={20} className="text-amber-700" />
                  </button>
                  <button 
                    onClick={() => setGameState('GUILD')} 
                    className="px-4 py-2.5 bg-white hover:bg-indigo-50 text-stone-800 hover:text-indigo-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-indigo-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-500">Gilda</span>
                    <PixelGuild size={20} className="text-indigo-600" />
                  </button>
                  <button 
                    onClick={() => setGameState('JOURNAL')} 
                    className="px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-500">Diario</span>
                    <PixelBook size={20} className="text-stone-700" />
                  </button>
                  <button 
                    onClick={() => {
                      const q = departureConfirmationQuest || currentQuest || (questOptions.length > 0 ? questOptions[0] : null);
                      if (q) {
                        setDepartureConfirmationQuest(q);
                      } else {
                        setNotification("Nessun incarico disponibile al momento!");
                        setTimeout(() => setNotification(null), 3000);
                      }
                    }} 
                    className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-bold uppercase text-xs tracking-wider rounded-xl border border-stone-200 hover:border-amber-300 shadow-xs flex flex-col items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-500">Porte della Città</span>
                    <Landmark size={20} className="text-amber-700" />
                  </button>
                  <button 
                    onClick={() => setGameState('START')} 
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
                      onClick={() => setDepartureConfirmationQuest(q)}
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
          )}

          {gameState === 'JOURNEY' && (
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
                                  {stepData.goodsLost > 0 && stepData.goodsLossNote && (
                                    <div className="mt-2 text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-medium">
                                      📦 {stepData.goodsLossNote}
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
                      onClick={() => setGameState('RESULTS')}
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
                  /* DISPOSTE COME SINGOLE CARTE/BADGE DA SINISTRA VERSO DESTRA IN ORDINE SEQUENZIALE */
                  /* COPERTE E GIRATE MAN MANO CHE IL GIOCATORE CI CLICCA SOPRA */
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
                                    {stepItem.goodsLost > 0 && stepItem.goodsLossNote && (
                                      <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-1.5 font-bold">
                                        📦 {stepItem.goodsLossNote}
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
          )}

{gameState === 'TAVERN' && (
            <motion.div 
              key="state-tavern"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto py-4"
            >
              <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="h-56 bg-amber-50/70 border-b border-amber-100 relative flex items-center justify-center overflow-hidden">
                  <div className="relative text-center z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                      <PixelTavern size={36} />
                    </div>
                    <div>
                      <h2 className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">Punto di Ristoro</h2>
                      <h1 className="text-2xl font-bold uppercase text-stone-900">La Taverna del Viandante</h1>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <p className="text-sm font-medium leading-relaxed text-stone-600">
                      Il focolare scoppietta allegramente mentre il profumo di stufato riempie la sala. 
                      Un posto ideale per riposare prima della prossima tratta commerciale e attendere che arrivino nuove proposte di lavoro sulla bacheca.
                    </p>
                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500">
                        <span>Costo per Notte</span>
                        <div className="flex items-center gap-1 text-amber-600 font-bold text-sm"><PixelCoins size={18} /> 2 Oro</div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500">
                        <span>Tempo Trascorso</span>
                        <span className="text-xs text-stone-800 font-bold">1 Giorno</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500">
                        <span>Beneficio</span>
                        <span className="text-xs text-emerald-700 font-bold">Aggiorna Incarichi Bacheca</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3">
                    <button 
                      onClick={restAtTavern}
                      className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2.5"
                    >
                      <Smile size={18} />
                      Riposa e Passa un Giorno (-2 Oro)
                    </button>
                    <button 
                      onClick={() => setGameState('BOARD')}
                      className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      Torna alla Bacheca
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'EMPORIO' && (
            <motion.div 
              key="state-emporio"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-6xl mx-auto space-y-8 pb-16"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm">
                    <PixelStore size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">Emporio di {player.currentLocation}</h1>
                    <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">Forniture per carovane e beni consumabili</p>
                  </div>
                </div>
                <button 
                  onClick={() => setGameState('BOARD')} 
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-95 border border-stone-300"
                >
                  Torna alla Bacheca
                </button>
              </div>

              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 text-amber-600">
                      <PixelCrate size={20} />
                    </div>
                    <h2 className="text-lg font-bold uppercase text-stone-900 tracking-tight">Merci e Scorte</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className="text-[11px] font-bold uppercase text-amber-600 tracking-wider mb-0.5 block">Carico Mercati</span>
                            <h3 className="text-lg font-bold uppercase text-stone-900">Carico Commerciale</h3>
                          </div>
                          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                            <PixelCrate size={26} />
                          </div>
                        </div>
                        
                        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 mb-6">
                          <div className="flex justify-between items-end mb-4">
                            <div>
                               <p className="text-[11px] text-stone-400 font-semibold uppercase mb-0.5">Scorte Carico</p>
                               <p className="text-2xl font-bold text-stone-900 tabular-nums">{player.goods} <span className="text-xs font-medium text-stone-400">/ {player.capacity}</span></p>
                            </div>
                            <div className="text-right">
                               <p className="text-[11px] text-stone-400 font-semibold uppercase mb-0.5">Prezzo Unitario</p>
                               <div className="text-lg font-bold text-amber-600 tabular-nums inline-flex items-center gap-1">
                                 <PixelCoins size={18} /> 10 Oro
                                </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => { if(player.goods > 0) setPlayer(p => ({ ...p, gold: p.gold + 10, goods: p.goods - 1 })); }}
                               className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-xs text-stone-700 transition-all border border-stone-300"
                             >
                               VENDI
                             </button>
                             <button 
                               disabled={player.goods >= player.capacity || player.gold < 10}
                               onClick={() => { setPlayer(p => ({ ...p, gold: p.gold - 10, goods: p.goods + 1 })); }}
                               className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 rounded-xl font-bold text-xs text-white transition-all shadow-sm"
                             >
                               COMPRA
                             </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 font-medium italic text-center">
                        Essenziale per completare gli incarichi della bacheca e ricevere premi in oro e reputazione.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {SHOP_ITEMS.filter(item => ['repair_kit', 'oil', 'lantern'].includes(item.id)).map((item) => {
                        const isMaxOil = item.id === 'oil' && player.consumables.lanternOil >= 3;
                        const isPurchasedUpgrade = item.type === 'upgrade' && player.upgrades.includes(item.id);
                        const Icon = item.icon;

                        return (
                          <div 
                            key={item.id}
                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 bg-white ${
                              isPurchasedUpgrade || isMaxOil
                                ? 'border-stone-200 opacity-75' 
                                : 'border-stone-200 hover:border-amber-400 shadow-sm'
                            }`}
                          >
                            <div className={`p-3 rounded-xl border ${isPurchasedUpgrade ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
                              <Icon size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                <h4 className="font-bold text-stone-900 uppercase text-xs tracking-tight">{item.name}</h4>
                                {isPurchasedUpgrade && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">POSSEDUTO</span>}
                                {isMaxOil && <span className="text-[9px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold uppercase">Scorta Piena</span>}
                              </div>
                              <p className="text-[11px] text-stone-500 font-medium leading-tight line-clamp-2">{item.effect}</p>
                              <div className="mt-2 flex justify-between items-center">
                                <div className="flex items-center gap-1 text-amber-600 font-bold text-xs tabular-nums">
                                  <PixelCoins size={14} /> {item.cost} Oro
                                </div>
                                
                                <div className="flex gap-1.5 text-xs">
                                   <button 
                                      disabled={player.gold < item.cost || isMaxOil || (item.type === 'upgrade' && isPurchasedUpgrade)}
                                      onClick={() => buyUpgrade(item)}
                                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold uppercase text-[10px] rounded-lg transition-all shadow-sm whitespace-nowrap"
                                   >
                                      Compra
                                   </button>
                                   <button 
                                      disabled={
                                        (item.id === 'repair_kit' && player.consumables.repairKits <= 0) || 
                                        (item.id === 'oil' && player.consumables.lanternOil <= 0) ||
                                        (item.type === 'upgrade' && !isPurchasedUpgrade)
                                      }
                                      onClick={() => sellUpgrade(item)}
                                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 font-bold uppercase text-[10px] rounded-lg transition-all border border-stone-300 whitespace-nowrap"
                                   >
                                      Vendi
                                   </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {gameState === 'BLACKSMITH' && (
            <motion.div 
              key="state-blacksmith"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-6xl mx-auto space-y-8 pb-16"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
                    <Wrench size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold uppercase text-stone-900 leading-tight">Il Fabbro di {player.currentLocation}</h1>
                    <p className="text-stone-400 font-semibold uppercase text-xs tracking-wider mt-0.5">Miglioramenti strutturali e rinforzi per il carretto</p>
                  </div>
                </div>
                <button 
                  onClick={() => setGameState('BOARD')} 
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-95 border border-stone-300"
                >
                  Torna alla Bacheca
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SHOP_ITEMS.filter(item => item.type === 'upgrade' && item.id !== 'lantern').map((item) => {
                    const isPurchased = player.upgrades.includes(item.id);
                    const Icon = item.icon;

                    let isLocked = false;
                    let requirementText = "";
                    
                    if (item.id === 'iron_plates' && !player.upgrades.includes('wood_ref')) {
                      isLocked = true;
                      requirementText = "Richiede Rinforzi in Legno";
                    }
                    if (item.id === 'steel_frame' && !player.upgrades.includes('iron_plates')) {
                      isLocked = true;
                      requirementText = "Richiede Piastre in Ferro";
                    }

                    const cannotSell = (item.id === 'wood_ref' && player.upgrades.includes('iron_plates')) ||
                                      (item.id === 'iron_plates' && player.upgrades.includes('steel_frame'));

                    return (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 bg-white shadow-sm ${
                          isPurchased ? 'border-blue-200 bg-blue-50/20' : isLocked ? 'border-stone-200 opacity-60' : 'border-stone-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className={`shrink-0 p-3 rounded-xl border ${
                            isPurchased 
                              ? 'bg-blue-50 border-blue-200 text-blue-600' 
                              : isLocked
                                ? 'bg-stone-100 border-stone-200 text-stone-400'
                                : 'bg-blue-50/50 border-blue-100 text-blue-600'
                          }`}>
                            {isLocked ? <Lock size={22} /> : <Icon size={22} />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h4 className="font-bold text-stone-900 uppercase text-xs tracking-tight truncate">{item.name}</h4>
                              {isPurchased && (
                                <span className="shrink-0 text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Installato</span>
                              )}
                              {isLocked && (
                                <span className="shrink-0 text-[9px] bg-stone-100 text-stone-500 border border-stone-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Bloccato</span>
                              )}
                            </div>
                            
                            <p className="text-[11px] text-stone-500 font-medium leading-tight">
                              {isLocked ? (
                                <span className="flex flex-col gap-0.5">
                                  <span className="text-red-600 font-bold">{requirementText}</span>
                                  <span className="opacity-75 italic">{item.effect}</span>
                                </span>
                              ) : item.effect}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 text-amber-600 font-bold text-xs tabular-nums">
                              <PixelCoins size={14} /> {item.cost} Oro
                            </div>
                            {!isPurchased && !isLocked && (
                              <ChevronRight size={16} className="text-blue-500" />
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {!isPurchased ? (
                              <button 
                                disabled={player.gold < item.cost || isLocked}
                                onClick={() => buyUpgrade(item)}
                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold uppercase text-[10px] rounded-lg transition-all shadow-sm"
                              >
                                Compra
                              </button>
                            ) : (
                              <button 
                                disabled={cannotSell}
                                onClick={() => sellUpgrade(item)}
                                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 disabled:opacity-40 font-bold uppercase text-[10px] rounded-lg transition-all"
                              >
                                {cannotSell ? 'In uso' : 'Vendi'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'GUILD' && (
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
                    onClick={() => setGameState('BOARD')} 
                    className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase rounded-xl transition-all shadow-sm active:scale-95 border border-stone-300"
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
                          onClick={() => buyBadge(badge)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 shadow-sm ${
                            isOwned
                              ? 'bg-stone-50 border-stone-200 opacity-75 cursor-default'
                              : 'bg-white border-stone-200 hover:border-indigo-300 active:scale-[0.98]'
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
          )}

          {gameState === 'JOURNAL' && (
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
                  onClick={() => { setGameState('BOARD'); setSelectedJournalQuest(null); }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all text-xs font-bold uppercase flex items-center gap-2 border border-stone-300"
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
                      (player.questHistory || []).map((entry, idx) => (
                        <button
                          key={entry.id}
                          onClick={() => setSelectedJournalQuest(entry)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
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
          )}

          {gameState === 'RESULTS' && (
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
                    {rewards?.goldSurplus > 0 && (
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2 text-xs">
                        <span className="text-stone-500 font-medium">Bonus Eccedenze</span>
                        <span className="font-bold text-amber-600">+{rewards?.goldSurplus} Oro</span>
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
                      <span className={`text-2xl font-bold tabular-nums ${rewards?.pr >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                        {rewards?.pr > 0 ? '+' : ''}{rewards?.pr} <span className="text-sm font-semibold text-stone-500">PR</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={completeQuest}
                className="px-8 py-3 bg-stone-900 text-white font-bold uppercase text-xs rounded-xl hover:bg-stone-800 transition-all active:scale-95 shadow-sm flex items-center gap-2"
              >
                {rewards?.isFailure ? "Continua Carriera" : "Prossima Tappa"} <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
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
                onClick={resetGame}
                className="px-8 py-3.5 bg-stone-900 text-white font-bold uppercase text-xs rounded-xl hover:bg-stone-800 active:scale-95 transition-all shadow-sm flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Torna al Menu Principale
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Overlays */}
      <AnimatePresence>
        {itemDetail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" 
              onClick={() => setItemDetail(null)} 
            />
            
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <button 
                onClick={() => setItemDetail(null)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg"
              >
                <X size={20} />
              </button>
              
              <div className="flex gap-5 items-start">
                <div className={`shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center ${
                  itemDetail.category === 'badge' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 
                  itemDetail.category === 'stat' ? 'bg-stone-100 border-stone-200 text-stone-700' :
                  'bg-amber-50 border-amber-200 text-amber-600'
                }`}>
                  {React.createElement(itemDetail.icon || Shield, { size: 28 })}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-stone-900 uppercase">
                      {itemDetail.name}
                    </h3>
                    {itemDetail.category !== 'stat' && (itemDetail.category === 'badge' ? player.badges.includes(itemDetail.id) : player.upgrades.includes(itemDetail.id)) && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
                        Attivo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-3">
                    {itemDetail.category === 'badge' 
                      ? (player.badges.includes(itemDetail.id) ? 'Badge Attivo' : 'Proprietà del Badge') 
                      : itemDetail.category === 'stat'
                      ? 'Statistica Giocatore'
                      : (player.upgrades.includes(itemDetail.id) ? 'Modulo Installato' : 'Effetto Modulo')}
                  </p>
                  
                  <p className="text-stone-600 text-xs leading-relaxed font-medium">
                    "{itemDetail.description || itemDetail.effect}"
                  </p>

                  {itemDetail.category !== 'stat' && (
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-stone-100 text-xs font-bold uppercase">
                      {(itemDetail.category === 'badge' ? player.badges.includes(itemDetail.id) : player.upgrades.includes(itemDetail.id)) ? (
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 size={16} />
                          Questo componente è attualmente installato
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Lock size={16} />
                          {itemDetail.category === 'badge' 
                            ? 'Badge non ancora ottenuto' 
                            : 'Acquistabile presso il Fabbro'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {departureConfirmationQuest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" 
              onClick={() => setDepartureConfirmationQuest(null)} 
            />
            
            <div className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => setDepartureConfirmationQuest(null)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1.5 rounded-lg"
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
                    <span className="text-stone-800 font-bold">Sei sicuro di voler partire?</span> Incarico per <strong className="text-stone-900">{departureConfirmationQuest.destination}</strong> ({departureConfirmationQuest.length} tappe • {departureConfirmationQuest.type})
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
                        onClick={() => setDepartureConfirmationQuest(q)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          departureConfirmationQuest.destination === q.destination
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
                  player.goods >= departureConfirmationQuest.goods 
                    ? 'bg-emerald-50/60 border-emerald-200' 
                    : 'bg-rose-50/70 border-rose-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      player.goods >= departureConfirmationQuest.goods 
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
                          Carico a bordo: {player.goods} / {departureConfirmationQuest.goods} casse
                        </span>
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          player.goods >= departureConfirmationQuest.goods 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {player.goods >= departureConfirmationQuest.goods ? 'Pronto' : 'Insufficiente'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        {player.goods >= departureConfirmationQuest.goods 
                          ? 'Hai le merci necessarie per portare a termine con successo l\'incarico.' 
                          : `Ti mancano ${departureConfirmationQuest.goods - player.goods} casse. Puoi acquistarne all'Emporio prima di partire.`}
                      </p>
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
                    </div>
                  </div>
                </div>

                {/* Domanda 3: Oro per Fabbro o Emporio */}
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <PixelCoins size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-stone-900 leading-snug">
                        Hai ancora <span className="text-amber-800 font-black">{player.gold} Oro</span> che puoi usare, vuoi migliorare il carretto dal fabbro? Oppure acquistare qualcosa all'emporio?
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5 mb-2.5 font-medium">
                        Puoi spendere l'oro disponibile per riparare o potenziare il carretto, oppure rifornirti di merci e provviste.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setDepartureConfirmationQuest(null);
                            setGameState('BLACKSMITH');
                          }}
                          className="px-3 py-2 bg-white hover:bg-sky-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-sky-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <PixelBlacksmith size={16} className="text-sky-600" />
                          <span>Migliora dal Fabbro</span>
                        </button>

                        <button
                          onClick={() => {
                            setDepartureConfirmationQuest(null);
                            setGameState('EMPORIO');
                          }}
                          className="px-3 py-2 bg-white hover:bg-amber-50 text-stone-800 font-bold rounded-xl border border-stone-200 hover:border-amber-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <PixelStore size={16} className="text-amber-600" />
                          <span>Acquista all'Emporio</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domanda 4: Punti Reputazione e Gilda */}
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

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setDepartureConfirmationQuest(null);
                            setGameState('GUILD');
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-950 font-bold rounded-xl border border-indigo-200 hover:border-indigo-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <PixelGuild size={16} className="text-indigo-600" />
                          <span>Vai alla Gilda</span>
                        </button>

                        <button
                          onClick={() => {
                            setDepartureConfirmationQuest(null);
                            setGameState('TAVERN');
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-amber-50 text-stone-700 font-semibold rounded-xl border border-stone-200 hover:border-amber-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <PixelTavern size={16} className="text-amber-700" />
                          <span>Riposa in Taverna</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottoni di conferma/annulla */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setDepartureConfirmationQuest(null)}
                  className="w-full sm:w-auto px-5 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Rimani in Città
                </button>

                <button
                  onClick={() => {
                    const q = departureConfirmationQuest;
                    setDepartureConfirmationQuest(null);
                    acceptQuest(q);
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Conferma e Parti</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

