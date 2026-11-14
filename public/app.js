// ==========================================================================
// 🎪 LA FERIA • JUEGOS TRADICIONALES MEXICANOS • BILINGUAL APP (ES / EN)
// ==========================================================================

// Global State
const state = {
  lang: 'es', // 'es' or 'en'
  tickets: 10,
  activeFilter: 'all',
  searchQuery: '',
  theme: 'noche',
  audioEnabled: false,
  musicPlaying: false,
  activeModalGameId: null,
  prizes: {
    puerquito: 0,
    luchador: 0,
    algodon: 0,
    pajarito: 0,
    trompo: 0
  }
};

// Bilingual Dictionaries
const I18N = {
  es: {
    navTagline: 'Juegos Tradicionales Mexicanos',
    ticketWord: 'Boletos',
    soundOn: '🔊 Sonido: ON',
    soundOff: '🔇 Sonido: OFF',
    musicOn: '🎶 Organillo: ON',
    musicOff: '🎵 Organillo: OFF',
    langToggle: '🌐 ES',
    themes: {
      noche: '🏮 Noche de Feria',
      dia: '☀️ Día de Fiesta',
      talavera: '🏺 Talavera Colonial'
    },
    heroTag: '🇲🇽 Gran Kermés Virtual • Colección Oficial',
    heroTitle: '¡PÁSELE A LA FERIA!',
    heroSubtitle: 'Los juegos tradicionales más queridos de México y de siempre, reunidos para jugar en línea con amigos y familia directo en tu navegador.',
    miniBoothTitle: '<span>🔮</span> Puesto de la Suerte: ¡Tira la Canica de Prueba!',
    miniBoothSub: 'Gana boletos para los premios',
    miniCanvasNote: 'Rebote físico en clavos de latón',
    miniPhraseDefault: '🎪 «¡Pásele, pásele a probar suerte!»',
    btnLaunch: '<span>🚀</span> ¡Soltar Canica! (Gratis)',
    filterAll: '<span>🎪</span> Todos los Puestos (6)',
    filterDestreza: '<span>🎯</span> Destreza & Puntería (2)',
    filterPalabras: '<span>✏️</span> Palabras & Mente (1)',
    filterTablero: '<span>🎲</span> Tablero Familiar (3)',
    searchPlaceholder: 'Buscar juego o puesto de feria...',
    noBoothsTitle: 'No encontramos ningún puesto',
    noBoothsDesc: 'Prueba buscando otra palabra clave o limpia los filtros.',
    playBtn: '<span>🎮</span> ¡Jugar Ahora!',
    rulesBtn: '<span>📖</span> Ver Reglas',
    prizesTag: '🎁 Puesto de Reclamación',
    prizesTitle: 'VITRINA DE PREMIOS DE FERIA',
    prizesDesc: 'Juega en los puestos, acumula tus boletos de la suerte y canjea los tesoros más auténticos de cualquier feria de pueblo mexicana.',
    redeemBtn: 'Canjear Premio',
    needMoreTickets: 'Faltan boletos',
    ownedText: '✓ Tienes',
    modalRulesTitle: '📜 ¿Cómo se juega?',
    modalIncludesTitle: '🌟 Lo que incluye este puesto:',
    modalCloseBtn: 'Cerrar',
    modalPlayBtn: '<span>🎮</span> ¡Entrar a Jugar!',
    footerBrand: '🎪 LA FERIA • JUEGOS MEXICANOS EN LÍNEA',
    footerCopy: 'Hecho con ❤️ y amor a los juegos tradicionales por <strong>@pinguxx</strong>.',
    phrases: [
      '🎪 «¡Pásele, pásele a probar suerte!»',
      '🔮 «¡Una canica más y se lleva la alcancía!»',
      '🎴 «¡El gallo, la sirena y el catrín!»',
      '🌀 «¡Ponga uno, pongan dos, todos ponen!»',
      '✏️ «¡Basta para mí, basta para todos!»',
      '🐍 «¡Cuidado con la víbora de la mar!»',
      '🪿 «¡De oca a oca y tiro porque me toca!»'
    ],
    winGallo: (pts, tkt) => `🎉 <strong>¡EL GALLO DE ORO!</strong> Ganaste <span style="font-weight: 800; color: var(--accent-gold); white-space: nowrap;">${pts} pts</span> y <span style="font-weight: 800; color: var(--accent-green); white-space: nowrap;">+${tkt} boletos</span>`,
    winAcertado: (pts, tkt) => `🎯 <strong>¡Tiro Acertado!</strong> Ganaste <span style="font-weight: 800; color: var(--accent-gold); white-space: nowrap;">${pts} pts</span> y <span style="font-weight: 800; color: var(--accent-green); white-space: nowrap;">+${tkt} boletos</span>`,
    redeemedPhrase: (name, phrase) => `🎁 <strong>¡Canjeaste: ${name}!</strong> <em>${phrase}</em>`
  },
  en: {
    navTagline: 'Traditional Mexican Games',
    ticketWord: 'Tickets',
    soundOn: '🔊 Sound: ON',
    soundOff: '🔇 Sound: OFF',
    musicOn: '🎶 Music: ON',
    musicOff: '🎵 Music: OFF',
    langToggle: '🌐 EN',
    themes: {
      noche: '🏮 Night Fair',
      dia: '☀️ Festive Day',
      talavera: '🏺 Colonial Talavera'
    },
    heroTag: '🇲🇽 Virtual Fairground • Official Collection',
    heroTitle: 'WELCOME TO THE FAIR!',
    heroSubtitle: 'The most cherished classic and traditional Mexican games, gathered to play online with friends and family right in your browser.',
    miniBoothTitle: '<span>🔮</span> Lucky Booth: Launch a Test Marble!',
    miniBoothSub: 'Earn tickets for fair prizes',
    miniCanvasNote: 'Physics bounce on brass pins',
    miniPhraseDefault: '🎪 "Step right up, step right up and try your luck!"',
    btnLaunch: '<span>🚀</span> Drop Marble! (Free)',
    filterAll: '<span>🎪</span> All Game Booths (6)',
    filterDestreza: '<span>🎯</span> Skill & Aim (2)',
    filterPalabras: '<span>✏️</span> Words & Mind (1)',
    filterTablero: '<span>🎲</span> Family Board Games (3)',
    searchPlaceholder: 'Search game or fair booth...',
    noBoothsTitle: 'No booths found',
    noBoothsDesc: 'Try searching with another keyword or clear the filters.',
    playBtn: '<span>🎮</span> Play Now!',
    rulesBtn: '<span>📖</span> View Rules',
    prizesTag: '🎁 Prize Redemption Counter',
    prizesTitle: 'FAIR PRIZE SHOWCASE',
    prizesDesc: 'Play in the booths, collect your lucky tickets, and redeem authentic classic Mexican carnival treasures.',
    redeemBtn: 'Redeem Prize',
    needMoreTickets: 'Need more tickets',
    ownedText: '✓ Owned:',
    modalRulesTitle: '📜 How to Play?',
    modalIncludesTitle: "🌟 What's inside this booth:",
    modalCloseBtn: 'Close',
    modalPlayBtn: '<span>🎮</span> Jump in & Play!',
    footerBrand: '🎪 LA FERIA • TRADITIONAL MEXICAN GAMES ONLINE',
    footerCopy: 'Made with ❤️ and passion for traditional games by <strong>@pinguxx</strong>.',
    phrases: [
      '🎪 "Step right up, step right up and try your luck!"',
      '🔮 "One more marble to win the piggy bank!"',
      '🎴 "The rooster, the mermaid, and the gentleman!"',
      '🌀 "Put one, put two, everybody in!"',
      '✏️ "Basta for me, basta for everyone!"',
      '🐍 "Watch out for the snake tail!"',
      '🪿 "From goose to goose as my turn comes!"'
    ],
    winGallo: (pts, tkt) => `🎉 <strong>THE GOLDEN ROOSTER!</strong> You won <span style="font-weight: 800; color: var(--accent-gold); white-space: nowrap;">${pts} pts</span> and <span style="font-weight: 800; color: var(--accent-green); white-space: nowrap;">+${tkt} tickets</span>`,
    winAcertado: (pts, tkt) => `🎯 <strong>Great Shot!</strong> You won <span style="font-weight: 800; color: var(--accent-gold); white-space: nowrap;">${pts} pts</span> and <span style="font-weight: 800; color: var(--accent-green); white-space: nowrap;">+${tkt} tickets</span>`,
    redeemedPhrase: (name, phrase) => `🎁 <strong>Redeemed: ${name}!</strong> <em>${phrase}</em>`
  }
};

