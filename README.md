# 🎪 La Feria • Juegos Tradicionales Mexicanos en Línea 🇲🇽

> **«¡Pásele marchante, pásele a la feria! Los juegos de siempre, ahora multijugador y en tu navegador.»**

[![Rust](https://img.shields.io/badge/Rust-1.80%2B-orange?logo=rust)](https://www.rust-lang.org/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Real--Time-06b6d4)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Web Audio API](https://img.shields.io/badge/Audio-100%25_Procedural-10b981)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**La Feria** es la vitrina central y portal de entrada para la colección de juegos tradicionales mexicanos desarrollados con backend en **Rust** (**Axum**, **Tokio**, **WebSockets**) y clientes web interactivos a 60fps con audio procedural y diseño de verbena popular.

---

## 🎯 Puestos de la Feria (Catálogo de Juegos)

| Puesto / Juego | Descripción | Modalidad | Tecnologías | Repositorio |
| :--- | :--- | :--- | :--- | :--- |
| 🔮 **Canicas Mexicanas 3D** | Tablero de clavos de feria con hoyitos de puntaje y modo patio (*El Círculo* y *La Hoyita*). | Multijugador & Solitario | Rust, Axum, WebSockets, Canvas 3D | [`pinguxx/canicas`](https://github.com/pinguxx/canicas) |
| ✏️ **Basta Online** | Stop / Tutti Frutti tradicional con libreta cuadriculada, bots mexicanos, audio procedural y votación. | Multijugador & Bots | Rust, Axum, Tokio, WebSockets | [`pinguxx/basta`](https://github.com/pinguxx/basta) |
| 🎴 **Lotería Mexicana** | Clásico de 54 cartas con tablas aleatorias, frijolitos marcadores y cantador con pregones. | Multijugador en vivo | Rust, Axum, Tokio, WebSockets, SVG | [`pinguxx/loteria`](https://github.com/pinguxx/loteria) |
| 🌀 **La Pirinola** | Trompo tradicional de 6 caras (*Toma Todo, Todos Ponen*) con física 3D y apuestas de fichas. | Multijugador & Fiesta | Rust, Axum, WebSockets, Canvas 3D | [`pinguxx/pirinola`](https://github.com/pinguxx/pirinola) |
| 🐍 **Serpientes y Escaleras** | Tablero legendario de 100 casillas con escaleras empinadas, resbalones en víboras y dados 3D. | Multijugador en turnos | Rust, Axum, Tokio, WebSockets | [`pinguxx/shoots_ladders`](https://github.com/pinguxx/shoots_ladders) |
| 🪿 **El Juego de la Oca** | Clásico juego de mesa en espiral de 63 casillas con la muerte, el pozo, el laberinto y dados dobles. | Multijugador familiar | Rust, Axum, Tokio, WebSockets | [`pinguxx/oca`](https://github.com/pinguxx/oca) |

---

## 🌟 Características de la Landing Page

1. **🎪 Atmósfera Auténtica de Feria:**
   - Banderines de papel picado mexicano animados con brisa CSS.
   - Guirnalda de focos incandescentes de kermés con parpadeo dinámico.
   - Toldos a rayas tradicionales en cada puesto de juego.

2. **🔊 Motor de Audio Procedural Web Audio API:**
   - **Vals de organillo de feria:** Síntesis procedural de acordes y arpegios estilo carrusel/calíope sin archivos externos ni descargas pesadas.
   - **Efectos de sonido:** Campana de latón (`playBell`), golpe seco de madera (`playWoodClick`), resorte de canica (`playPlunger`), silbato de pajarito con agua (`playBird`) y fanfarria triunfal (`playFanfare`).

3. **🔮 Puesto de la Suerte Interactivo (Mini-Game de Cabecera):**
   - Mini-tablero de física en HTML5 Canvas con 56 clavos de latón y 4 copas de puntaje.
   - Al soltar la canica, rebota con física real y otorga puntos y **boletos de feria**.

4. **🎁 Vitrina de Premios de la Feria:**
   - Sistema de acumulación de boletos ganados en los juegos.
   - Premios canjeables: *Alcancía de puerquito de yeso*, *Luchador de plástico con rebabas*, *Algodón de azúcar rosa*, *Silbato de pajarito con agua* y *Trompo de madera con piola*.

5. **🎨 Tres Temas Visuales:**
   - **🏮 Noche de Feria** (Por defecto): Azul medianoche, luces cálidas doradas y contrastes neón.
   - **☀️ Día de Fiesta**: Plaza soleada con colores vivos cempasúchil y rosa mexicano.
   - **🏺 Talavera Colonial**: Cerámica azul cobalto profundo y detalles marfil.

6. **🔍 Filtros y Búsqueda en Tiempo Real:**
   - Filtrado instantáneo por categoría (*Destreza & Física*, *Palabras & Mente*, *Tablero Clásico*).
   - Buscador por texto predictivo sobre títulos, descripciones y stacks tecnológicos.

7. **📖 Modal de Reglas y Detalles:**
   - Ventana emergente con el desglose de reglas de cada juego, controles y accesos directos tanto para jugar como para inspeccionar el código fuente.

---

## 🚀 Puesta en Marcha Local con Rust

El servidor web de alta velocidad, los endpoints de la API y el Hub de WebSockets corren nativamente sobre **Rust** con **Axum** y **Tokio**:

```bash
# Clonar el repositorio
git clone https://github.com/pinguxx/la-feria.git
cd la-feria

# Ejecutar el servidor en Rust (Axum + Tokio + WebSockets en puerto 3000)
cargo run

# Ejecutar tests automatizados
cargo test

# Generar bundle autónomo de un solo archivo (CLI en Rust, Zero Python)
cargo run --bin bundle
```

Abre tu navegador en `http://localhost:3000`.

---

## 🏗️ Arquitectura del Ecosistema

Todos los juegos del ecosistema comparten una filosofía de diseño enfocada en rendimiento y portabilidad:

```
                      ┌───────────────────────────────┐
                      │    🎪 LA FERIA (Landing)      │
                      │  HTML5 + Canvas + Procedural  │
                      └──────────────┬────────────────┘
                                     │
         ┌──────────────┬────────────┼────────────┬──────────────┐
         ▼              ▼            ▼            ▼              ▼
    🔮 Canicas      ✏️ Basta     🎴 Lotería   🌀 Pirinola   🐍 Serpientes
    (Axum + WS)    (Axum + WS)  (Axum + WS)  (Axum + WS)    (Axum + WS)
```

- **Runtime Asíncrono:** [Tokio](https://tokio.rs/) para manejo concurrente de múltiples salas de juego.
- **Framework Web:** [Axum](https://github.com/tokio-rs/axum) con serialización de mensajes binarios/JSON mediante `serde`.
- **Comunicación en Vivo:** Canales `broadcast` y `mpsc` sobre WebSockets nativos.
- **Pruebas y Seguridad:** Workflows de GitHub Actions con auditorías de seguridad Trivy y Gitleaks.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
Contribuido y mantenido con orgullo por [@pinguxx](https://github.com/pinguxx).
