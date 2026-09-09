import { LucideIcon } from 'lucide-react';

export type GameState = 
  | 'START' 
  | 'BOARD' 
  | 'JOURNEY' 
  | 'SHOP' 
  | 'GUILD' 
  | 'RESULTS' 
  | 'GAMEOVER' 
  | 'EMPORIO' 
  | 'BLACKSMITH' 
  | 'TAVERN' 
  | 'JOURNAL' 
  | 'GATES'
  | 'EXIT'
  | 'MANUAL';

export interface PlayerStats {
  totalDays: number;
  completedQuests: number;
  totalGoldEarned: number;
  monstersFaced: number;
  daysInTavern: number;
  totalGoodsDelivered: number;
  deathReason: string;
}

export interface PlayerConsumables {
  repairKits: number;
  lanternOil: number;
}

export interface PlayerState {
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
  consumables: PlayerConsumables;
  currentLocation: string;
  questHistory: QuestHistoryEntry[];
  stats: PlayerStats;
}

export interface Quest {
  type: 'Breve' | 'Media' | 'Lunga';
  length: number;
  goods: number;
  goldMultiplier: number;
  destination: string;
  origin?: string;
  reward?: number;
}

export interface QuestHistoryEntry {
  id: string;
  date: number;
  quest: Quest;
  rewards: Rewards;
  journey: (StepResult | null)[];
  status: 'success' | 'failure';
}

export interface Rewards {
  isFailure: boolean;
  reason?: string;
  goodsDelivered?: number;
  goldQuest?: number;
  goldSurplus?: number;
  totalGold?: number;
  pr: number;
  prReason?: string;
  tag?: string;
  motivation?: string;
  targetHigh?: number;
  targetLow?: number;
}

export type QuestRewards = Rewards;
export type JournalEntry = QuestHistoryEntry;

export interface WeatherData {
  name: string;
  hpDamage: number;
  extraDays: number;
  desc: string;
  icon: LucideIcon;
}

export interface TerrainData {
  name: string;
  damage: number;
  time: number;
  desc: string;
  icon: LucideIcon;
}

export interface StructureData {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  options: { id: string; label: string; sub: string }[];
}

export interface EventData {
  id?: string;
  name: string;
  icon: LucideIcon;
  description: string;
  options: { id: string; label: string; sub: string }[];
}

export interface WeatherReport {
  name: string;
  damage: number;
  days: number;
  mitigation: string[];
  desc?: string;
  goodsLost?: number;
  motivation?: string;
}

export interface TerrainReport {
  name: string;
  damage: number;
  days: number;
  goodsLost: number;
  motivation: string;
  mitigation: string[];
  desc?: string;
}

export interface EventReport {
  name: string;
  description: string;
  outcome?: string;
}

export interface StructureReport {
  name: string;
  description: string;
  outcome?: string;
  icon?: LucideIcon;
}

export interface StepResult {
  origin: string;
  destination: string;
  weather: WeatherData;
  terrain: TerrainData;
  weatherReport: WeatherReport;
  terrainReport: TerrainReport;
  structureData: StructureData;
  event: string;
  eventData: EventData;
  eventReport: EventReport;
  structureReport: StructureReport;
  armorMitigationNote: string;
  goodsLossNote: string;
  totalDamage: number;
  detailedDamage: {
    weather: number;
    terrain: number;
    event: number;
    structure: number;
  };
  detailedDays: {
    weather: number;
    terrain: number;
    event: number;
  };
  stepDays: number;
  totalDaysPassed: number;
  goodsLost: number;
  goodsLostWeather: number;
  goodsLostTerrain: number;
  goodsLostEvent: number;
  goodsLostStructure: number;
  goodsLostMotivation: string;
  activeUpgrades: string[];
  activeBadges: string[];
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'damage' | 'info' | 'success' | 'warning';
  motivation?: string;
  mitigation?: string[];
  stepDays?: number;
  totalDamage?: number;
  goodsLost?: number;
  goodsLostMotivation?: string;
  goodsLossNote?: string;
  armorBonus?: number;
  totalDaysPassed?: number;
  detailedDays?: { weather?: number; terrain?: number; event?: number; structure?: number };
  detailedDamage?: { weather?: number; terrain?: number; event?: number; structure?: number };
  weatherReport?: WeatherReport;
  terrainReport?: TerrainReport;
  eventReport?: EventReport;
  structureReport?: StructureReport;
  activeUpgrades?: string[];
  activeBadges?: string[];
}

export interface RevealedStageCards {
  terrain: boolean;
  weather: boolean;
  structure: boolean;
  event: boolean;
}

export interface InspectedIcon {
  step: number;
  type: 'weather' | 'terrain' | 'structure' | 'event';
}

export interface ActiveEncounter {
  type: number;
  data: EventData;
  logId: string;
  weather: string;
  name?: string;
}

export interface ActiveStructure {
  id: string;
  data: StructureData;
  logId: string;
}

export interface ItemDetail {
  id: string;
  name: string;
  description?: string;
  effect?: string;
  category: 'badge' | 'stat' | 'upgrade';
  icon?: LucideIcon | any;
  color?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  type: 'upgrade' | 'consumable';
  effect: string;
  icon: LucideIcon;
}

export interface Badge {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}
