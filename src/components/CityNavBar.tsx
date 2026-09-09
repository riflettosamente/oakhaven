import React from 'react';
import { Landmark, LogOut } from 'lucide-react';
import { 
  PixelQuest, 
  PixelStore, 
  PixelBlacksmith, 
  PixelTavern, 
  PixelGuild, 
  PixelBook 
} from './PixelIcon';
import { GameState } from '../types';

interface CityNavBarProps {
  currentZone: GameState;
  onNavigate: (state: GameState) => void;
}

interface CityZoneTab {
  id: GameState;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CITY_ZONES: CityZoneTab[] = [
  { id: 'BOARD', label: 'Bacheca', icon: PixelQuest },
  { id: 'EMPORIO', label: 'Emporio', icon: PixelStore },
  { id: 'BLACKSMITH', label: 'Fabbro', icon: PixelBlacksmith },
  { id: 'TAVERN', label: 'Taverna', icon: PixelTavern },
  { id: 'GUILD', label: 'Gilda', icon: PixelGuild },
  { id: 'JOURNAL', label: 'Diario', icon: PixelBook },
  { id: 'GATES', label: 'Porte', icon: Landmark },
  { id: 'EXIT', label: 'Esci', icon: LogOut },
];

export const CityNavBar: React.FC<CityNavBarProps> = ({
  currentZone,
  onNavigate,
}) => {
  return (
    <div className="w-full bg-white/95 border-b border-stone-200 px-3 sm:px-6 py-2 select-none font-sans z-30 shadow-xs overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-max mx-auto">
        {CITY_ZONES.map((zone) => {
          const isActive = currentZone === zone.id;
          const isExit = zone.id === 'EXIT';
          const Icon = zone.icon;
          return (
            <button
              key={zone.id}
              onClick={() => onNavigate(zone.id)}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 active:scale-95 ${
                isActive
                  ? isExit
                    ? 'bg-rose-600 text-white font-black shadow-xs border border-rose-600'
                    : 'bg-stone-900 text-white font-black shadow-xs border border-stone-900'
                  : isExit
                  ? 'bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 font-bold border border-stone-200 hover:border-rose-200'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 font-bold border border-stone-200'
              }`}
            >
              <Icon size={16} className={isActive ? (isExit ? 'text-white' : 'text-amber-400') : (isExit ? 'text-rose-600' : 'text-stone-600')} />
              <span>{zone.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
