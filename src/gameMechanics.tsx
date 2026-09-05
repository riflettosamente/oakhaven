import {
  Coins,
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
  ShoppingCart,
  Zap,
  Navigation,
  Compass,
  Landmark,
  Home,
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
  BookOpen,
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
  Package
} from 'lucide-react';

export const EVENT_TABLE = [
  {
    name: 'Viandante',
    icon: Footprints,
    description: 'Offre uno scambio: puoi comprare 1 Carica Lanterna per 5 Oro o Riparare 5 HP per 10 Oro.',
    options: [
      { id: 'oil', label: 'Carica Olio', sub: '5 Oro' },
      { id: 'repair', label: 'Riparazione', sub: '10 Oro / +5 HP' },
      { id: 'skip', label: 'Prosegui', sub: 'Gratis' }
    ]
  },
  {
    name: 'Animali Selvatici',
    icon: Cat,
    description: 'Creano scompiglio: perdi 1 Unità di Merce a meno che non subisci 4 Danni HP per difenderla.',
    options: [
      { id: 'lose', label: 'Cedi Merce', sub: '-1 Unità' },
      { id: 'defend', label: 'Difendi Carico', sub: '4 Danni HP' }
    ]
  },
  {
    name: 'Banditi',
    icon: Skull,
    description: 'Chiedono il "Pedaggio": consegna 1 Unità di Merce o 20 Oro. Se rifiuti, subisci 5 Danni HP.',
    options: [
      { id: 'pay_goods', label: 'Cedi Merce', sub: '-1 Unità' },
      { id: 'pay_gold', label: 'Paga Pedaggio', sub: '20 Oro' },
      { id: 'refuse', label: 'Rifiuta', sub: '5 Danni HP' }
    ]
  },
  { name: 'Mostri', icon: Ghost, description: 'Attacco improvviso: subisci 4 Danni HP. L\'Armatura del carretto riduce questo danno.', options: [] },
  { name: 'Esploratore', icon: Compass, description: 'Ti scorta per un tratto, facendoti fare una scorciatoia, recuperi 1 giorno di viaggio.', options: [] },
  {
    name: 'Bardo Itinerante',
    icon: Music,
    description: 'Diffonde le tue gesta se gli dai un passaggio: +5 PR al costo di 1 Merce.',
    options: [
      { id: 'give_ride', label: 'Dai Passaggio', sub: '1 Merce / +5 PR' },
      { id: 'skip', label: 'Prosegui', sub: 'Gratis' }
    ]
  },
  { name: 'Trappole', icon: Target, description: 'Un gruppo di Coboldi ha piazzato delle trappole: subisci 5 danni HP e +1 Giorno di viaggio.', options: [] },
];

export const STRUCTURE_TABLE = [
  { id: 'none', name: 'Nulla', icon: Sun, description: 'Nessuna struttura incontrata durante il viaggio', options: [] },
  { id: 'none', name: 'Nulla', icon: Sun, description: 'Nessuna struttura incontrata durante il viaggio', options: [] },
  { id: 'none', name: 'Nulla', icon: Sun, description: 'Nessuna struttura incontrata durante il viaggio', options: [] },
  { id: 'none', name: 'Nulla', icon: Sun, description: 'Nessuna struttura incontrata durante il viaggio', options: [] },
  {
    id: 'village',
    name: 'Villaggio',
    icon: Landmark,
    description: 'Punto di sosta: puoi riparare il carretto o ricaricare la lanterna ai prezzi standard',
    options: [
      { id: 'repair', label: 'Riparazione', sub: '10 Oro / +5 HP' },
      { id: 'oil', label: 'Olio Lanterna', sub: '10 Oro / +1 Carica' },
      { id: 'skip', label: 'Prosegui', sub: 'Gratis' }
    ]
  },
  {
    id: 'wizard',
    name: 'Torre del Mago',
    icon: Zap,
    description: 'Il Mago può lanciare un incantesimo per accelerare il viaggio (Costo: 5 Oro).',
    options: [
      { id: 'spell', label: 'Passo Veloce', sub: '5 Oro / -2 Giorni' },
      { id: 'skip', label: 'Prosegui', sub: 'Gratis' }
    ]
  },
  {
    id: 'shrine',
    name: 'Santuario',
    icon: Star,
    description: 'Ispirazione che aumenta la tua fama locale',
    options: []
  },
  {
    id: 'spring',
    name: 'Sorgente d\'Acqua',
    icon: Droplets,
    description: 'Acqua pura che rigenera le bestie da tiro.',
    options: []
  },
  {
    id: 'camp',
    name: 'Accampamento Militare',
    icon: Shield,
    description: 'Guardie che pattugliano la zona. Mitiga danni da Mostri, Animali e Banditi; annulla evento Trappole.',
    options: [
      { id: 'protect', label: 'Chiedi Scorta', sub: '+2 Difesa Gratis' }
    ]
  },
  {
    id: 'dwarf',
    name: 'Avamposto Nanico',
    icon: Home,
    description: 'Maestri fabbri che rinforzano l\'asse del carretto.',
    options: [
      { id: 'repair', label: 'Rinforzo Asse', sub: '+5 HP Gratis' }
    ]
  },
];

