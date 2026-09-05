import React, { useState } from 'react';
import {
  EVENT_TABLE,
  STRUCTURE_TABLE,
  WEATHER_TABLE,
  CAVERN_WEATHER,
  TERRAIN_TABLE,
  BADGES,
  SHOP_ITEMS,
  TAVERN_INFO,
  QUEST_TYPES,
} from '../gameMechanics';

const CATEGORIES = [
  { id: 'general', label: 'Generale' },
  { id: 'quests', label: 'Quest' },
  { id: 'events', label: 'Eventi' },
  { id: 'structures', label: 'Strutture' },
  { id: 'weather', label: 'Meteo' },
  { id: 'cavern', label: 'Meteo Caverne' },
  { id: 'terrain', label: 'Terreni' },
  { id: 'badges', label: 'Distintivi' },
  { id: 'shop', label: 'Emporio' },
  { id: 'tavern', label: 'Taverna' },
];

export default function GameManual() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return renderGeneral();
      case 'quests':
        return renderGrid(QUEST_TYPES);
      case 'events':
        return renderGrid(EVENT_TABLE);
      case 'structures':
        return renderGrid(STRUCTURE_TABLE.filter(s => s.id !== 'none'));
      case 'weather':
        return renderGrid(WEATHER_TABLE);
      case 'cavern':
        return renderGrid(CAVERN_WEATHER);
      case 'terrain':
        return renderGrid(TERRAIN_TABLE);
      case 'badges':
        return renderGrid(BADGES);
      case 'shop':
        return renderGrid(SHOP_ITEMS);
      case 'tavern':
        return renderGrid(TAVERN_INFO);
      default:
        return null;
    }
  };

  const renderGeneral = () => (
    <div className="space-y-6 text-stone-700 max-w-4xl mx-auto py-4">
      <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
        <h2 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
          L'Idea del Gioco
        </h2>
        <p className="leading-relaxed">
          In questo simulatore di carovane commerciali, vesti i panni di un mercante itinerante. Il tuo obiettivo è consegnare merci preziose tra diverse città, navigando attraverso percorsi pericolosi, meteo imprevedibile e incontri inaspettati.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
          <h3 className="text-lg font-bold text-amber-800 mb-3">Consegna Merci</h3>
          <p className="text-sm leading-relaxed text-stone-600">
            Dalla Bacheca degli Incarichi in Taverna, potrai scegliere diverse spedizioni. Ogni incarico specifica una destinazione, una ricompensa in Oro e la tipologia di merce trasportata. Portare a termine una consegna con successo ti permetterà di accumulare ricchezza.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
          <h3 className="text-lg font-bold text-amber-800 mb-3">Upgrade del Carretto</h3>
          <p className="text-sm leading-relaxed text-stone-600">
            L'oro guadagnato può essere investito nell'Emporio per potenziare il tuo carretto. Puoi rinforzare la struttura (HP), aggiungere piastre di ferro per mitigare i danni da combattimento o installare ruote migliori per i terreni difficili. Ogni upgrade aumenta le tue probabilità di sopravvivenza.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
          <h3 className="text-lg font-bold text-rose-700 mb-3">Sopravvivenza (HP)</h3>
          <p className="text-sm leading-relaxed text-stone-600">
            L'integrità del tuo carretto è fondamentale. Se gli HP raggiungono lo zero durante un viaggio, il carretto si rompe irrimediabilmente e la partita termina in Game Over. È vitale riparare il carretto nelle strutture lungo la strada o negli empori delle città prima che sia troppo tardi.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
          <h3 className="text-lg font-bold text-cyan-800 mb-3">Bilanciamento Strategico</h3>
          <p className="text-sm leading-relaxed text-stone-600">
            La chiave per la longevità è il bilanciamento. Non spendere tutto il tuo oro in merci costose se il tuo carretto è danneggiato. Risparmiare per un upgrade cruciale potrebbe essere più importante di un rapido profitto. Valuta sempre il rischio del percorso rispetto alla tua attuale resistenza.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 md:col-span-2">
          <h3 className="text-lg font-bold text-indigo-700 mb-3">La Carta Tappa</h3>
          <p className="text-sm leading-relaxed text-stone-600 mb-3">
            Ogni mossa durante il viaggio rappresenta una "Tappa". Una carta tappa è composta da quattro elementi casuali che determinano cosa accade al tuo carretto:
          </p>
          <ul className="list-disc list-inside text-xs space-y-2 text-stone-600">
            <li><span className="text-amber-700 font-bold">Meteo:</span> Influenza la visibilità e l'usura (es. il sole danneggia il legno, la pioggia rallenta).</li>
            <li><span className="text-emerald-700 font-bold">Terreno:</span> Determina il logorio base e quanto tempo (giorni) impieghi per attraversarlo.</li>
            <li><span className="text-rose-700 font-bold">Evento:</span> Incontri casuali come Banditi, Animali o Viandanti che richiedono scelte strategiche.</li>
            <li><span className="text-blue-700 font-bold">Struttura:</span> Punti di interesse come Villaggi o Torri che offrono servizi o bonus temporanei.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="manual-grid">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            {item.icon && <item.icon className="w-5 h-5 text-amber-600" />}
            <h3 className="font-bold text-base text-stone-900">{item.name}</h3>
          </div>
          {item.description && <p className="text-xs text-stone-600">{item.description}</p>}
          {item.desc && <p className="text-xs text-stone-600">{item.desc}</p>}
          {item.effect && <p className="text-xs text-stone-500 italic">{item.effect}</p>}
          
          <div className="flex flex-col gap-1 mt-1">
            {item.hpDamage !== undefined && item.hpDamage !== 0 && (
              <p className="text-xs font-bold text-rose-600">Danno HP: {item.hpDamage > 0 ? `-${item.hpDamage}` : `+${Math.abs(item.hpDamage)}`}</p>
            )}
            {item.extraDays !== undefined && item.extraDays !== 0 && (
              <p className="text-xs font-bold text-cyan-700">Giorni Extra: +{item.extraDays}</p>
            )}
            {item.damage !== undefined && item.damage !== 0 && (
              <p className="text-xs font-bold text-rose-600">Logorio: {item.damage} HP</p>
            )}
            {item.time !== undefined && (
              <p className="text-xs font-bold text-amber-700">Tempo base: {item.time} Giorni</p>
            )}
            {item.options && item.options.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Opzioni Disponibili:</p>
                {item.options.map((opt: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs bg-stone-50 border border-stone-200 p-1.5 rounded-lg">
                    <span className="text-stone-700">{opt.label}</span>
                    <span className="text-amber-700 font-semibold">{opt.sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 flex flex-wrap gap-2 border-t border-stone-100">
            {item.cost && <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-bold">Costo: {item.cost} Oro</span>}
            {item.type && <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-semibold uppercase">{item.type}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6" id="game-manual">
      <h1 className="text-3xl font-bold text-stone-900 mb-6 text-center">Manuale di Gioco</h1>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
}
