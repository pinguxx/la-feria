// ==========================================================================
// 🎪 LA FERIA • JUEGOS TRADICIONALES MEXICANOS • APP LOGIC & AUDIO SYNTH
// ==========================================================================

// Global State
const state = {
  tickets: 10,
  activeFilter: 'all',
  searchQuery: '',
  theme: 'noche',
  audioEnabled: false,
  musicPlaying: false,
  prizes: {
    puerquito: 0,
    luchador: 0,
    algodon: 0,
    pajarito: 0,
    trompo: 0
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
      // Authentic Mexican Carousel/Organillo Waltz Arpeggios (in C major / A minor)
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

// Games Database
const GAMES_DATA = [
  {
    id: 'canicas',
    title: 'Canicas Mexicanas 3D',
    subtitle: 'Feria de Clavos & Patio de Tierra',
    icon: '🔮',
    categories: ['destreza', 'multiplayer'],
    categoryBadge: 'Destreza & Física',
    livePlayers: 'En vivo',
    desc: 'Lanza tu canica de vidrio con el resorte de latón, sortea 56 clavos de madera y embócala en los hoyitos pintados de la feria, o juega en el patio de tierra al Círculo y la Hoyita.',
    features: [
      'Tablero tradicional de feria con clavos y hoyitos de puntaje',
      'Modo Patio: La Rueda / El Círculo y La Hoyita de tierra',
      'Física 3D a 60fps con audio procedural de cristal y campana',
      'Multijugador sincronizado en tiempo real vía WebSockets'
    ],
    tech: ['Rust', 'Axum', 'WebSockets', 'HTML5 Canvas 3D', 'Render'],
    playUrl: 'https://github.com/pinguxx/canicas',
    repoUrl: 'https://github.com/pinguxx/canicas',
    rules: 'Ajusta la fuerza del resorte con el ratón o barra espaciadora. Tu canica rodará por el arco superior y rebotará en los clavos de latón. Si cae en el hoyo de "El Gallo de Oro", ganas 100 puntos y combo doble si ya había canica.'
  },
  {
    id: 'basta',
    title: 'Basta Online',
    subtitle: 'Stop / Tutti Frutti Tradicional',
    icon: '✏️',
    categories: ['palabras', 'multiplayer'],
    categoryBadge: 'Palabras & Mente',
    livePlayers: 'En vivo',
    desc: 'El clásico juego de lápiz y papel llevado al multijugador moderno. Compite por escribir Nombre, Apellido, Ciudad, Flor o Fruto antes de que alguien grite "¡Basta para mí, basta para todos!".',
    features: [
      'Estilo hoja de libreta escolar con margen rojo y temas de feria',
      'Bots inteligentes con modismos mexicanos (El Bryan, Don Lupe)',
      'Gritos rápidos de fiesta con síntesis de audio procedural',
      'Sistema de votación democrática en tiempo real entre jugadores'
    ],
    tech: ['Rust', 'Axum', 'Tokio', 'WebSockets', 'Quality Gates'],
    playUrl: 'https://github.com/pinguxx/basta',
    repoUrl: 'https://github.com/pinguxx/basta',
    rules: 'Se sortea una letra al azar. Todos llenan sus categorías a contrarreloj. El primero en completar grita "¡Basta!". Durante la votación, las respuestas únicas valen 100 puntos y las repetidas 50.'
  },
  {
    id: 'loteria',
    title: 'Lotería Mexicana',
    subtitle: 'Tablas, Frijolitos y Gritón',
    icon: '🎴',
    categories: ['tablero', 'multiplayer'],
    categoryBadge: 'Tablero Tradicional',
    livePlayers: 'En vivo',
    desc: '¡Corre y se va con la primera! Disfruta la tradicional Lotería Mexicana con sus 54 cartas ilustradas, frijolitos para marcar tu tabla y voz de cantador con pregones populares.',
    features: [
      'Las 54 cartas oficiales: El Gallo, La Muerte, El Catrín, La Sirena...',
      'Marcado interactivo con frijoles o corcholatas',
      'Múltiples modalidades: Línea, Cuarteta, Centro o Tabla Llena',
      'Gritón automático y multijugador con salas privadas'
    ],
    tech: ['Rust', 'Axum', 'Tokio', 'WebSockets', 'SVG'],
    playUrl: 'https://github.com/pinguxx/loteria',
    repoUrl: 'https://github.com/pinguxx/loteria',
    rules: 'El cantador canta cada carta con un pregón tradicional. Si la carta cantada está en tu tabla de 4x4, haz clic sobre ella para colocar un frijolito. Completa la figura y sé el primero en gritar "¡Buenas!" o "¡Lotería!".'
  },
  {
    id: 'pirinola',
    title: 'La Pirinola',
    subtitle: 'Toma Todo & Pozo de Fichas',
    icon: '🌀',
    categories: ['destreza', 'multiplayer'],
    categoryBadge: 'Destreza & Suerte',
    livePlayers: 'En vivo',
    desc: 'El emblemático trompito mexicano de 6 caras. Pon tu ficha en el pozo central, dale cuerda al tiro y prepárate para la tensión cuando el trompo desacelera y cae en "¡Toma Todo!".',
    features: [
      'Simulación física de giro tridimensional con bamboleo realista',
      'Las 6 caras tradicionales: Toma Uno, Toma Dos, Toma Todo, Pon Uno, Pon Dos, Todos Ponen',
      'Gestión de pozo de monedas y apuestas comunitarias',
      'Modo fiesta con animaciones festivas y efectos de sonido'
    ],
    tech: ['Rust', 'Axum', 'WebSockets', 'Canvas 3D'],
    playUrl: 'https://github.com/pinguxx/pirinola',
    repoUrl: 'https://github.com/pinguxx/pirinola',
    rules: 'Cada jugador comienza con una bolsa de fichas o monedas y aporta una al pozo ("Todos ponen"). En tu turno, impulsa la pirinola. Cumple la orden de la cara que quede hacia arriba. ¡El que vacía el pozo con Toma Todo se lleva la gloria!'
  },
  {
    id: 'shoots_ladders',
    title: 'Serpientes y Escaleras',
    subtitle: 'El Tablero de las 100 Casillas',
    icon: '🐍',
    categories: ['tablero', 'multiplayer'],
    categoryBadge: 'Tablero Clásico',
    livePlayers: 'En vivo',
    desc: 'Sube hacia la victoria por las escaleras de madera o resbala hasta el fondo por las colas de las víboras en este legendario juego de mesa ilustrado para toda la familia.',
    features: [
      'Tablero numérico clásico de 100 casillas ricamente decorado',
      'Lanzamiento de dados con física realista',
      'Casillas de sorpresa, escalones empinados y serpientes traviesas',
      'Turnos en tiempo real con avatares personalizados'
    ],
    tech: ['Rust', 'Axum', 'Tokio', 'WebSockets'],
    playUrl: 'https://github.com/pinguxx/shoots_ladders',
    repoUrl: 'https://github.com/pinguxx/shoots_ladders',
    rules: 'Por turnos, tira el dado y avanza tu ficha tantas casillas como indique. Si caes al pie de una escalera, subes de inmediato. Si caes en la cabeza de una serpiente, resbalas hasta su cola. Gana el primero en llegar exactamente a la casilla 100.'
  },
  {
    id: 'oca',
    title: 'El Juego de la Oca',
    subtitle: 'De Oca a Oca y Tiro Porque Me Toca',
    icon: '🪿',
    categories: ['tablero', 'multiplayer'],
    categoryBadge: 'Tablero Clásico',
    livePlayers: 'En vivo',
    desc: 'El viaje en espiral más célebre de los juegos de mesa. Cruza el puente, evita la posada, no caigas en el pozo ni en la calavera y salta de oca en oca hasta el Gran Jardín de la Oca.',
    features: [
      'Espiral completa de 63 casillas con casillas especiales clásicas',
      'Mecánica tradicional: La Oca, El Puente, La Posada, El Pozo, El Laberinto, La Cárcel y La Muerte',
      'Modo multijugador en vivo con tiradas de dados dobles',
      'Efectos sonoros clásicos al caer en cada casilla'
    ],
    tech: ['Rust', 'Axum', 'Tokio', 'WebSockets'],
    playUrl: 'https://github.com/pinguxx/oca',
    repoUrl: 'https://github.com/pinguxx/oca',
    rules: 'Tira los dos dados y avanza por la espiral. Si caes en una casilla con oca, repites el tiro diciendo "De oca a oca y tiro porque me toca". Ten cuidado con la casilla 58 (La Calavera), que te regresa al inicio de la espiral.'
  }
];

// Prizes Database
const PRIZES_DATA = [
  { id: 'puerquito', name: 'Alcancía de Puerquito de Yeso', icon: '🐷', cost: 5, phrase: '¡A romperla cuando esté llena!' },
  { id: 'luchador', name: 'Luchador con Rebabas de Plástico', icon: '🤼', cost: 10, phrase: '¡El Santo contra las momias!' },
  { id: 'algodon', name: 'Algodón de Azúcar Rosa', icon: '🍭', cost: 15, phrase: '¡Dulce y esponjoso de feria!' },
  { id: 'pajarito', name: 'Silbato de Pajarito con Agua', icon: '🐦', cost: 20, phrase: '¡Póngale agua para que trine!' },
  { id: 'trompo', name: 'Trompo de Madera con Piola', icon: '🪀', cost: 25, phrase: '¡Sáquelo a bailar en la uña!' }
];

// Fair Phrases for Mini-Booth
const FERIA_PHRASES = [
  '🎪 «¡Pásele marchante, pásele a probar suerte!»',
  '🔮 «¡Una canica más y se lleva la alcancía!»',
  '🎴 «¡El gallo, la sirena y el catrín!»',
  '🌀 «¡Ponga uno, pongan dos, todos ponen!»',
  '✏️ «¡Basta para mí, basta para todos!»',
  '🐍 «¡Cuidado con la víbora de la mar!»',
  '🪿 «¡De oca a oca y tiro porque me toca!»'
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
  }

  setupBoard() {
    this.pins = [];
    // Staggered rows of pins
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

    // 4 Score Cups at bottom
    this.cups = [
      { x: 10, w: 55, pts: 10, tickets: 1, label: '💀 10' },
      { x: 75, w: 50, pts: 50, tickets: 2, label: '🔔 50' },
      { x: 135, w: 50, pts: 100, tickets: 3, label: '👑 100' },
      { x: 195, w: 55, pts: 30, tickets: 1, label: '🎪 30' }
    ];
  }

  renderStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Board background gradient
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#132338');
    bgGrad.addColorStop(1, '#0c1624');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw Brass Pins
    this.pins.forEach(pin => {
      this.ctx.beginPath();
      this.ctx.arc(pin.x, pin.y, pin.r, 0, Math.PI * 2);
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.fill();
      this.ctx.strokeStyle = '#d97706';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Pin highlight
      this.ctx.beginPath();
      this.ctx.arc(pin.x - 1, pin.y - 1, 1, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
    });

    // Draw Bottom Cups
    this.cups.forEach(cup => {
      this.ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(cup.x, 105, cup.w, 22);
      this.ctx.strokeRect(cup.x, 105, cup.w, 22);

      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = 'bold 10px Fredoka, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(cup.label, cup.x + cup.w / 2, 120);
    });

    // Draw marble if exists
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

    // Spawn marble at top with slight random horizontal drift
    this.marble = {
      x: 110 + (Math.random() * 40 - 20),
      y: 10,
      vx: (Math.random() - 0.5) * 2,
      vy: 1.5,
      r: 6
    };

    const update = () => {
      if (!this.marble) return;

      // Gravity
      this.marble.vy += 0.22;
      this.marble.x += this.marble.vx;
      this.marble.y += this.marble.vy;

      // Wall Bounce
      if (this.marble.x - this.marble.r < 4) {
        this.marble.x = 4 + this.marble.r;
        this.marble.vx = -this.marble.vx * 0.7;
        audio.playWoodClick();
      } else if (this.marble.x + this.marble.r > this.width - 4) {
        this.marble.x = this.width - 4 - this.marble.r;
        this.marble.vx = -this.marble.vx * 0.7;
        audio.playWoodClick();
      }

      // Pin Collisions
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

      // Cup Check
      if (this.marble.y >= 115) {
        this.animating = false;
        let awardedCup = this.cups.find(c => this.marble.x >= c.x && this.marble.x <= c.x + c.w);
        if (!awardedCup) awardedCup = this.cups[1]; // fallback

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
  renderBooths();
  renderPrizes();
  updateTicketDisplay();

  miniGame = new MiniFeriaGame('miniFeriaCanvas');

  setupEventListeners();
  randomizePhrase();
}

function randomizePhrase() {
  const el = document.getElementById('miniBoothPhrase');
  if (el) {
    const p = FERIA_PHRASES[Math.floor(Math.random() * FERIA_PHRASES.length)];
    el.textContent = p;
  }
}

function onMiniGameWin(cup) {
  state.tickets += cup.tickets;
  updateTicketDisplay();

  const phraseEl = document.getElementById('miniBoothPhrase');
  if (phraseEl) {
    if (cup.pts === 100) {
      audio.playBell();
      phraseEl.innerHTML = `🎉 <strong>¡EL GALLO DE ORO!</strong> Ganaste <strong>${cup.pts} pts</strong> y <strong>+${cup.tickets} Boletos</strong>`;
    } else {
      audio.playBell();
      phraseEl.innerHTML = `🎯 <strong>¡Premio!</strong> Ganaste <strong>${cup.pts} pts</strong> y <strong>+${cup.tickets} Boletos</strong>`;
    }
  }

  // Flash ticket badge
  const tb = document.getElementById('navTickets');
  if (tb) {
    tb.style.transform = 'scale(1.25)';
    setTimeout(() => tb.style.transform = '', 300);
  }
}

function updateTicketDisplay() {
  const badge = document.getElementById('navTickets');
  if (badge) {
    badge.innerHTML = `🎫 <span id="ticketCount">${state.tickets}</span> Boletos`;
  }
  // Update redeem buttons disabled states
  renderPrizes();
}

function renderBooths() {
  const container = document.getElementById('boothsGrid');
  if (!container) return;

  const query = state.searchQuery.toLowerCase().trim();
  const filtered = GAMES_DATA.filter(g => {
    const matchesCategory = state.activeFilter === 'all' || g.categories.includes(state.activeFilter);
    const matchesSearch = !query ||
      g.title.toLowerCase().includes(query) ||
      g.subtitle.toLowerCase().includes(query) ||
      g.desc.toLowerCase().includes(query) ||
      g.tech.some(t => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-card);">
        <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
        <h3 style="font-family: var(--font-display); color: var(--accent-gold); font-size: 20px; margin-bottom: 8px;">No encontramos ningún puesto</h3>
        <p style="color: var(--text-muted); font-size: 14px;">Prueba buscando otra palabra clave o limpia los filtros.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(game => `
    <article class="booth-card" data-game-id="${game.id}">
      <div class="booth-roof">
        <div class="booth-roof-valance"></div>
      </div>
      <div class="booth-header">
        <div class="booth-icon-box">${game.icon}</div>
        <div class="booth-badges">
          <span class="badge-live">WebSockets</span>
          <span class="badge-players">${game.categoryBadge}</span>
        </div>
      </div>
      <div class="booth-body">
        <h3 class="booth-title">${game.title}</h3>
        <div class="booth-subtitle">${game.subtitle}</div>
        <p class="booth-desc">${game.desc}</p>
        <ul class="booth-features">
          ${game.features.slice(0, 3).map(f => `<li><span>✦</span> ${f}</li>`).join('')}
        </ul>
        <div class="booth-tech">
          ${game.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="booth-actions">
          <a href="${game.playUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-play" onclick="audio.playWoodClick()">
            <span>🎮</span> Jugar / Ver Puesto
          </a>
          <button class="btn-secondary" onclick="openGameModal('${game.id}')">
            <span>📖</span> Reglas
          </button>
          <a href="${game.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" onclick="audio.playWoodClick()">
            <span>📦</span> GitHub
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderPrizes() {
  const container = document.getElementById('prizesGrid');
  if (!container) return;

  container.innerHTML = PRIZES_DATA.map(p => {
    const owned = state.prizes[p.id] || 0;
    const canAfford = state.tickets >= p.cost;
    return `
      <div class="prize-card">
        <div class="prize-icon">${p.icon}</div>
        <div class="prize-name">${p.name}</div>
        <div class="prize-cost">🎫 ${p.cost} Boletos</div>
        ${owned > 0 ? `<div style="font-size: 11px; color: var(--accent-green); font-weight: 800;">✓ Tienes ${owned}</div>` : ''}
        <button class="btn-redeem" onclick="redeemPrize('${p.id}')" ${!canAfford ? 'disabled' : ''}>
          ${canAfford ? 'Canjear Premio' : 'Faltan boletos'}
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
    phraseEl.innerHTML = `🎁 <strong>¡Canjeaste: ${prize.name}!</strong> <em>${prize.phrase}</em>`;
  }
}

function openGameModal(gameId) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) return;

  audio.playWoodClick();

  const overlay = document.getElementById('gameModalOverlay');
  const content = document.getElementById('modalContent');
  if (!overlay || !content) return;

  content.innerHTML = `
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
      <div style="font-size: 40px; background: var(--bg-elevated); padding: 10px; border-radius: 14px; border: 1px solid var(--border-card);">${game.icon}</div>
      <div>
        <h2 style="font-family: var(--font-display); font-size: 24px; color: var(--accent-gold);">${game.title}</h2>
        <div style="font-family: var(--font-accent); color: var(--accent-rose); font-weight: 700; font-size: 14px;">${game.subtitle}</div>
      </div>
    </div>

    <div style="margin-bottom: 20px; font-size: 15px; color: var(--text-muted); line-height: 1.6;">
      ${game.desc}
    </div>

    <div style="background: var(--bg-elevated); border: 1px solid var(--border-card); border-radius: 14px; padding: 16px; margin-bottom: 20px;">
      <h4 style="font-family: var(--font-accent); font-size: 14px; font-weight: 800; color: var(--accent-gold); margin-bottom: 8px;">📜 ¿Cómo se juega? (Reglas de Feria)</h4>
      <p style="font-size: 14px; color: var(--text-main); line-height: 1.6;">${game.rules}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-family: var(--font-accent); font-size: 14px; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">🌟 Características y Tecnologías:</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
        ${game.features.map(f => `<li style="font-size: 13px; color: var(--text-muted);">✦ ${f}</li>`).join('')}
      </ul>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${game.tech.map(t => `<span class="tech-tag" style="background: var(--bg-card); border-color: var(--border-card);">${t}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <a href="${game.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 10px 18px;">
        <span>📦</span> Ver en GitHub
      </a>
      <a href="${game.playUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-play" style="grid-column: auto; padding: 10px 24px;">
        <span>🎮</span> Ir a Jugar
      </a>
    </div>
  `;

  overlay.classList.add('active');
}

function closeGameModal() {
  const overlay = document.getElementById('gameModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function setupEventListeners() {
  // Mini game launch button
  const launchBtn = document.getElementById('btnLaunchMini');
  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      if (miniGame) miniGame.launch();
    });
  }

  // Audio Toggle
  const audioBtn = document.getElementById('btnAudioToggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      if (state.audioEnabled) {
        audioBtn.innerHTML = `🔊 Sonido: ON`;
        audioBtn.style.borderColor = 'var(--accent-green)';
        audio.playBell();
      } else {
        audioBtn.innerHTML = `🔇 Sonido: OFF`;
        audioBtn.style.borderColor = '';
        if (audio.musicPlaying) audio.toggleMusic();
      }
    });
  }

  // Music Toggle
  const musicBtn = document.getElementById('btnMusicToggle');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!state.audioEnabled) {
        state.audioEnabled = true;
        const ab = document.getElementById('btnAudioToggle');
        if (ab) ab.innerHTML = `🔊 Sonido: ON`;
      }
      const isPlaying = audio.toggleMusic();
      musicBtn.innerHTML = isPlaying ? `🎶 Organillo: ON` : `🎵 Organillo: OFF`;
      musicBtn.style.borderColor = isPlaying ? 'var(--accent-gold)' : '';
    });
  }

  // Theme Toggle
  const themeBtn = document.getElementById('btnThemeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themes = ['noche', 'dia', 'talavera'];
      const currentIndex = themes.indexOf(state.theme);
      state.theme = themes[(currentIndex + 1) % themes.length];
      document.documentElement.setAttribute('data-theme', state.theme);

      const labels = {
        noche: '🏮 Noche de Feria',
        dia: '☀️ Día de Fiesta',
        talavera: '🏺 Talavera Colonial'
      };
      themeBtn.innerHTML = `${labels[state.theme]}`;
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
window.audio = audio;

// Bootstrap
document.addEventListener('DOMContentLoaded', initApp);