export const WEATHER_TABLE = [
  { name: 'Sereno', hpDamage: 0, extraDays: 0, desc: 'Cielo limpido e visibilità perfetta.', icon: CloudSun },
  { name: 'Nuvoloso', hpDamage: -1, extraDays: 0, desc: 'Il clima mite fornisce un bonus di +1 HP al telaio.', icon: Cloud },
  { name: 'Soleggiato', hpDamage: 2, extraDays: 0, desc: 'Il calore sfianca i buoi e secca il legno.', icon: Sun },
  { name: 'Pioggia', hpDamage: 2, extraDays: 2, desc: 'Il fango rallenta le ruote e rende i freni incerti.', icon: CloudRain },
  { name: 'Temporale', hpDamage: 4, extraDays: 3, desc: 'Venti violenti e visibilità nulla. Pericolo di fulmini.', icon: Zap },
  { name: 'Nebbia', hpDamage: 2, extraDays: 2, desc: 'Bisogna procedere a passo d\'uomo per non uscire di strada.', icon: Wind },
];

export const CAVERN_WEATHER = [
  { name: 'Percorso Largo', hpDamage: 2, extraDays: 2, desc: "La via è ampia, ma l'oscurità rallenta il passo.", icon: Eye },
  { name: 'Calore Geotermico', hpDamage: 4, extraDays: 2, desc: 'Vapori caldi mettono a dura prova il legno del carro.', icon: Flame },
  { name: 'Umidità Standard', hpDamage: 2, extraDays: 2, desc: "Gocce d'acqua cadono dal soffitto.", icon: Droplets },
  { name: 'Oscurità Fitta', hpDamage: 2, extraDays: 4, desc: 'Senza luce è quasi impossibile orientarsi.', icon: Moon },
  { name: 'Stalattiti/Crolli', hpDamage: 6, extraDays: 2, desc: "Rocce che cadono minacciano l'integrità del tetto.", icon: Mountain },
  { name: 'Allagamento Improvviso', hpDamage: 8, extraDays: 4, desc: 'Un torrente sotterraneo ha invaso il sentiero!', icon: Waves },
];

export const TERRAIN_TABLE = [
  { name: 'Sentiero Sicuro', damage: 0, time: 1, desc: 'La via più rapida e sicura.', icon: MapPin },
  { name: 'Pianura', damage: 0, time: 1, desc: 'Attrito minimo, molto veloce.', icon: Trees },
  { name: 'Collina', damage: 1, time: 2, desc: 'Pendenze che affaticano il carretto.', icon: Mountain },
  { name: 'Fiume', damage: 1, time: 2, desc: 'Alto attrito e rischio di bagnare la merce', icon: Waves },
  { name: 'Bosco', damage: 2, time: 2, desc: 'Radici e rami danneggiano il telaio.', icon: Trees },
  { name: 'Caverna', damage: 2, time: 2, desc: 'Oscurità e passaggi stretti che mettono alla prova la struttura', icon: Landmark },
  { name: 'Tundra', damage: 2, time: 3, desc: 'Terreno irregolare e semi-congelato.', icon: Snowflake },
  { name: 'Deserto', damage: 2, time: 3, desc: 'La sabbia logora gli ingranaggi.', icon: Sun },
  { name: 'Palude', damage: 3, time: 4, desc: 'Acquitrini insidiosi che bloccano le ruote nel fango.', icon: Droplets },
  { name: 'Montagna', damage: 3, time: 4, desc: 'Rocce aguzze, estremo logorio', icon: Mountain },
  { name: 'Ghiacciaio', damage: 4, time: 5, desc: 'Ghiaccio scivoloso e fenditure pericolose per l\'integrità', icon: Snowflake },
  { name: 'Vulcano', damage: 5, time: 3, desc: 'Calore estremo e ceneri corrosive per il legno', icon: Flame },
];

