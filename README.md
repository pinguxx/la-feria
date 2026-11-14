# 🎪 La Feria • Juegos Tradicionales Mexicanos en Línea 🇲🇽

> **[Español](#-español) | [English](#-english)**

[![Live Portal](https://img.shields.io/badge/Demo%20Live-GitHub%20Pages-f59e0b?logo=github)](https://pinguxx.github.io/la-feria/)
[![Rust](https://img.shields.io/badge/Rust-1.80%2B-orange?logo=rust)](https://www.rust-lang.org/)
[![Axum 0.8](https://img.shields.io/badge/Axum-0.8-38bdf8)](https://github.com/tokio-rs/axum)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?logo=sqlite)](https://www.sqlite.org/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Real--Time-06b6d4)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Web Audio API](https://img.shields.io/badge/Audio-100%25_Procedural-10b981)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🇲🇽 Español

**La Feria** es la vitrina central, portal de entrada y núcleo de economía unificada para la colección de 8 juegos tradicionales mexicanos desarrollados con backend en **Rust** (**Axum**, **Tokio**, **WebSockets**, **SQLite WAL**) y clientes web interactivos a 60fps con audio procedural, diseño de verbena popular e identidad persistente cross-game.

### 🎯 Puestos de la Feria (Catálogo Oficial de 8 Juegos)

| Puesto / Juego | Descripción | Modalidad | Tecnologías | Enlace / Repo |
| :--- | :--- | :--- | :--- | :--- |
| 🔮 **Canicas Mexicanas 3D** | Tablero tradicional de clavos de latón con hoyitos de puntaje y modos de patio (*El Círculo* y *La Hoyita*). | Multijugador & Solitario | Rust, Axum, WebSockets, Canvas 3D | [Jugar](https://canicas.onrender.com) • [`pinguxx/canicas`](https://github.com/pinguxx/canicas) |
| 🪙 **Rayuela en Barro** | Precisión en tiro parabólico arrojando monedas hacia el cajón de arcilla húmeda con cámara foto-finish en la raya. | Multijugador & Solitario | Rust, Axum, Física 2.5D, Foto-Finish | [Jugar](https://rayuela-tgrr.onrender.com) • [`pinguxx/rayuela`](https://github.com/pinguxx/rayuela) |
| ✏️ **Basta Online** | Stop / Tutti Frutti tradicional con cuaderno escolar, bots mexicanos divertidos, audio procedural y votación comunitaria. | Multijugador & Bots | Rust, Axum, Tokio, WebSockets | [Jugar](https://basta-azbj.onrender.com) • [`pinguxx/basta`](https://github.com/pinguxx/basta) |
| 🃏 **Conquián Mexicano** | El legendario antepasado del Rummy jugado con Baraja Española de 40 cartas, tercias, corridas, ¡Obligado! y pozo acumulado. | 2 a 6 Jugadores | Rust, Axum, Tokio, WebSockets | [Jugar](https://conquian-31gh.onrender.com) • [`pinguxx/conquian`](https://github.com/pinguxx/conquian) |
| 🎴 **Lotería Mexicana** | Clásico juego de 54 cartas con tablas aleatorias, frijolitos para marcar, cantador automático y multijugador sincronizado. | Multijugador en vivo | Rust, Axum, Tokio, WebSockets, SVG | [Jugar](https://loteria-zhet.onrender.com) • [`pinguxx/loteria`](https://github.com/pinguxx/loteria) |
| 🌀 **La Pirinola** | Trompo de 6 caras (*Toma Uno, Toma Dos, Toma Todo, Todos Ponen*) con giro físico 3D y apuestas comunitarias de monedas. | Multijugador & Fiesta | Rust, Axum, WebSockets, Canvas 3D | [Jugar](https://pirinola.onrender.com) • [`pinguxx/pirinola`](https://github.com/pinguxx/pirinola) |
| 🐍 **Serpientes y Escaleras** | Tablero ilustrado de 100 casillas con escaleras de madera, resbalones en víboras y dados 3D. | Multijugador en turnos | Rust, Axum, Tokio, WebSockets | [Jugar](https://shoots-ladders.onrender.com) • [`pinguxx/shoots_ladders`](https://github.com/pinguxx/shoots_ladders) |
| 🪿 **El Juego de la Oca** | Espiral clásica de 63 casillas con el puente, la posada, el pozo, el laberinto, la cárcel, la calavera y dados dobles. | Multijugador familiar | Rust, Axum, Tokio, WebSockets | [Jugar](https://oca-ox87.onrender.com) • [`pinguxx/oca`](https://github.com/pinguxx/oca) |

---

### 🌟 Ecosistema y Economía Unificada

1. **🪪 Pasaporte de la Feria (Identidad Cross-Game):**
   - Perfil de invitado instantáneo con **50 monedas (`🪙`)** y **5 boletos (`🎫`)** de bienvenida.
   - 10 avatares de feria tradicionales (`🤼`, `🎭`, `🤠`, `🌺`, `💀`, `🐯`, `🦅`, `🌮`, `👑`, `🎪`).
   - Opción de blindar el progreso con un **PIN de 4 dígitos** para recuperarlo en cualquier navegador.

2. **🪙 Economía de Premios y Recompensas:**
   - Ganar partidas y pruebas físicas premia con monedas y boletos acreditados automáticamente.
   - Puesto de reclamación para canjear premios auténticos de feria: *Alcancía de puerquito de yeso*, *Luchador de plástico con rebabas*, *Algodón de azúcar rosa*, *Silbato de pajarito con agua* y *Trompo de madera con piola*.

3. **🏆 Salón de la Fama (Cuadro de Honor en Vivo):**
   - Podio tradicional (🥇, 🥈, 🥉) con ranking de los mejores jugadores por monedas, boletos y partidas ganadas.

4. **🎪 Protocolo "Volver a la Feria" & Launch URLs:**
   - Los juegos se abren transmitiendo los parámetros de identidad:
     ```
     https://juego.onrender.com/?pass=<ID>&player=<NICK>&avatar=<AVATAR>&hub=<FERIA_URL>
     ```
   - Cada juego muestra el botón destacado **«🎪 Volver a la Feria»** para regresar al portal principal.

5. **🔊 Motor de Audio Procedural (Web Audio API):**
   - Vals de organillo callejero sintetizado proceduralmente en tiempo real (carrusel/calíope).
   - Efectos de sonido: campana de latón, golpe seco de madera, resorte de canica, trino de pajarito y fanfarria.

6. **🌐 Bilingüe (Español / Inglés) & 3 Temas Visuales:**
   - Selector instantáneo ES / EN en barra superior.
   - Temas: *🏮 Noche de Feria*, *☀️ Día de Fiesta* y *🏺 Talavera Colonial*.

---

### 🚀 Puesta en Marcha Local con Rust

```bash
# 1. Clonar el repositorio
git clone https://github.com/pinguxx/la-feria.git
cd la-feria

# 2. Ejecutar el servidor central (Axum + SQLite WAL + WebSockets en puerto 3000)
cargo run

# 3. Ejecutar suite de pruebas
cargo test

# 4. Generar bundle autónomo de un solo archivo (CLI en Rust, Zero Python)
cargo run --bin bundle
```

Abre tu navegador en `http://localhost:3000`.

---

## 🇺🇸 English

**La Feria** (*The Fair*) is the central gateway, front portal, and unified economy hub for an official collection of 8 classic traditional Mexican games. Powered by a high-performance **Rust** backend (**Axum**, **Tokio**, **WebSockets**, **SQLite WAL mode**) and 60fps interactive web frontends featuring procedural audio synthesis, authentic fairground visuals, and persistent cross-game player passports.

### 🎯 Fairground Game Booths (Official 8-Game Catalog)

| Booth / Game | Description | Play Mode | Technology Stack | Links & Repos |
| :--- | :--- | :--- | :--- | :--- |
| 🔮 **Canicas Mexicanas 3D** | Traditional brass-pin fairground marble board with score cups and backyard playground modes (*El Círculo* & *La Hoyita*). | Multiplayer & Solo | Rust, Axum, WebSockets, 3D Canvas | [Play](https://canicas.onrender.com) • [`pinguxx/canicas`](https://github.com/pinguxx/canicas) |
| 🪙 **Rayuela en Barro** | Parabolic coin-tossing accuracy game into a damp clay pit with photo-finish camera precision along the line. | Multiplayer & Solo | Rust, Axum, 2.5D Physics, Photo-Finish | [Play](https://rayuela-tgrr.onrender.com) • [`pinguxx/rayuela`](https://github.com/pinguxx/rayuela) |
| ✏️ **Basta Online** | Mexican Stop / Tutti Frutti mental agility game with lined notebook aesthetic, witty Mexican bots, procedural sound, and vote system. | Multiplayer & Bots | Rust, Axum, Tokio, WebSockets | [Play](https://basta-azbj.onrender.com) • [`pinguxx/basta`](https://github.com/pinguxx/basta) |
| 🃏 **Conquián Mexicano** | The original Mexican ancestor of Rummy played with a 40-card Spanish deck, sets, sequences, *¡Obligado!*, and table pot. | 2 to 6 Players | Rust, Axum, Tokio, WebSockets | [Play](https://conquian-31gh.onrender.com) • [`pinguxx/conquian`](https://github.com/pinguxx/conquian) |
| 🎴 **Lotería Mexicana** | The classic 54-card Mexican bingo with randomized boards, bean markers, synchronized live caller chants (*El Gallo*, *La Sirena*). | Live Multiplayer | Rust, Axum, Tokio, WebSockets, SVG | [Play](https://loteria-zhet.onrender.com) • [`pinguxx/loteria`](https://github.com/pinguxx/loteria) |
| 🌀 **La Pirinola** | Traditional 6-sided spinning top (*Take One, Take All, Put Two, All Put*) with full 3D physics and community pot betting. | Multiplayer & Party | Rust, Axum, WebSockets, 3D Canvas | [Play](https://pirinola.onrender.com) • [`pinguxx/pirinola`](https://github.com/pinguxx/pirinola) |
| 🐍 **Serpientes y Escaleras** | Illustrated 100-tile board with wooden ladder climbs, snake tail slides, and 3D rolling dice. | Turn-based Multiplayer | Rust, Axum, Tokio, WebSockets | [Play](https://shoots-ladders.onrender.com) • [`pinguxx/shoots_ladders`](https://github.com/pinguxx/shoots_ladders) |
| 🪿 **El Juego de la Oca** | Legendary 63-space spiral board game featuring the bridge, the inn, the well, the maze, prison, skull, and double dice. | Family Multiplayer | Rust, Axum, Tokio, WebSockets | [Play](https://oca-ox87.onrender.com) • [`pinguxx/oca`](https://github.com/pinguxx/oca) |

---

### 🌟 Unified Economy & Ecosystem Features

1. **🪪 Fair Passport (Cross-Game Identity):**
   - Instant guest passport granting **50 coins (`🪙`)** and **5 tickets (`🎫`)** welcome bonus.
   - 10 traditional Mexican carnival avatars (`🤼`, `🎭`, `🤠`, `🌺`, `💀`, `🐯`, `🦅`, `🌮`, `👑`, `🎪`).
   - Optional **4-digit cloud PIN protection** to safeguard and restore balances on any device.

2. **🪙 Carnival Prize Showcase:**
   - Win tickets and coins in game booths and redeem authentic carnival souvenirs: *Plaster Piggy Bank*, *Classic Plastic Lucha Libre Wrestler*, *Pink Cotton Candy*, *Water Bird Whistle*, and *Handmade Wooden Top*.

3. **🏆 Hall of Fame (Live Global Leaderboard):**
   - Real-time ranking with gold, silver, and bronze podium badges (🥇, 🥈, 🥉) displaying top carnival players by coins, tickets, and matches played.

4. **🎪 Cross-Game Navigation Protocol ("Back to the Fair"):**
   - Satellite games are launched with unified query parameters:
     ```
     https://game.onrender.com/?pass=<ID>&player=<NICK>&avatar=<AVATAR>&hub=<FERIA_URL>
     ```
   - Each game features a prominent **«🎪 Back to the Fair»** header link returning players seamlessly to the portal.

5. **🔊 Procedural Web Audio Engine:**
   - Authentic carnival barrel organ (*organillo*) synthesized in real-time without bulky audio files.
   - Interactive sound FX: brass bell, wooden mallet click, spring plunger, chirping bird whistle, and victory fanfare.

6. **🌐 Full Bilingual Support (ES / EN) & 3 Visual Themes:**
   - Instant language switcher in the navbar.
   - Themes: *🏮 Night Fair*, *☀️ Festive Day*, and *🏺 Colonial Talavera*.

---

### 🚀 Running Locally with Rust

```bash
# 1. Clone the repository
git clone https://github.com/pinguxx/la-feria.git
cd la-feria

# 2. Run the Axum server (Axum + SQLite WAL + WebSockets on port 3000)
cargo run

# 3. Run automated tests
cargo test

# 4. Generate standalone single-file distribution (Rust CLI, zero Python)
cargo run --bin bundle
```

Open your browser at `http://localhost:3000`.

---

## 🏗️ Architecture

```
                                ┌─────────────────────────────────┐
                                │     🎪 LA FERIA HUB (Portal)    │
                                │   Axum + SQLite WAL + WS + UI   │
                                └───────────────┬─────────────────┘
                                                │
         ┌───────────────┬──────────────┼───────┴──────┬───────────────┬───────────────┐
         ▼               ▼              ▼              ▼               ▼               ▼
    🔮 Canicas      🪙 Rayuela      ✏️ Basta      🃏 Conquián     🎴 Lotería      🌀 Pirinola ...
    (Render / WS)   (Render / WS)  (Render / WS)  (Render / WS)   (Render / WS)   (Render / WS)
```

- **Async Runtime:** [Tokio](https://tokio.rs/) multi-threaded runtime.
- **Web Layer:** [Axum 0.8](https://github.com/tokio-rs/axum) with JSON & WebSocket channels.
- **Embedded Database:** [rusqlite](https://github.com/rusqlite/rusqlite) bundled in WAL mode (`feria.db`) with zero external runtime dependencies.
- **Deployment Ready:** Multi-stage `Dockerfile` and `render.yaml` for 1-click deployment on Render.com or container platforms.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Proudly crafted and maintained by [@pinguxx](https://github.com/pinguxx).
