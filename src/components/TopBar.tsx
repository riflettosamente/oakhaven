import React from 'react';
import { 
  User, 
  Calendar, 
  Star, 
  Truck, 
  Shield, 
  Wrench, 
  FlameKindling 
} from 'lucide-react';
import { PixelCoins, PixelCrate } from './PixelIcon';
import { PlayerState, ItemDetail } from '../types';
import { BADGES, SHOP_ITEMS } from '../gameMechanics';

interface TopBarProps {
  player: PlayerState;
  itemDetail: ItemDetail | null;
  setItemDetail: (val: ItemDetail | null) => void;
  useRepairKit: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  player,
  itemDetail,
  setItemDetail,
  useRepairKit
}) => {
  const isMechanic = player.badges?.includes('meccanico_esperto');
  const healAmount = isMechanic ? 10 : 5;
  const hasLantern = player.upgrades.includes('lantern');
  return (
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
        <button
          onClick={() => setItemDetail(itemDetail?.id === 'stat-hp' ? null : {
            id: 'stat-hp',
            name: 'Integrità Carretto',
            description: 'Rappresenta la salute strutturale del tuo carretto. Se scende a 0 HP la spedizione fallisce. Riparalo usando i Kit di Riparazione o dal Fabbro in città.',
            category: 'stat',
            icon: Truck,
            color: 'text-amber-600'
          })}
          className={`flex-1 w-full max-w-md p-1.5 rounded-xl text-left transition-all cursor-pointer ${
            itemDetail?.id === 'stat-hp' 
              ? 'bg-amber-50/70 ring-1 ring-amber-300' 
              : 'hover:bg-stone-50'
          }`}
          title="Dettagli Integrità Carretto"
        >
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
        </button>

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
        <div className="relative group">
          <button 
            disabled={player.consumables.repairKits === 0 || player.hp >= player.hpMax}
            onClick={useRepairKit}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 disabled:opacity-40 transition-all rounded-lg text-xs font-bold border border-stone-200 text-stone-800 shadow-xs cursor-pointer"
            title={`Usa 1 Kit Riparazione: ripristina +${healAmount} HP all'Integrità del carretto (max ${player.hpMax} HP)`}
          >
            <Wrench size={16} className="text-amber-600"/> Ripara ({player.consumables.repairKits})
          </button>

          {/* Mouseover Info */}
          <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col w-64 p-3 bg-stone-900 text-white rounded-xl shadow-xl z-50 pointer-events-none border border-stone-700">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs mb-1">
              <Wrench size={14} /> Usa Kit di Riparazione
            </div>
            <p className="text-[11px] text-stone-200 leading-relaxed">
              Consuma <strong>1 Kit Riparazione</strong> per ripristinare <strong>+{healAmount} HP</strong> all'Integrità del carretto (fino al massimo di {player.hpMax} HP).
            </p>
            {!isMechanic && (
              <p className="text-[10px] text-stone-400 mt-1 italic">
                * Con il badge "Meccanico Esperto" il recupero sale a +10 HP.
              </p>
            )}
            <div className="mt-2 pt-2 border-t border-stone-700/80 text-[10px]">
              {player.hp >= player.hpMax ? (
                <span className="text-amber-300 font-semibold">⚠️ Integrità già al massimo ({player.hp}/{player.hpMax} HP).</span>
              ) : player.consumables.repairKits === 0 ? (
                <span className="text-rose-300 font-semibold">⚠️ Nessun kit disponibile (acquistabile all'Emporio).</span>
              ) : (
                <span className="text-emerald-400 font-semibold">✓ Clicca per riparare il carretto (+{healAmount} HP).</span>
              )}
            </div>
          </div>
        </div>
        <div className="relative group">
          <button
            onClick={() => {
              const isSelected = itemDetail?.id === 'stat-oil';
              setItemDetail(isSelected ? null : {
                id: 'stat-oil',
                name: 'Cariche Olio & Lanterna',
                description: "L'Olio alimenta la Lanterna a Olio durante il viaggio: viene consumato automaticamente nelle tappe con Nebbia Fitta o Buio/Caverne per annullare ritardi (+0 Giorni) ed evitare imboscate. Non si consuma cliccando.",
                category: 'stat',
                icon: FlameKindling
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 rounded-lg text-xs font-bold border shadow-xs transition-all cursor-pointer ${
              itemDetail?.id === 'stat-oil' ? 'ring-2 ring-sky-500 bg-sky-50/50 ' : ''
            }${player.consumables.lanternOil === 0 ? 'text-rose-600 border-rose-200' : 'text-sky-700 border-stone-200'}`}
            title="Cariche Olio Lanterna: clicca per visualizzare le informazioni d'uso nella scheda Info"
          >
            <FlameKindling size={16} /> Olio ({player.consumables.lanternOil})
          </button>

          {/* Mouseover Info */}
          <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col w-72 p-3 bg-stone-900 text-white rounded-xl shadow-xl z-50 pointer-events-none border border-stone-700">
            <div className="flex items-center gap-1.5 font-bold text-sky-400 text-xs mb-1">
              <FlameKindling size={14} /> Cariche Olio Lanterna
            </div>
            <div className="space-y-1.5 text-[11px] text-stone-200 leading-relaxed">
              <p>
                <strong className="text-white">Cosa accade cliccando:</strong> apre la scheda informativa nella barra <em>Info</em> con i dettagli sulla Lanterna e le regole di consumo.
              </p>
              <p className="text-stone-300">
                <strong className="text-white">Uso in viaggio:</strong> l'Olio <u>non si consuma al click</u>, ma viene utilizzato <strong>automaticamente</strong> dalla Lanterna quando si attraversano zone con <strong>Nebbia Fitta</strong> o <strong>Caverne/Buio</strong> per evitare ritardi (+1 giorno) ed imboscate.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-700/80 text-[10px]">
              {!hasLantern ? (
                <span className="text-amber-300 font-semibold">⚠️ Lanterna a Olio non acquistata (disponibile all'Emporio).</span>
              ) : player.consumables.lanternOil === 0 ? (
                <span className="text-rose-300 font-semibold">⚠️ Nessuna carica d'olio (acquistabile all'Emporio o dagli osti).</span>
              ) : (
                <span className="text-emerald-400 font-semibold">✓ {player.consumables.lanternOil} carica/he pronta/e all'uso automatico.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