// Procedural Web Audio Engine
class FairAudioEngine {
  constructor() {
    this.ctx = null;
    this.musicInterval = null;
    this.musicStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWoodClick() {
    if (!state.audioEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playBell() {
    if (!state.audioEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    [1046.5, 2093].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(idx === 0 ? 0.3 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    });
  }

  playPlunger() {
    if (!state.audioEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playBird() {
    if (!state.audioEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.linearRampToValueAtTime(2600, now + 0.08);
    osc.frequency.linearRampToValueAtTime(1900, now + 0.16);
    osc.frequency.linearRampToValueAtTime(2700, now + 0.24);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playFanfare() {
    if (!state.audioEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  toggleMusic() {
    this.init();
    if (this.musicPlaying) {
      clearInterval(this.musicInterval);
      this.musicPlaying = false;
      return false;
    } else {
      this.musicPlaying = true;
      const organilloMelody = [
        523.25, 659.25, 783.99, 1046.5, 783.99, 659.25,
        587.33, 698.46, 880.00, 1046.5, 880.00, 698.46,
        493.88, 587.33, 783.99, 987.77, 783.99, 587.33,
        523.25, 659.25, 783.99, 1046.5, 783.99, 659.25
      ];
      this.musicStep = 0;
      this.musicInterval = setInterval(() => {
        if (!this.musicPlaying || !state.audioEnabled) return;
        const now = this.ctx.currentTime;
        const freq = organilloMelody[this.musicStep % organilloMelody.length];
        this.musicStep++;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }, 200);
      return true;
    }
  }
}

const audio = new FairAudioEngine();

// Bilingual Games Database
const GAMES_DATA = [
  {
    id: 'canicas',
    icon: '🔮',
    categories: ['destreza', 'multiplayer'],
    playUrl: 'https://canicas.onrender.com',
    es: {
      title: 'Canicas Mexicanas 3D',
      subtitle: 'Feria de Clavos & Patio de Tierra',
      categoryBadge: 'Destreza & Puntería',
      desc: 'Lanza tu canica de vidrio con el resorte de latón, sortea 56 clavos de madera y embócala en los hoyitos pintados de la feria, o juega en el patio de tierra al Círculo y la Hoyita.',
      features: [
        'Tablero de feria con clavos y hoyitos de puntaje',
        'Modo Patio de tierra: El Círculo y La Hoyita',
        'Física de rebote realista y sonido de campana'
      ],
      rules: 'Ajusta la fuerza del resorte con el ratón o barra espaciadora. Tu canica rodará por el arco superior y rebotará en los clavos de latón. Si cae en el hoyo de "El Gallo de Oro", ganas 100 puntos y combo doble si ya había canica.'
    },
    en: {
      title: 'Mexican Marbles 3D',
      subtitle: 'Nail Pinboard & Dirt Patio',
      categoryBadge: 'Skill & Aim',
      desc: 'Launch your glass marble with the brass plunger chute, bounce through 56 nails, and sink into painted point holes or play the classic dirt patio modes (The Circle and The Hole).',
      features: [
        'Traditional carnival nailboard with score holes',
        'Dirt patio modes: The Circle and The Hole',
        'Realistic bounce physics and brass bell sound'
      ],
      rules: 'Adjust the plunger power with your mouse or spacebar. Your marble shoots along the curved arch and ricochets through brass pins. Landing in the "Golden Rooster" scores 100 pts and combo bonus.'
    }
  },
  {
    id: 'basta',
    icon: '✏️',
    categories: ['palabras', 'multiplayer'],
    playUrl: 'https://basta-azbj.onrender.com',
    es: {
      title: 'Basta Online',
      subtitle: 'Stop / Tutti Frutti Tradicional',
      categoryBadge: 'Palabras & Mente',
      desc: 'El clásico juego de lápiz y papel llevado al multijugador moderno. Compite por escribir Nombre, Apellido, Ciudad, Flor o Fruto antes de que alguien grite "¡Basta para mí, basta para todos!".',
      features: [
        'Estilo hoja de libreta escolar con categorías clásicas',
        'Partidas multijugador y bots divertidos para jugar solo',
        'Votación democrática de palabras y gritos rápidos de fiesta'
      ],
      rules: 'Se sortea una letra al azar. Todos llenan sus categorías a contrarreloj. El primero en completar grita "¡Basta!". Durante la votación, las respuestas únicas valen 100 puntos y las repetidas 50.'
    },
    en: {
      title: 'Basta Online',
      subtitle: 'Classic Word Stop / Scattergories',
      categoryBadge: 'Words & Mind',
      desc: 'The iconic Mexican pen-and-paper word game. Race against friends and witty bots to fill Name, Last Name, Country, Fruit, and more before someone shouts "Basta!".',
      features: [
        'Nostalgic school notebook aesthetic with classic categories',
        'Multiplayer rooms and funny bots for solo play',
        'Democratic real-time word voting and quick party shouts'
      ],
      rules: 'A random letter is picked. Everyone fills their categories as fast as possible. The first to finish shouts "Basta!". Unique words score 100 points, duplicates score 50.'
    }
  },
  {
    id: 'loteria',
    icon: '🎴',
    categories: ['tablero', 'multiplayer'],
    playUrl: 'https://loteria-zhet.onrender.com',
    es: {
      title: 'Lotería Mexicana',
      subtitle: 'Tablas, Frijolitos y Gritón',
      categoryBadge: '¡Lotería Tradicional!',
      desc: '¡Corre y se va con la primera! Disfruta la tradicional Lotería Mexicana con sus 54 cartas ilustradas, frijolitos para marcar tu tabla y voz de cantador con pregones populares.',
      features: [
        'Las 54 cartas oficiales con frijolitos para marcar',
        'Voz de cantador con pregones populares tradicionales',
        'Modalidades: Cuarteta, Centro, Línea o Tabla Llena'
      ],
      rules: 'El cantador canta cada carta con un pregón tradicional. Si la carta cantada está en tu tabla de 4x4, haz clic sobre ella para colocar un frijolito. Completa la figura y sé el primero en gritar "¡Buenas!" o "¡Lotería!".'
    },
    en: {
      title: 'Mexican Loteria',
      subtitle: 'Boards, Beans & Caller',
      categoryBadge: 'Traditional Loteria',
      desc: 'The beloved Mexican bingo game! Play with 54 authentic illustrated cards, place beans to mark your board, and listen to the traditional card caller chants.',
      features: [
        'All 54 official classic cards with bean markers',
        'Automated traditional caller with folklore chants',
        'Modes: Four Corners, Center, Line, or Full Board'
      ],
      rules: 'The caller announces each card with traditional folk rhymes. Click matching cards on your 4x4 board to drop a bean marker. Complete the pattern and be the first to call "Buenas!" or "Loteria!".'
    }
  },
  {
    id: 'pirinola',
    icon: '🌀',
    categories: ['destreza', 'multiplayer'],
    playUrl: 'https://pirinola.onrender.com',
    es: {
      title: 'La Pirinola',
      subtitle: 'Toma Todo & Pozo de Fichas',
      categoryBadge: 'Toma Todo & Azar',
      desc: 'El emblemático trompito mexicano de 6 caras. Pon tu ficha en el pozo central, dale cuerda al tiro y prepárate para la tensión cuando el trompo desacelera y cae en "¡Toma Todo!".',
      features: [
        'Las 6 caras clásicas: Pon Uno, Pon Dos, Toma Todo...',
        'Giro 3D realista con física de bamboleo',
        'Apuestas de fichas comunitarias y modo fiesta'
      ],
      rules: 'Cada jugador comienza con una bolsa de fichas o monedas y aporta una al pozo ("Todos ponen"). En tu turno, impulsa la pirinola. Cumple la orden de la cara que quede hacia arriba. ¡El que vacía el pozo con Toma Todo se lleva la gloria!'
    },
    en: {
      title: 'The Pirinola',
      subtitle: 'Toma Todo & Coin Pot',
      categoryBadge: 'Toma Todo & Chance',
      desc: 'The iconic 6-sided Mexican spinning top. Contribute to the central pot, spin the top, and watch it wobble to a halt on "Take One", "Put Two", or the jackpot "Toma Todo"!',
      features: [
        'All 6 classic sides: Put One, Put Two, Take All...',
        'Realistic 3D spin and gyroscopic wobble physics',
        'Community chip pot and party multiplayer mode'
      ],
      rules: 'Each player starts with chips and adds one to the pot ("Todos ponen"). Spin the pirinola on your turn and follow the upper face rule. The player who rolls Toma Todo claims the entire pot!'
    }
  },
  {
    id: 'shoots_ladders',
    icon: '🐍',
    categories: ['tablero', 'multiplayer'],
    playUrl: 'https://shoots-ladders.onrender.com',
    es: {
      title: 'Serpientes y Escaleras',
      subtitle: 'El Tablero de las 100 Casillas',
      categoryBadge: 'Tablero Familiar',
      desc: 'Sube hacia la victoria por las escaleras de madera o resbala hasta el fondo por las colas de las víboras en este legendario juego de mesa ilustrado para toda la familia.',
      features: [
        'Tablero clásico de 100 casillas ilustrado',
        'Tiradas de dados, escaleras altas y resbalones en víboras',
        'Salas para jugar con amigos y familia en turnos'
      ],
      rules: 'Por turnos, tira el dado y avanza tu ficha tantas casillas como indique. Si caes al pie de una escalera, subes de inmediato. Si caes en la cabeza de una serpiente, resbalas hasta su cola. Gana el primero en llegar exactamente a la casilla 100.'
    },
    en: {
      title: 'Snakes and Ladders',
      subtitle: 'The 100-Square Board Game',
      categoryBadge: 'Family Board Game',
      desc: 'Climb toward victory up tall wooden ladders or slide down treacherous snake tails on this legendary illustrated 100-square board for players of all ages.',
      features: [
        'Richly illustrated vintage 100-tile board',
        'Dice rolls, steep shortcuts, and sneaky snakes',
        'Turn-based rooms to play with friends and family'
      ],
      rules: 'Take turns rolling the dice and moving forward. Land on a ladder base to climb up; land on a snake head to slide back down. First player to reach square 100 wins!'
    }
  },
  {
    id: 'oca',
    icon: '🪿',
    categories: ['tablero', 'multiplayer'],
    playUrl: 'https://oca-ox87.onrender.com',
    es: {
      title: 'El Juego de la Oca',
      subtitle: 'De Oca a Oca y Tiro Porque Me Toca',
      categoryBadge: 'Clásico de Mesa',
      desc: 'El viaje en espiral más célebre de los juegos de mesa. Cruza el puente, evita la posada, no caigas en el pozo ni en la calavera y salta de oca en oca hasta el Gran Jardín de la Oca.',
      features: [
        'Espiral clásica de 63 casillas con casillas especiales',
        'Tiro doble de dados y saltos de oca en oca',
        'El puente, la posada, el laberinto, el pozo y la muerte'
      ],
      rules: 'Tira los dos dados y avanza por la espiral. Si caes en una casilla con oca, repites el tiro diciendo "De oca a oca y tiro porque me toca". Ten cuidado con la casilla 58 (La Calavera), que te regresa al inicio de la espiral.'
    },
    en: {
      title: 'Game of the Goose',
      subtitle: 'From Goose to Goose as My Turn Comes',
      categoryBadge: 'Classic Board Game',
      desc: 'The celebrated spiral board journey. Cross the bridge, beware the inn, avoid the well and the skull, and jump from goose to goose all the way to the Great Garden.',
      features: [
        'Complete 63-square spiral track with special hazards',
        'Double dice roll and goose-to-goose bonus leaps',
        'The Bridge, The Inn, The Maze, The Well, and The Skull'
      ],
      rules: 'Roll two dice and advance along the spiral. Landing on a Goose lets you advance again. Watch out for square 58 (Death/Skull), which sends you all the way back to the start.'
    }
  }
];

// Bilingual Prizes Database
const PRIZES_DATA = [
  {
    id: 'puerquito',
    icon: '🐷',
    cost: 5,
    es: { name: 'Alcancía de Puerquito de Yeso', phrase: '¡A romperla cuando esté llena!' },
    en: { name: 'Clay Piggy Bank', phrase: 'Smash it open when it is full!' }
  },
  {
    id: 'luchador',
    icon: '🤼',
    cost: 10,
    es: { name: 'Luchador con Rebabas de Plástico', phrase: '¡El Santo contra las momias!' },
    en: { name: 'Plastic Masked Wrestler Toy', phrase: 'El Santo vs. the mummies!' }
  },
  {
    id: 'algodon',
    icon: '🍭',
    cost: 15,
    es: { name: 'Algodón de Azúcar Rosa', phrase: '¡Dulce y esponjoso de feria!' },
    en: { name: 'Pink Cotton Candy', phrase: 'Sweet and fluffy fairground treat!' }
  },
  {
    id: 'pajarito',
    icon: '🐦',
    cost: 20,
    es: { name: 'Silbato de Pajarito con Agua', phrase: '¡Póngale agua para que trine!' },
    en: { name: 'Water Bird Warble Whistle', phrase: 'Add water to hear it chirp!' }
  },
  {
    id: 'trompo',
    icon: '🪀',
    cost: 25,
    es: { name: 'Trompo de Madera con Piola', phrase: '¡Sáquelo a bailar en la uña!' },
    en: { name: 'Wooden Top with String', phrase: 'Spin it right on your fingernail!' }
  }
];

// Mini-Feria Canvas Physics Simulation
class MiniFeriaGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = 260;
    this.height = this.canvas.height = 130;
    this.marble = null;
    this.pins = [];
    this.cups = [];
    this.animating = false;

    this.setupBoard();
    this.renderStatic();

    // Tap or click on canvas to launch marble on mobile & desktop
    this.canvas.addEventListener('click', () => this.launch());
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.launch();
    }, { passive: false });
  }

  setupBoard() {
    this.pins = [];
    const rows = [
      { y: 35, count: 5, offset: 45, spacing: 42 },
      { y: 65, count: 6, offset: 25, spacing: 42 },
      { y: 95, count: 5, offset: 45, spacing: 42 }
    ];

    rows.forEach(r => {
      for (let i = 0; i < r.count; i++) {
        this.pins.push({
          x: r.offset + i * r.spacing,
          y: r.y,
          r: 3.5
        });
      }
    });

    this.cups = [
      { x: 10, w: 55, pts: 10, tickets: 1, labelKey: 'laCalavera', labelDefault: '💀 10' },
      { x: 75, w: 50, pts: 50, tickets: 2, labelKey: 'laCampana', labelDefault: '🔔 50' },
      { x: 135, w: 50, pts: 100, tickets: 3, labelKey: 'elGallo', labelDefault: '👑 100' },
      { x: 195, w: 55, pts: 30, tickets: 1, labelKey: 'elTrompo', labelDefault: '🎪 30' }
    ];
  }

  renderStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#132338');
    bgGrad.addColorStop(1, '#0c1624');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.pins.forEach(pin => {
      this.ctx.beginPath();
      this.ctx.arc(pin.x, pin.y, pin.r, 0, Math.PI * 2);
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.fill();
      this.ctx.strokeStyle = '#d97706';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(pin.x - 1, pin.y - 1, 1, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
    });

    const langDict = I18N[state.lang] || I18N.es;
    this.cups.forEach(cup => {
      this.ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(cup.x, 105, cup.w, 22);
      this.ctx.strokeRect(cup.x, 105, cup.w, 22);

      const label = langDict.cups[cup.labelKey] || cup.labelDefault;
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = 'bold 10px Fredoka, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, cup.x + cup.w / 2, 120);
    });

    if (this.marble) {
      this.ctx.beginPath();
      this.ctx.arc(this.marble.x, this.marble.y, this.marble.r, 0, Math.PI * 2);
      const mGrad = this.ctx.createRadialGradient(
        this.marble.x - 2, this.marble.y - 2, 1,
        this.marble.x, this.marble.y, this.marble.r
      );
      mGrad.addColorStop(0, '#ffffff');
      mGrad.addColorStop(0.3, '#38bdf8');
      mGrad.addColorStop(1, '#0284c7');
      this.ctx.fillStyle = mGrad;
      this.ctx.fill();
      this.ctx.strokeStyle = '#bae6fd';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  launch() {
    if (this.animating) return;
    this.animating = true;
    audio.playPlunger();

    this.marble = {
      x: 110 + (Math.random() * 40 - 20),
      y: 10,
      vx: (Math.random() - 0.5) * 2,
      vy: 1.5,
      r: 6
    };

    const update = () => {
      if (!this.marble) return;

      this.marble.vy += 0.22;
      this.marble.x += this.marble.vx;
      this.marble.y += this.marble.vy;

      if (this.marble.x - this.marble.r < 4) {
        this.marble.x = 4 + this.marble.r;
        this.marble.vx = -this.marble.vx * 0.7;
        audio.playWoodClick();
      } else if (this.marble.x + this.marble.r > this.width - 4) {
        this.marble.x = this.width - 4 - this.marble.r;
        this.marble.vx = -this.marble.vx * 0.7;
        audio.playWoodClick();
      }

      this.pins.forEach(pin => {
        const dx = this.marble.x - pin.x;
        const dy = this.marble.y - pin.y;
        const dist = Math.hypot(dx, dy);
        const minDist = this.marble.r + pin.r;

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          this.marble.x = pin.x + Math.cos(angle) * minDist;
          this.marble.y = pin.y + Math.sin(angle) * minDist;

          const speed = Math.hypot(this.marble.vx, this.marble.vy);
          this.marble.vx = Math.cos(angle) * speed * 0.75 + (Math.random() - 0.5);
          this.marble.vy = Math.sin(angle) * speed * 0.75;
          audio.playWoodClick();
        }
      });

      if (this.marble.y >= 115) {
        this.animating = false;
        let awardedCup = this.cups.find(c => this.marble.x >= c.x && this.marble.x <= c.x + c.w);
        if (!awardedCup) awardedCup = this.cups[1];

        onMiniGameWin(awardedCup);
        this.renderStatic();
        return;
      }

      this.renderStatic();
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
}

let miniGame = null;

// UI Handlers & Renderers
function initApp() {
  updateLanguageElements();
  renderBooths();
  renderPrizes();
  updateTicketDisplay();

  miniGame = new MiniFeriaGame('miniFeriaCanvas');

  setupEventListeners();
  randomizePhrase();
  initWebSocket();
}

function updateLanguageElements() {
  const t = I18N[state.lang] || I18N.es;

  // Nav
  const navTagline = document.getElementById('navTagline');
  if (navTagline) navTagline.textContent = t.navTagline;

  const ticketWord = document.getElementById('ticketWord');
  if (ticketWord) ticketWord.textContent = t.ticketWord;

  const langBtn = document.getElementById('btnLangToggle');
  if (langBtn) langBtn.textContent = t.langToggle;

  const audioBtn = document.getElementById('btnAudioToggle');
  if (audioBtn) audioBtn.textContent = state.audioEnabled ? t.soundOn : t.soundOff;

  const musicBtn = document.getElementById('btnMusicToggle');
  if (musicBtn) musicBtn.textContent = audio.musicPlaying ? t.musicOn : t.musicOff;

  const themeBtn = document.getElementById('btnThemeToggle');
  if (themeBtn) themeBtn.textContent = t.themes[state.theme] || t.themes.noche;

  // Hero
  const heroTag = document.getElementById('heroTag');
  if (heroTag) heroTag.textContent = t.heroTag;

  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.textContent = t.heroTitle;

  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

  // Mini Booth
  const miniBoothTitle = document.getElementById('miniBoothTitle');
  if (miniBoothTitle) miniBoothTitle.innerHTML = t.miniBoothTitle;

  const miniBoothSub = document.getElementById('miniBoothSub');
  if (miniBoothSub) miniBoothSub.textContent = t.miniBoothSub;

  const miniCanvasNote = document.getElementById('miniCanvasNote');
  if (miniCanvasNote) miniCanvasNote.textContent = t.miniCanvasNote;

  const btnLaunchText = document.getElementById('btnLaunchText');
  if (btnLaunchText) btnLaunchText.textContent = state.lang === 'es' ? '¡Soltar Canica! (Gratis)' : 'Drop Marble! (Free)';

  // Filter Buttons
  const fAll = document.getElementById('filterBtnAll');
  if (fAll) fAll.innerHTML = t.filterAll;

  const fDestreza = document.getElementById('filterBtnDestreza');
  if (fDestreza) fDestreza.innerHTML = t.filterDestreza;

  const fPalabras = document.getElementById('filterBtnPalabras');
  if (fPalabras) fPalabras.innerHTML = t.filterPalabras;

  const fTablero = document.getElementById('filterBtnTablero');
  if (fTablero) fTablero.innerHTML = t.filterTablero;

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  // Prizes Header
  const prizesSectionTag = document.getElementById('prizesSectionTag');
  if (prizesSectionTag) prizesSectionTag.textContent = t.prizesTag;

  const prizesSectionTitle = document.getElementById('prizesSectionTitle');
  if (prizesSectionTitle) prizesSectionTitle.textContent = t.prizesTitle;

  const prizesSectionDesc = document.getElementById('prizesSectionDesc');
  if (prizesSectionDesc) prizesSectionDesc.textContent = t.prizesDesc;

  // Footer
  const footerBrand = document.getElementById('footerBrand');
  if (footerBrand) footerBrand.textContent = t.footerBrand;

  const footerCopy = document.getElementById('footerCopy');
  if (footerCopy) footerCopy.innerHTML = t.footerCopy;

  // Redraw canvas with localized cups
  if (miniGame) miniGame.renderStatic();
}

function setLanguage(newLang) {
  state.lang = newLang;
  audio.playWoodClick();
  updateLanguageElements();
  renderBooths();
  renderPrizes();
  randomizePhrase();

  // If modal is currently open, refresh it
  if (state.activeModalGameId) {
    openGameModal(state.activeModalGameId);
  }
}

function toggleLanguage() {
  const next = state.lang === 'es' ? 'en' : 'es';
  setLanguage(next);
}

// Live WebSocket connection to Rust Axum server
function initWebSocket() {
  if (typeof window === 'undefined' || !window.location || !window.location.host) return;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  try {
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'fair_shout' && data.text) {
          const phraseEl = document.getElementById('miniBoothPhrase');
          if (phraseEl) phraseEl.innerHTML = `📣 ${data.text}`;
        }
      } catch (e) {
        if (event.data && typeof event.data === 'string') {
          const phraseEl = document.getElementById('miniBoothPhrase');
          if (phraseEl) phraseEl.innerHTML = `📣 ${event.data}`;
        }
      }
    };

    socket.onclose = () => {
      setTimeout(initWebSocket, 5000);
    };
  } catch (err) {
    // Silent fallback
  }
}

function randomizePhrase() {
  const el = document.getElementById('miniBoothPhrase');
  if (el) {
    const t = I18N[state.lang] || I18N.es;
    const p = t.phrases[Math.floor(Math.random() * t.phrases.length)];
    el.textContent = p;
  }
}

function onMiniGameWin(cup) {
  state.tickets += cup.tickets;
  updateTicketDisplay();

  const phraseEl = document.getElementById('miniBoothPhrase');
  if (phraseEl) {
    const t = I18N[state.lang] || I18N.es;
    audio.playBell();
    if (cup.pts === 100) {
      phraseEl.innerHTML = t.winGallo(cup.pts, cup.tickets);
    } else {
      phraseEl.innerHTML = t.winAcertado(cup.pts, cup.tickets);
    }
  }

  const tb = document.getElementById('navTickets');
  if (tb) {
    tb.style.transform = 'scale(1.25)';
    setTimeout(() => tb.style.transform = '', 300);
  }
}

function updateTicketDisplay() {
  const badge = document.getElementById('ticketCount');
  if (badge) {
    badge.textContent = state.tickets;
  }
  const ticketWord = document.getElementById('ticketWord');
  if (ticketWord) {
    const t = I18N[state.lang] || I18N.es;
    ticketWord.textContent = t.ticketWord;
  }
  renderPrizes();
}

function renderBooths() {
  const container = document.getElementById('boothsGrid');
  if (!container) return;

  const t = I18N[state.lang] || I18N.es;
  const query = state.searchQuery.toLowerCase().trim();

  const filtered = GAMES_DATA.filter(g => {
    const lData = g[state.lang] || g.es;
    const matchesCategory = state.activeFilter === 'all' || g.categories.includes(state.activeFilter);
    const matchesSearch = !query ||
      lData.title.toLowerCase().includes(query) ||
      lData.subtitle.toLowerCase().includes(query) ||
      lData.desc.toLowerCase().includes(query) ||
      lData.categoryBadge.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-card);">
        <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
        <h3 style="font-family: var(--font-display); color: var(--accent-gold); font-size: 20px; margin-bottom: 8px;">${t.noBoothsTitle}</h3>
        <p style="color: var(--text-muted); font-size: 14px;">${t.noBoothsDesc}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(game => {
    const d = game[state.lang] || game.es;
    return `
      <article class="booth-card" data-game-id="${game.id}">
        <div class="booth-roof">
          <div class="booth-roof-valance"></div>
        </div>
        <div class="booth-header">
          <div class="booth-icon-box">${game.icon}</div>
          <div class="booth-badges">
            <span class="badge-players">${d.categoryBadge}</span>
          </div>
        </div>
        <div class="booth-body">
          <h3 class="booth-title">${d.title}</h3>
          <div class="booth-subtitle">${d.subtitle}</div>
          <p class="booth-desc">${d.desc}</p>
          <ul class="booth-features">
            ${d.features.map(f => `<li><span>✦</span> ${f}</li>`).join('')}
          </ul>
          <div class="booth-actions">
            <a href="${game.playUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-play" onclick="audio.playWoodClick()">
              ${t.playBtn}
            </a>
            <button class="btn-secondary" onclick="openGameModal('${game.id}')">
              ${t.rulesBtn}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderPrizes() {
  const container = document.getElementById('prizesGrid');
  if (!container) return;

  const t = I18N[state.lang] || I18N.es;

  container.innerHTML = PRIZES_DATA.map(p => {
    const d = p[state.lang] || p.es;
    const owned = state.prizes[p.id] || 0;
    const canAfford = state.tickets >= p.cost;
    return `
      <div class="prize-card">
        <div class="prize-icon">${p.icon}</div>
        <div class="prize-name">${d.name}</div>
        <div class="prize-cost">🎫 ${p.cost} ${t.ticketWord}</div>
        ${owned > 0 ? `<div style="font-size: 11px; color: var(--accent-green); font-weight: 800;">${t.ownedText} ${owned}</div>` : ''}
        <button class="btn-redeem" onclick="redeemPrize('${p.id}')" ${!canAfford ? 'disabled' : ''}>
          ${canAfford ? t.redeemBtn : t.needMoreTickets}
        </button>
      </div>
    `;
  }).join('');
}

function redeemPrize(prizeId) {
  const prize = PRIZES_DATA.find(p => p.id === prizeId);
  if (!prize || state.tickets < prize.cost) return;

  state.tickets -= prize.cost;
  state.prizes[prizeId] = (state.prizes[prizeId] || 0) + 1;

  if (prizeId === 'pajarito') {
    audio.playBird();
  } else {
    audio.playFanfare();
  }

  updateTicketDisplay();

  const phraseEl = document.getElementById('miniBoothPhrase');
  if (phraseEl) {
    const t = I18N[state.lang] || I18N.es;
    const d = prize[state.lang] || prize.es;
    phraseEl.innerHTML = t.redeemedPhrase(d.name, d.phrase);
  }
}

function openGameModal(gameId) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;

  state.activeModalGameId = gameId;
  audio.playWoodClick();

  const overlay = document.getElementById('gameModalOverlay');
  const content = document.getElementById('modalContent');
  if (!overlay || !content) return;

  const t = I18N[state.lang] || I18N.es;
  const d = game[state.lang] || game.es;

  content.innerHTML = `
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
      <div style="font-size: 40px; background: var(--bg-elevated); padding: 10px; border-radius: 14px; border: 1px solid var(--border-card);">${game.icon}</div>
      <div>
        <h2 style="font-family: var(--font-display); font-size: 24px; color: var(--accent-gold);">${d.title}</h2>
        <div style="font-family: var(--font-accent); color: var(--accent-rose); font-weight: 700; font-size: 14px;">${d.subtitle}</div>
      </div>
    </div>

    <div style="margin-bottom: 20px; font-size: 15px; color: var(--text-muted); line-height: 1.6;">
      ${d.desc}
    </div>

    <div style="background: var(--bg-elevated); border: 1px solid var(--border-card); border-radius: 14px; padding: 16px; margin-bottom: 20px;">
      <h4 style="font-family: var(--font-accent); font-size: 14px; font-weight: 800; color: var(--accent-gold); margin-bottom: 8px;">${t.modalRulesTitle}</h4>
      <p style="font-size: 14px; color: var(--text-main); line-height: 1.6;">${d.rules}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-family: var(--font-accent); font-size: 14px; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">${t.modalIncludesTitle}</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
        ${d.features.map(f => `<li style="font-size: 13px; color: var(--text-muted);">✦ ${f}</li>`).join('')}
      </ul>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn-secondary" onclick="closeGameModal()" style="padding: 10px 18px;">
        ${t.modalCloseBtn}
      </button>
      <a href="${game.playUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-play" style="width: auto; padding: 10px 24px;">
        ${t.modalPlayBtn}
      </a>
    </div>
  `;

  overlay.classList.add('active');
}

function closeGameModal() {
  state.activeModalGameId = null;
  const overlay = document.getElementById('gameModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function setupEventListeners() {
  // Launch Mini Game Button
  const launchBtn = document.getElementById('btnLaunchMini');
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      if (miniGame) miniGame.launch();
    });
  }

  // Language Toggle Button (ES / EN)
  const langBtn = document.getElementById('btnLangToggle');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }

  // Audio Toggle Button
  const audioBtn = document.getElementById('btnAudioToggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      const t = I18N[state.lang] || I18N.es;
      if (state.audioEnabled) {
        audioBtn.textContent = t.soundOn;
        audioBtn.style.borderColor = 'var(--accent-green)';
        audio.playBell();
      } else {
        audioBtn.textContent = t.soundOff;
        audioBtn.style.borderColor = '';
        if (audio.musicPlaying) audio.toggleMusic();
      }
    });
  }

  // Music Toggle Button
  const musicBtn = document.getElementById('btnMusicToggle');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!state.audioEnabled) {
        state.audioEnabled = true;
        const ab = document.getElementById('btnAudioToggle');
        const t = I18N[state.lang] || I18N.es;
        if (ab) ab.textContent = t.soundOn;
      }
      const isPlaying = audio.toggleMusic();
      const t = I18N[state.lang] || I18N.es;
      musicBtn.textContent = isPlaying ? t.musicOn : t.musicOff;
      musicBtn.style.borderColor = isPlaying ? 'var(--accent-gold)' : '';
    });
  }

  // Theme Toggle Button
  const themeBtn = document.getElementById('btnThemeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themes = ['noche', 'dia', 'talavera'];
      const currentIndex = themes.indexOf(state.theme);
      state.theme = themes[(currentIndex + 1) % themes.length];
      document.documentElement.setAttribute('data-theme', state.theme);

      const t = I18N[state.lang] || I18N.es;
      themeBtn.textContent = t.themes[state.theme] || t.themes.noche;
      audio.playWoodClick();
      if (miniGame) miniGame.renderStatic();
    });
  }

  // Category filter pills
  const pills = document.querySelectorAll('.filter-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      state.activeFilter = target.getAttribute('data-filter') || 'all';
      audio.playWoodClick();
      renderBooths();
    });
  });

  // Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderBooths();
    });
  }

  // Modal Close Button & Backdrop
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeGameModal);
  }

  const modalOverlay = document.getElementById('gameModalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeGameModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGameModal();
  });
}

// Global hook for inline handlers
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.redeemPrize = redeemPrize;
window.toggleLanguage = toggleLanguage;
window.audio = audio;

// Bootstrap
document.addEventListener('DOMContentLoaded', initApp);