export const BADGES = [
  { id: 'amico_boschi', name: 'Amico dei Boschi', cost: 30, description: 'Ignori il danno del terreno Bosco e riduce a 0 il tempo di percorrenza', icon: Trees, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  { id: 'veterano_fiume', name: 'Veterano del Fiume', cost: 30, description: 'Il Fiume non ti fa mai perdere merce.', icon: Waves, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  { id: 'cartografo', name: 'Cartografo', cost: 50, description: 'Tira 1d6 ogni carta: con 4-5-6 trovi una scorciatoia (-1 Giorno base)', icon: MapIcon, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  { id: 'scorta_armata', name: 'Scorta Armata', cost: 60, description: 'Danni da Banditi e Mostri dimezzati.', icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  { id: 'mercante_onesto', name: 'Mercante Onesto', cost: 80, description: '+2 Oro extra per ogni unità di merce venduta.', icon: Smile, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  { id: 'meccanico_esperto', name: 'Meccanico Esperto', cost: 100, description: 'I kit di riparazione curano 10 HP invece di 5 HP.', icon: Wrench, color: 'text-stone-400', bg: 'bg-stone-500/20', border: 'border-stone-500/30' },
  { id: 'signore_meteo', name: 'Signore del Meteo', cost: 120, description: 'Nuvoloso e Nebbia non aggiungono più giorni.', icon: CloudSun, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
  { id: 'eroe_strade', name: 'Eroe delle Strade', cost: 200, description: 'Moltiplicatore finale aumentato di +2x.', icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
];

export const TIPS = [
  "Ricorda di portare sempre con te almeno 1 Kit di Riparazione, è economico e può salvarti la vita nei momenti imprevedibili.",
  "L'Avamposto Militare è tuo amico, se ne incontri uno, ricorda di sfruttare il suo bonus contro Banditi, Mostri e Animali pericolosi.",
  "Le Merci, e gli upgrade al carretto, possono essere venduti. Se sei a corto di Oro, sfrutta questa opportunità.",
  "Prima di avanzare alla prossima Tappa, controlla l'integrità del carretto. Potresti aver bisogno di una riparazione veloce prima di proseguire.",
  "Le Sospensioni a Molla non sono solo un lusso: mantengono stabile il carretto rigenerando HP preziosi durante il sole, la pioggia e i temporali.",
  "Non avventurarti mai in una Grotta o nella Nebbia senza una Lanterna a Olio e le relative cariche; il buio può costarti giorni di viaggio e molti danni.",
  "L'Armatura è la tua migliore amica contro i mostri, ma ricorda: non potrà nulla contro la furia degli elementi o l'asperità dei terreni vulcanici.",
  "Le Ruote Chiodate sono un investimento vitale: riducono drasticamente i danni subiti attraversando montagne, ghiacciai e zone vulcaniche.",
  "Nelle zone ricche di corsi d'acqua o predatori, la Cassa Sigillata è fondamentale per evitare che il tuo prezioso carico finisca smarrito o distrutto.",
  "Il Trattamento Ignifugo è indispensabile per le rotte commerciali più pericolose: senza di esso, il calore del Vulcano ridurrà il tuo carretto in cenere.",
  "Non sottovalutare i piccoli danni: anche il Rinforzo in Legno può fare la differenza, mitigando ogni colpo ricevuto da banditi e animali pericolosi.",
  "Ricorda che la tua specializzazione conta: se sei un Meccanico, ogni Kit di Riparazione usato presso l'Emporio o la Stazione sarà due volte più efficace.",
  "Usa la Taverna a tuo vantaggio! Aspettare un giorno, può darti incarichi meno impegnativi e più semplici il giorno seguente."
];

export const TAVERN_INFO = [
  {
    name: 'Pernottamento',
    icon: Home,
    description: 'Riposa per una notte per recuperare le forze e attendere condizioni migliori.',
    effect: 'Costa 5 Oro. Fa avanzare di 1 Giorno il calendario globale, ricaricando potenzialmente nuove quest nella bacheca.',
  },
  {
    name: 'Bacheca Incarichi',
    icon: Calendar,
    description: 'Consulta le richieste dei mercanti locali per trovare nuovi viaggi commerciali.',
    effect: 'Permette di scegliere la destinazione, il tipo di merce e visualizzare la ricompensa prevista.',
  },
  {
    name: 'Voci di Corridoio',
    icon: Users,
    description: 'Ascolta i racconti di altri viaggiatori.',
    effect: 'Fornisce suggerimenti utili (Tips) sulla gestione del carretto e sui pericoli delle strade.',
  }
];

export const QUEST_TYPES = [
  {
    name: 'Spedizione Breve',
    icon: ChevronRight,
    description: 'Un viaggio rapido verso una città vicina. Ideale per piccoli profitti e riparazioni veloci.',
    effect: 'Lunghezza: 2-4 Tappe. Moltiplicatore Oro: 2x. Termine Bonus: 6 Giorni. Termine Massimo: 12 Giorni.',
  },
  {
    name: 'Spedizione Media',
    icon: ChevronRight,
    description: 'Un percorso di media distanza che richiede una preparazione adeguata del carretto.',
    effect: 'Lunghezza: 5-7 Tappe. Moltiplicatore Oro: 3x. Termine Bonus: 10 Giorni. Termine Massimo: 20 Giorni.',
  },
  {
    name: 'Spedizione Lunga',
    icon: ChevronRight,
    description: 'Una traversata epica attraverso territori remoti. Solo per mercanti esperti e ben equipaggiati.',
    effect: 'Lunghezza: 8-10 Tappe. Moltiplicatore Oro: 4x. Termine Bonus: 16 Giorni. Termine Massimo: 32 Giorni.',
  }
];

export const SHOP_ITEMS = [
  { id: 'wood_ref', name: 'Rinforzi in Legno', cost: 100, type: 'upgrade', effect: '+1 Armatura (Sottrae 1 dai danni ricevuti da Animali, Banditi, Mostri. Non mitiga il danno ricevuto da Meteo o Terreno).', icon: Shield },
  { id: 'iron_plates', name: 'Piastre in Ferro', cost: 200, type: 'upgrade', effect: '+2 Armatura (Sottrae 2 dai danni ricevuti da Animali, Banditi, Mostri. Non mitiga il danno ricevuto da Meteo o Terreno).', icon: Shield },
  { id: 'steel_frame', name: 'Telaio d\'Acciaio', cost: 400, type: 'upgrade', effect: '+4 Armatura (Sottrae 4 dai danni ricevuti da Animali, Banditi, Mostri. Non mitiga il danno ricevuto da Meteo o Terreno).', icon: Shield },
  { id: 'springs', name: 'Sospensioni a Molla', cost: 100, type: 'upgrade', effect: 'Meteo Soleggiato +2 HP; meteo Pioggia +2 HP; meteo Temporale +2 HP.', icon: Zap },
  { id: 'wheels', name: 'Ruote Chiodate', cost: 100, type: 'upgrade', effect: 'Riduce di 2 punti il danno base di Montagna, Ghiacciaio e Vulcano.', icon: Compass },
  { id: 'case', name: 'Cassa Sigillata', cost: 100, type: 'upgrade', effect: 'Dimezza la probabilità di perdere merce negli eventi Fiume o Animali.', icon: Package },
  { id: 'fireproof', name: 'Trattamento Ignifugo', cost: 200, type: 'upgrade', effect: 'Evita Danni in Terreno Vulcano.', icon: FlameKindling },
  { id: 'cargo_expand', name: 'Ampliamento Carico', cost: 200, type: 'upgrade', effect: '+5 Merci trasportate.', icon: Package },
  { id: 'lantern', name: 'Lanterna a Olio', cost: 100, type: 'upgrade', effect: 'Uso Obbligatorio in Nebbia/Caverna. Necessaria per le Cariche. (Include 3 cariche all\'acquisto)', icon: FlameKindling },
  { id: 'repair_kit', name: 'Kit Riparazione', cost: 10, type: 'consumable', effect: '+5 HP (10 se Meccanico)', icon: Wrench },
  { id: 'oil', name: 'Ricarica Lanterna', cost: 20, type: 'consumable', effect: '+1 Ricarica per la Lanterna', icon: FlameKindling },
];

const COL_A = ["Black", "Stone", "Green", "Iron", "Wind", "Old", "Cold", "Silver", "Storm", "Mist", "Deep", "Red", "Gold", "Shadow", "High", "Frost", "Oak", "River", "Dawn", "Sun"];
const COL_B = ["water", "bridge", "field", "port", "peak", "haven", "rock", "ford", "watch", "fall", "wood", "keep", "crest", "moor", "ridge", "vale", "dale", "shore", "reach", "marsh"];

export const generateTownName = () => {
  const pref = COL_A[Math.floor(Math.random() * COL_A.length)];
  const suff = COL_B[Math.floor(Math.random() * COL_B.length)];
  return pref + suff;
};

export const INITIAL_TOWNS = Array.from({ length: 20 }, () => generateTownName());

export function SunriseIcon(props: any) { return <Sun {...props} /> }
