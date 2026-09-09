import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  X, 
  Shield, 
  Truck, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Lock,
  Wrench,
  FlameKindling
} from 'lucide-react';
import { PixelCoins, PixelCrate } from './PixelIcon';
import { ItemDetail, PlayerState } from '../types';

interface InfoBarProps {
  itemDetail: ItemDetail | null;
  player: PlayerState;
  onClose: () => void;
}

export const InfoBar: React.FC<InfoBarProps> = ({
  itemDetail,
  player,
  onClose,
}) => {
  if (!itemDetail) {
    return (
      <div className="w-full bg-stone-50/95 border-b border-stone-200 px-4 py-2 select-none font-sans z-35 shadow-2xs">
        <div className="max-w-5xl w-full mx-auto flex items-start sm:items-center gap-2.5 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200/70 border border-stone-300 text-stone-700 text-[10px] font-black uppercase tracking-wider shrink-0">
            <Info size={12} className="text-stone-600" />
            Info
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-stone-500 leading-normal">
            Clicca su <strong className="text-stone-700 font-bold">Giorni</strong>, <strong className="text-stone-700 font-bold">Oro</strong>, <strong className="text-stone-700 font-bold">Reputazione</strong>, <strong className="text-stone-700 font-bold">Integrità</strong>, <strong className="text-stone-700 font-bold">Merci</strong>, <strong className="text-stone-700 font-bold">Armatura</strong>, <strong className="text-stone-700 font-bold">Upgrade</strong> o <strong className="text-stone-700 font-bold">Badge</strong> per visualizzarne i dettagli in questa scheda.
          </span>
        </div>
      </div>
    );
  }

  const isDays = itemDetail.id === 'stat-days';
  const isGold = itemDetail.id === 'stat-gold';
  const isPr = itemDetail.id === 'stat-pr';
  const isHp = itemDetail.id === 'stat-hp';
  const isGoods = itemDetail.id === 'stat-goods';
  const isArmour = itemDetail.id === 'stat-armour';
  const isOil = itemDetail.id === 'stat-oil';
  const isUpgrade = itemDetail.category === 'upgrade';
  const isBadge = itemDetail.category === 'badge';

  const isInstalledUpgrade = isUpgrade && player.upgrades.includes(itemDetail.id);
  const isUnlockedBadge = isBadge && player.badges.includes(itemDetail.id);

  // Render Icon
  const renderIcon = () => {
    if (isDays) return <Calendar size={18} />;
    if (isGold) return <PixelCoins size={18} />;
    if (isPr) return <Star size={18} />;
    if (isHp) return <Truck size={18} />;
    if (isGoods) return <PixelCrate size={18} />;
    if (isArmour) return <Shield size={18} />;
    if (isOil) return <FlameKindling size={18} />;
    if (itemDetail.icon) return React.createElement(itemDetail.icon, { size: 18 });
    return <Info size={18} />;
  };

  // Badge / Pill status
  const renderStatusPill = () => {
    if (isDays) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-stone-200/80 border border-stone-300 text-stone-800 text-[10px] font-black">
          {player.stats.totalDays} Giorni Totali
        </span>
      );
    }
    if (isGold) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black flex items-center gap-1">
          <PixelCoins size={12} /> {player.gold} Monete
        </span>
      );
    }
    if (isPr) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-indigo-100 border border-indigo-200 text-indigo-900 text-[10px] font-black">
          {player.pr} PR
        </span>
      );
    }
    if (isHp) {
      const colorClass = player.hp > 15 
        ? 'bg-emerald-100 border-emerald-300 text-emerald-900' 
        : player.hp < 5 
        ? 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse' 
        : 'bg-amber-100 border-amber-300 text-amber-900';
      return (
        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black ${colorClass}`}>
          {player.hp} / {player.hpMax} HP
        </span>
      );
    }
    if (isGoods) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black">
          {player.goods} / {player.capacity} unità
        </span>
      );
    }
    if (isArmour) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-sky-100 border border-sky-300 text-sky-900 text-[10px] font-black">
          {player.armour} PT Assorbimento
        </span>
      );
    }
    if (isOil) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-sky-100 border border-sky-300 text-sky-900 text-[10px] font-black flex items-center gap-1">
          <FlameKindling size={12} /> {player.consumables.lanternOil} Cariche
        </span>
      );
    }
    if (isUpgrade) {
      if (isInstalledUpgrade) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black">
            <CheckCircle2 size={12} /> Installato
            {itemDetail.id === 'lantern' && ` (${player.consumables.lanternOil} cariche)`}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200 border border-stone-300 text-stone-600 text-[10px] font-bold">
          <Lock size={12} /> Non Installato
        </span>
      );
    }
    if (isBadge) {
      if (isUnlockedBadge) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 border border-indigo-300 text-indigo-800 text-[10px] font-black">
            <CheckCircle2 size={12} /> Badge Attivo
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200 border border-stone-300 text-stone-600 text-[10px] font-bold">
          <Lock size={12} /> Da Sbloccare
        </span>
      );
    }
    return null;
  };

  // Icon container style
  const getIconContainerStyle = () => {
    if (isGold || isGoods) return 'bg-amber-100 border-amber-300 text-amber-800';
    if (isArmour || isOil) return 'bg-sky-100 border-sky-300 text-sky-800';
    if (isPr || (isBadge && isUnlockedBadge)) return 'bg-indigo-100 border-indigo-300 text-indigo-800';
    if (isHp) {
      return player.hp > 15 
        ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
        : player.hp < 5 
        ? 'bg-rose-100 border-rose-300 text-rose-800' 
        : 'bg-amber-100 border-amber-300 text-amber-800';
    }
    if (isUpgrade && isInstalledUpgrade) return 'bg-emerald-100 border-emerald-300 text-emerald-800';
    return 'bg-stone-200 border-stone-300 text-stone-700';
  };

  return (
    <div className="w-full bg-stone-50/95 border-b border-stone-200 px-4 py-2 select-none font-sans z-35 shadow-2xs">
      <div className="max-w-5xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={itemDetail.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="flex items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              {/* Icona */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 sm:mt-0 ${getIconContainerStyle()}`}>
                {renderIcon()}
              </div>

              {/* Informazioni testuali */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-stone-900 uppercase tracking-wide text-xs">
                    {itemDetail.name}
                  </span>
                  {renderStatusPill()}
                </div>

                <p className="text-stone-600 font-medium text-[11px] sm:text-xs leading-normal">
                  {itemDetail.description || itemDetail.effect}
                </p>
              </div>

              {/* Tag di supporto sul lato destro */}
              {isHp && (
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-bold shrink-0 ml-auto">
                  <Wrench size={12} className="text-amber-600" />
                  Kit Riparazione: {player.consumables.repairKits}
                </span>
              )}
              {isGoods && (
                <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-bold shrink-0 ml-auto">
                  Spazio libero: {Math.max(0, player.capacity - player.goods)}
                </span>
              )}
              {isArmour && (
                <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-bold shrink-0 ml-auto">
                  Assorbimento: -{player.armour} danno/evento
                </span>
              )}
              {isOil && (
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-bold shrink-0 ml-auto">
                  <FlameKindling size={12} className="text-sky-600" />
                  {player.upgrades.includes('lantern') ? 'Lanterna Rinforzata Equipaggiata' : 'Lanterna Non Acquistata'}
                </span>
              )}
              {isUpgrade && (
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-bold shrink-0 ml-auto">
                  {isInstalledUpgrade ? 'Installato sul carretto' : 'Disponibile dal Fabbro'}
                </span>
              )}
              {isBadge && (
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-bold shrink-0 ml-auto">
                  {isUnlockedBadge ? 'Privilegio Permanente' : 'Gilda dei Mercanti'}
                </span>
              )}
            </div>

            {/* Pulsante chiusura info */}
            <button
              onClick={onClose}
              title="Chiudi info"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X size={16} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InfoBar;
