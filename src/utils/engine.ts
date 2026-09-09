import { 
  PlayerState, 
  Quest, 
  Rewards, 
  StepResult,
  WeatherData,
  TerrainData,
  StructureData,
  EventData
} from '../types';
import {
  EVENT_TABLE,
  STRUCTURE_TABLE,
  WEATHER_TABLE,
  CAVERN_WEATHER,
  TERRAIN_TABLE,
  SHOP_ITEMS,
  generateTownName
} from '../gameMechanics';

export const rollDice = (sides: number): number => Math.floor(Math.random() * sides) + 1;

export const getNewQuests = (location: string): Quest[] => {
  const types: ('Breve' | 'Media' | 'Lunga')[] = ['Breve', 'Media', 'Lunga'];
  
  return types.map((type) => {
    let length = 0;
    const d3 = Math.ceil(rollDice(6) / 2);
    if (type === 'Breve') length = d3 + 1;
    else if (type === 'Media') length = d3 + 4;
    else if (type === 'Lunga') length = d3 + 7;

    const multi = type === 'Breve' ? 2 : type === 'Media' ? 3 : 4;
    const goods = rollDice(10);
    let dest = generateTownName();
    while (dest === location) {
      dest = generateTownName();
    }
    return { type, length, goods, goldMultiplier: multi, destination: dest };
  });
};

export interface StepEffectsOutput {
  result: StepResult;
  rolls: { weather: number; terrain: number; event: number; structure: number };
  eventRoll: number;
  structure: StructureData;
  event: EventData;
  totalDamage: number;
  totalDays: number;
  totalGoodsLost: number;
  weather: WeatherData;
  terrain: TerrainData;
}

