/**
 * 🎪 FERIA BRIDGE SDK • Conexión Cross-Game para La Feria
 * 
 * Permite que cualquier juego funcione tanto:
 * 1. STANDALONE: Modo autónomo si el usuario llega directamente.
 * 2. FERIA HUB: Modo conectado si el usuario llega desde La Feria con ?pass=...&hub=...
 * 
 * Inyecta automáticamente el botón «🎪 Volver a la Feria», pre-llena apodo y avatar,
 * y expone `window.FeriaBridge.reportWin({ coins, tickets, score })`.
 */
(function() {
  'use strict';

  // Configuración predeterminada
  const DEFAULT_HUB_URL = 'https://pinguxx.github.io/la-feria/';
  
  // 1. Extraer parámetros de URL
  const urlParams = new URLSearchParams(window.location.search);
  const passId = urlParams.get('pass') || '';
  const playerName = urlParams.get('player') || '';
  const playerAvatar = urlParams.get('avatar') || '🤼';
  const hubUrl = urlParams.get('hub') || DEFAULT_HUB_URL;
  const isFromFeria = Boolean(urlParams.get('hub') || urlParams.get('pass'));

  // 2. Helper de escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 3. Exponer API global
  window.FeriaBridge = {
    passId: passId,
    playerName: playerName,
    playerAvatar: playerAvatar,
    hubUrl: hubUrl,
    isFromFeria: isFromFeria,

    /**
     * Reporta una victoria o monedas ganadas de vuelta a La Feria
     */
    reportWin: async function(options) {
      if (!passId || !hubUrl) return false;
      const opts = options || {};
      const payload = {
        passport_id: passId,
        game_id: opts.gameId || window.location.pathname.replace(/^\/|\/$/g, '') || 'juego_satelite',
        coins: opts.coins || 50,
        tickets: opts.tickets || 2,
        score: opts.score || 0,
        note: opts.note || 'Victoria en partida'
      };

      try {
        const targetUrl = `${hubUrl.replace(/\/$/, '')}/api/rewards/award`;
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return res.ok;
      } catch (err) {
        console.warn('🎪 [FeriaBridge] No se pudo reportar recompensa al hub:', err);
        return false;
      }
    }
  };

  // 4. Inyectar estilos CSS para el botón «Volver a la Feria»
  function injectStyles() {
    if (document.getElementById('feria-bridge-styles')) return;
    const style = document.createElement('style');
    style.id = 'feria-bridge-styles';
    style.textContent = `
      .feria-bridge-container {
        position: fixed;
        top: 12px;
        left: 12px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }

      .feria-bridge-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.88);
        color: #f8fafc;
        text-decoration: none;
        padding: 7px 14px;
        border-radius: 9999px;
        border: 1.5px solid #f59e0b;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 0 10px rgba(245, 158, 11, 0.25);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s, border-color 0.2s;
        user-select: none;
      }

      .feria-bridge-btn:hover {
        background: rgba(30, 41, 59, 0.98);
        border-color: #fbbf24;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55), 0 0 16px rgba(251, 191, 36, 0.45);
        color: #ffffff;
      }

      .feria-bridge-btn:active {
        transform: translateY(0);
      }

      .feria-bridge-icon {
        font-size: 16px;
        line-height: 1;
      }

      .feria-bridge-label {
        letter-spacing: 0.3px;
      }

      .feria-bridge-player-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(245, 158, 11, 0.18);
        border: 1px solid rgba(245, 158, 11, 0.4);
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11.5px;
        color: #fbbf24;
        margin-left: 2px;
      }

      @media (max-width: 640px) {
        .feria-bridge-container {
          top: 8px;
          left: 8px;
        }
        .feria-bridge-btn {
          padding: 5px 10px;
          font-size: 11.5px;
          gap: 5px;
        }
        .feria-bridge-icon {
          font-size: 14px;
        }
        .feria-bridge-player-pill {
          display: none; /* Ahorra espacio en pantallas móviles pequeñas */
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 5. Inyectar botón en el DOM
  function injectBridgeUI() {
    if (document.getElementById('feria-bridge-widget')) return;

    injectStyles();

    const container = document.createElement('div');
    container.id = 'feria-bridge-widget';
    container.className = 'feria-bridge-container';

    const link = document.createElement('a');
    link.href = hubUrl;
    link.className = 'feria-bridge-btn';
    link.setAttribute('rel', 'noopener noreferrer');

    if (isFromFeria) {
      link.title = 'Volver al portal principal de La Feria';
      link.innerHTML = `
        <span class="feria-bridge-icon" aria-hidden="true">🎪</span>
        <span class="feria-bridge-label">Volver a la Feria</span>
        ${playerName ? `<span class="feria-bridge-player-pill">${playerAvatar} ${escapeHtml(playerName)}</span>` : ''}
      `;
    } else {
      // Modo Standalone: Invitación a descubrir la feria
      link.title = 'Explorar la colección completa de Juegos Tradicionales Mexicanos en La Feria';
      link.innerHTML = `
        <span class="feria-bridge-icon" aria-hidden="true">🎪</span>
        <span class="feria-bridge-label">La Feria</span>
      `;
    }

    container.appendChild(link);
    document.body.appendChild(container);
  }

  // 6. Pre-llenar inputs de nombre de jugador si vienen del pasaporte
  function autofillPlayerInfo() {
    if (!playerName) return;

    // Buscar inputs usuales de nickname / jugador
    const selectors = [
      '#input-player-name',
      '#playerName',
      '#player-name',
      '#username',
      '#nickname',
      'input[name="playerName"]',
      'input[name="player_name"]',
      'input[name="nickname"]'
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        el.value = playerName;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectBridgeUI();
      autofillPlayerInfo();
    });
  } else {
    injectBridgeUI();
    autofillPlayerInfo();
  }
})();