export const calculateStepEffects = (
  player: PlayerState,
  currentQuest: Quest,
  journeyStep: number
): StepEffectsOutput => {
  const tRoll = rollDice(12);
  const wRoll = rollDice(6);
  const eRoll = rollDice(7);
  const sRoll = rollDice(10);

  const terrain = TERRAIN_TABLE[tRoll - 1] as unknown as TerrainData;
  const weather = (terrain.name === 'Caverna' 
    ? CAVERN_WEATHER[wRoll - 1] 
    : WEATHER_TABLE[wRoll - 1]) as unknown as WeatherData;
  const structure = STRUCTURE_TABLE[sRoll - 1] as unknown as StructureData;
  const event = EVENT_TABLE[eRoll - 1] as unknown as EventData;

  const weatherReport = {
    name: weather.name,
    damage: weather.hpDamage,
    days: weather.extraDays,
    mitigation: [] as string[]
  };

  const terrainReport = {
    name: terrain.name,
    damage: terrain.damage,
    days: terrain.time,
    goodsLost: 0,
    motivation: "",
    mitigation: [] as string[]
  };

  const eventReport = {
    name: event.name,
    description: event.description,
    outcome: ""
  };

  const structureReport = {
    name: structure.name,
    description: structure.description,
    outcome: "",
    icon: structure.icon
  };

  let goodsLostWeather = 0;
  let goodsLostTerrain = 0;
  const goodsLostEvent = 0;
  const goodsLostStructure = 0;

  let eventDmg = 0;
  let structDmg = 0;

  let totalArmour = 0;
  if (player.upgrades.includes('steel_frame')) totalArmour = 4;
  else if (player.upgrades.includes('iron_plates')) totalArmour = 2;
  else if (player.upgrades.includes('wood_ref')) totalArmour = 1;

  let tempArmour = 0;
  if (structure.id === 'camp') {
    tempArmour = 2;
  }

  const combatReduction = totalArmour + tempArmour;
  const envReduction = 0;

  if (envReduction > 0) {
    weatherReport.mitigation.push(`Armatura: -${envReduction} HP`);
    terrainReport.mitigation.push(`Armatura: -${envReduction} HP`);
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
      terrainMit += 2;
      terrainReport.days = 0;
      terrainReport.mitigation.push("Lanterna a Olio: Percorso illuminato (-2 HP, 0 Giorni)");

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
      let chance = 0.5;
      if (player.upgrades.includes('case')) {
        chance = 0.25;
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
    }
  }

  // Special Goods Loss for Caverna Allagamento
  if (terrain.name === 'Caverna' && weather.name === 'Allagamento Improvviso') {
    if (Math.random() > 0.5) {
      goodsLostWeather = 1;
      weatherReport.mitigation.push("Allagamento: Merce persa!");
    }
  }

  // Additional Weather Goods Loss (Example: Temporale)
  if (weather.name === 'Temporale') {
    if (Math.random() > 0.8) {
      goodsLostWeather = 1;
    }
  }

  // Armor Mitigation Parts
  const actualWeatherMitArmor = Math.min(weather.hpDamage, envReduction);
  const actualTerrainMitArmor = Math.min(terrain.damage, envReduction);
  const mitParts: string[] = [];
  if (actualWeatherMitArmor > 0) mitParts.push(`-${actualWeatherMitArmor} HP (Meteo)`);
  if (actualTerrainMitArmor > 0) mitParts.push(`-${actualTerrainMitArmor} HP (Terreno)`);

  // Environmental Damage Resolution
  if (weather.name === 'Nuvoloso' && !player.upgrades.includes('springs')) {
    weatherReport.damage = -1;
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
  const totalGoodsLost = goodsLostWeather + goodsLostTerrain;

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
      const trapDmg = 5;
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
  const goodsLossParts: string[] = [];
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

  const result: StepResult = {
    origin: player.currentLocation,
    destination: currentQuest.destination,
    weather,
    terrain,
    weatherReport: { ...weatherReport, desc: weather.desc, goodsLost: goodsLostWeather, motivation: weather.name },
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

  return {
    result,
    rolls: { weather: wRoll, terrain: tRoll, event: eRoll, structure: sRoll },
    eventRoll: eRoll,
    structure,
    event,
    totalDamage: totalDmg,
    totalDays,
    totalGoodsLost,
    weather,
    terrain
  };
};

export const calculateRewards = (
  currentQuest: Quest | null,
  days: number,
  goods: number,
  badges: string[]
): Rewards | null => {
  if (!currentQuest) return null;
  
  let pr = 0;
  let prReason = "";
  
  const targetHigh = currentQuest.type === 'Breve' ? 6 : currentQuest.type === 'Media' ? 10 : 16;
  const targetLow = currentQuest.type === 'Breve' ? 12 : currentQuest.type === 'Media' ? 20 : 32;

  // CHECK FOR FAILURE: Insufficient Goods
  if (goods < currentQuest.goods) {
    return {
      isFailure: true,
      goodsDelivered: goods,
      goldQuest: 0,
      goldSurplus: 0,
      totalGold: 0,
      pr: currentQuest.type === 'Lunga' ? -10 : 0,
      prReason: "Carico Insufficiente",
      tag: "Inaffidabile",
      motivation: `Hai raggiunto ${currentQuest.destination} con solo ${goods} casse, ma ne erano richieste almeno ${currentQuest.goods}. La consegna è stata rifiutata.`,
      targetHigh,
      targetLow
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

  const baseValuePerUnit = 10;
  let goodsVal = baseValuePerUnit;
  if (badges.includes('mercante_onesto')) goodsVal += 2;
  
  const questReq = currentQuest.goods;

  const multiplierBoost = badges.includes('eroe_strade') ? 2 : 0;
  const goldFromQuest = currentQuest.reward || Math.floor((questReq * goodsVal) * (currentQuest.goldMultiplier + multiplierBoost));
  
  const totalGold = goldFromQuest;

  return {
    isFailure: false,
    totalGold,
    pr,
    goodsDelivered: questReq,
    goldQuest: goldFromQuest,
    goldSurplus: 0,
    prReason,
    targetHigh,
    targetLow,
    tag,
    motivation: ""
  };
};
