// --- Navegação entre Seções ---
const navButtons = document.querySelectorAll('nav button[data-go]');
const sections = document.querySelectorAll('main section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-go');

    sections.forEach(sec => sec.classList.remove('on'));
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.add('on');

    navButtons.forEach(b => b.removeAttribute('aria-current'));
    btn.setAttribute('aria-current', 'true');
  });
});

// =============================================
// CONTADOR GLOBAL DE VISITAS - MAYUMI PORTFOLIO
// API: Count API
// =============================================

const VISITOR_API_KEY = 'mayumi_portfolio_visits_2026_8f2c9d71';

const VISITOR_SESSION_KEY = 'mayumi_portfolio_counted_session';

async function initVisitorCounter() {

    const countEl = document.getElementById('count');

    if (!countEl) return;

    // Não contabilizar testes locais
    if (
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1'
    ) {
        countEl.textContent = 'TESTE';
        return;
    }

    countEl.textContent = 'LOAD...';

    try {

        // Verifica se esta sessão já foi contabilizada
        const alreadyCounted =
            sessionStorage.getItem(VISITOR_SESSION_KEY) === 'true';

        // Define o endpoint
        const endpoint = alreadyCounted ? 'get' : 'hit';

        const apiURL =
            `https://countapi.mileshilliard.com/api/v1/${endpoint}/${VISITOR_API_KEY}`;

        // Consulta ou registra a visita
        const response = await fetch(apiURL, {
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API retornou HTTP ${response.status}`);
        }

        const data = await response.json();

        const totalVisits = Number(data.value);

        if (!Number.isFinite(totalVisits)) {
            throw new Error('Resposta inválida da API.');
        }

        // Marca a sessão como contabilizada
        if (!alreadyCounted) {
            sessionStorage.setItem(VISITOR_SESSION_KEY, 'true');
        }

        // Exibe o total global
        countEl.textContent = String(totalVisits).padStart(6, '0');

    } catch (error) {

        console.error('Erro no contador global:', error);

        countEl.textContent = 'OFFLINE';

    }
}

// Inicialização
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initVisitorCounter
    );

} else {

    initVisitorCounter();

}


// --- Modal 1: Imagem com Zoom ---
const modal = document.getElementById('retroModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalImgContainer = document.querySelector('.modal-img-container');

function openModal(src, captionText) {
  if (modal && modalImage) {
    modalImage.src = src;

    if (modalCaption) {
      modalCaption.textContent = captionText;
    }

    modal.style.display = 'flex';

    if (modalImgContainer) {
      modalImgContainer.classList.remove('zoomed');
    }

    playClickSound();
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';

    if (modalImage) {
      modalImage.src = '';
    }

    playClickSound();
  }
}

function closeModalOnOuterClick(event) {
  if (event.target === modal) {
    closeModal();
  }
}

function toggleZoom() {
  if (modalImgContainer) {
    modalImgContainer.classList.toggle('zoomed');
    playClickSound();
  }
}

// --- Modal 2: Notícias ---
const newsModal = document.getElementById('newsModal');

function openNewsModal() {
  if (newsModal) {
    // carrega o site de notícias só na primeira abertura
    const newsFrame = newsModal.querySelector('iframe[data-src]');
    if (newsFrame && !newsFrame.getAttribute('src')) {
      newsFrame.src = newsFrame.dataset.src;
    }

    newsModal.style.display = 'flex';
    playClickSound();
  }
}

function closeNewsModal() {
  if (newsModal) {
    newsModal.style.display = 'none';
    playClickSound();
  }
}

function closeNewsModalOnOuterClick(event) {
  if (event.target === newsModal) {
    closeNewsModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeNewsModal();
    closeAdSkipView();
  }
});

// --- Alternador de Efeito VHS ---
const vhsBtn = document.getElementById('vhs');

if (vhsBtn) {
  vhsBtn.addEventListener('click', () => {
    document.body.classList.toggle('vhs');

    const isVhsOn = document.body.classList.contains('vhs');

    vhsBtn.textContent =
      `Efeito VHS: ${isVhsOn ? 'ligado' : 'desligado'}`;

    playClickSound();
  });
}

// --- Web Audio API para Efeitos Sonoros ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

document.addEventListener('click', () => {
  initAudio();
}, { once: true });

function playClickSound() {
  try {
    initAudio();

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';

    osc.frequency.setValueAtTime(440, audioCtx.currentTime);

    osc.frequency.exponentialRampToValueAtTime(
      880,
      audioCtx.currentTime + 0.05
    );

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.05
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);

  } catch (e) {}
}

function playHoverSound() {
  try {
    initAudio();

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';

    osc.frequency.setValueAtTime(220, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.03
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);

  } catch (e) {}
}

function playGlitchSound() {
  try {
    initAudio();

    if (!audioCtx) return;

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(
          100 + Math.random() * 800,
          audioCtx.currentTime
        );

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.08
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);

      }, i * 40);
    }

  } catch (e) {}
}

// =============================================
// WIDGET 1: CASSETTE DECK + YOUTUBE PLAYER
// =============================================

let youtubePlayerInstance = null;
let youtubePlayerReady = false;
let youtubeApiLoading = false;

// Atualiza o estado visual do toca-fitas
function setCassetteStatus(status, isPlaying = false) {
  const deck = document.getElementById('cassetteDeck');
  const statusEl = document.getElementById('cassetteStatus');

  if (deck) {
    deck.classList.toggle('is-playing', isPlaying);
  }

  if (statusEl) {
    statusEl.textContent = status;
  }
}

// Cria o player oficial do YouTube
function createYouTubePlayer() {
  const iframe = document.getElementById('youtubePlayer');

  if (
    !iframe ||
    !window.YT ||
    !window.YT.Player ||
    youtubePlayerInstance
  ) {
    return;
  }

  youtubePlayerInstance = new YT.Player('youtubePlayer', {
    // mesmo domínio do iframe (youtube-nocookie) evita o aviso de postMessage
    host: 'https://www.youtube-nocookie.com',
    events: {

      onReady: () => {
        youtubePlayerReady = true;
        setCassetteStatus('READY', false);
      },

      onStateChange: (event) => {
        if (!window.YT || !window.YT.PlayerState) return;

        const state = event.data;

        if (state === YT.PlayerState.PLAYING) {
          setCassetteStatus('PLAYING', true);
          checkForAd();

        } else if (state === YT.PlayerState.PAUSED) {
          setCassetteStatus('PAUSED', false);

        } else if (state === YT.PlayerState.ENDED) {
          setCassetteStatus('END OF TAPE', false);

        } else if (state === YT.PlayerState.BUFFERING) {
          setCassetteStatus('LOADING...', false);

        } else if (state === YT.PlayerState.CUED) {
          setCassetteStatus('READY', false);
        }
      },

      onError: () => {
        youtubePlayerReady = false;
        setCassetteStatus('PLAYER ERROR', false);
      }
    }
  });
}

// Carrega a API do YouTube
function initYouTubePlayer() {
  const iframe = document.getElementById('youtubePlayer');

  if (!iframe) return;

  if (window.YT && window.YT.Player) {
    createYouTubePlayer();
    return;
  }

  if (youtubeApiLoading) return;

  youtubeApiLoading = true;

  const previousCallback = window.onYouTubeIframeAPIReady;

  window.onYouTubeIframeAPIReady = () => {
    if (typeof previousCallback === 'function') {
      previousCallback();
    }

    createYouTubePlayer();
  };

  const apiScript = document.createElement('script');

  apiScript.src = 'https://www.youtube.com/iframe_api';
  apiScript.async = true;

  apiScript.onerror = () => {
    youtubeApiLoading = false;
    setCassetteStatus('API OFFLINE', false);
  };

  document.head.appendChild(apiScript);
}

// =============================================
// PULAR ANÚNCIO
// O YouTube não permite pular anúncios por código: o anúncio roda dentro do
// player deles e a API não oferece esse comando. O botão amplia o player para
// que o botão nativo "Pular anúncio" do YouTube fique visível e clicável.
// =============================================

const YT_CONTENT_VIDEO_ID = 'NZ4Of3lID84';
let adReturnFocusEl = null;

// Detecção de melhor esforço: durante anúncios o id do vídeo costuma diferir
// do conteúdo. Se não der para saber, o botão continua disponível do mesmo jeito.
function checkForAd() {
  const btn = document.getElementById('adSkipBtn');
  if (!btn || !youtubePlayerInstance) return;

  try {
    if (typeof youtubePlayerInstance.getVideoData !== 'function') return;

    const data = youtubePlayerInstance.getVideoData();
    const suspectedAd = !!(data && data.video_id && data.video_id !== YT_CONTENT_VIDEO_ID);

    btn.classList.toggle('is-alert', suspectedAd);

    if (suspectedAd) {
      setCassetteStatus('AD? ▶ PULAR', true);
    }
  } catch (e) {}
}

function openAdSkipView() {
  const iframe = document.getElementById('youtubePlayer');
  const overlay = document.getElementById('adOverlay');
  if (!iframe || !overlay) return;

  adReturnFocusEl = document.activeElement;

  overlay.hidden = false;
  iframe.classList.add('is-expanded');

  const closeBtn = document.getElementById('adCloseBtn');
  if (closeBtn) closeBtn.focus();

  playClickSound();
}

function closeAdSkipView() {
  const iframe = document.getElementById('youtubePlayer');
  const overlay = document.getElementById('adOverlay');
  if (!overlay || overlay.hidden) return;

  overlay.hidden = true;
  if (iframe) iframe.classList.remove('is-expanded');

  const btn = document.getElementById('adSkipBtn');
  if (btn) btn.classList.remove('is-alert');

  if (adReturnFocusEl && typeof adReturnFocusEl.focus === 'function') {
    adReturnFocusEl.focus();
  }
  adReturnFocusEl = null;

  playClickSound();
}

function closeAdSkipViewOnOuterClick(event) {
  if (event.target === document.getElementById('adOverlay')) {
    closeAdSkipView();
  }
}

// Controles do toca-fitas
function playerAction(action) {
  const iframe = document.getElementById('youtubePlayer');

  if (!iframe) return;

  try {

    if (
      youtubePlayerReady &&
      youtubePlayerInstance &&
      typeof youtubePlayerInstance.playVideo === 'function'
    ) {

      if (action === 'play') {
        youtubePlayerInstance.playVideo();
        setCassetteStatus('PLAYING', true);

      } else if (action === 'pause') {
        youtubePlayerInstance.pauseVideo();
        setCassetteStatus('PAUSED', false);

      } else if (action === 'restart') {
        youtubePlayerInstance.seekTo(0, true);
        youtubePlayerInstance.playVideo();
        setCassetteStatus('PLAYING', true);
      }

    } else if (iframe.contentWindow) {

      // Fallback enquanto a API carrega
      const sendCommand = (func, args = '') => {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args
          }),
          'https://www.youtube-nocookie.com'
        );
      };

      if (action === 'play') {
        sendCommand('playVideo');
        setCassetteStatus('PLAYING', true);

      } else if (action === 'pause') {
        sendCommand('pauseVideo');
        setCassetteStatus('PAUSED', false);

      } else if (action === 'restart') {
        sendCommand('seekTo', [0, true]);
        sendCommand('playVideo');
        setCassetteStatus('PLAYING', true);
      }
    }

    playClickSound();

  } catch (error) {
    console.error('Não foi possível controlar o player:', error);
    setCassetteStatus('CONTROL ERROR', false);
  }
}

// =============================================
// WIDGET 2: TAMAGOTCHI CYBER PET
// Sprite pixel-art em SVG, barra de fome e corações de humor.
// =============================================

let petHunger = 50;
let petActionMood = null;     // humor temporário ('party' | 'love') após interagir
let petActionTimer = null;
let petEatingTimer = null;
let petLastCaption = '';

const PET_BODY = [
  '................',
  '................',
  '..##........##..',
  '..###......###..',
  '..############..',
  '.##############.',
  '.##############.',
  '.##############.',
  '.##############.',
  '.##############.',
  '.##############.',
  '.##############.',
  '..############..',
  '..############..',
  '...##......##...',
  '................'
];

// [x, y, largura, altura, cor?, classe?]  (sem cor = cor do LCD "apagada")
const PET_FACES = {
  happy: [
    [4,7,2,2], [10,7,2,2],
    [5,10,1,1], [6,11,4,1], [10,10,1,1]
  ],
  love: [
    [3,6,1,1,'var(--pink)'], [5,6,1,1,'var(--pink)'], [3,7,3,1,'var(--pink)'], [4,8,1,1,'var(--pink)'],
    [9,6,1,1,'var(--pink)'], [11,6,1,1,'var(--pink)'], [9,7,3,1,'var(--pink)'], [10,8,1,1,'var(--pink)'],
    [5,10,1,1], [6,11,4,1], [10,10,1,1]
  ],
  hungry: [
    [3,6,2,1], [11,6,2,1],
    [4,8,2,1], [10,8,2,1],
    [6,11,4,1], [5,12,1,1], [10,12,1,1]
  ],
  party: [
    [4,8,1,1], [5,7,1,1], [6,8,1,1], [9,8,1,1], [10,7,1,1], [11,8,1,1],
    [6,10,4,2],
    [0,3,1,1,'var(--yellow)','confetti'], [15,2,1,1,'var(--pink)','confetti'],
    [0,9,1,1,'var(--pink)','confetti'], [15,8,1,1,'var(--yellow)','confetti'],
    [1,0,1,1,'var(--yellow)','confetti'], [13,0,1,1,'var(--cyan)','confetti']
  ],
  eating: [
    [4,7,2,2], [10,7,2,2],
    [6,10,4,3,null,'chew']
  ]
};

const PET_APPLE = [
  [2,0,1,1,'var(--cyan)'],
  [1,1,4,1], [0,2,6,1], [0,3,6,1], [0,4,6,1], [1,5,4,1]
];

function petSvg(viewSize, shapes, cls) {
  const body = shapes.map(([x, y, w, h, fill, c]) => {
    const f = fill ? ` fill="${fill}"` : '';
    const k = c ? ` class="${c}"` : '';
    return `<rect${k} x="${x}" y="${y}" width="${w}" height="${h}"${f}/>`;
  }).join('');
  return `<svg viewBox="0 0 ${viewSize} ${viewSize}" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

function petBodyShapes() {
  const out = [];
  PET_BODY.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === '#') {
        const start = x;
        while (x < row.length && row[x] === '#') x++;
        out.push([start, y, x - start, 1]);
      } else {
        x++;
      }
    }
  });
  return out;
}

// Humor-base pela fome, com humor temporário por cima
function petMoodKey() {
  if (petHunger > 70) return 'hungry';
  if (petActionMood) return petActionMood;
  return petHunger < 30 ? 'love' : 'happy';
}

const PET_LABELS = { happy: 'Feliz', love: 'Apaixonado', hungry: 'Com fome!', party: 'Animado', eating: 'Nhac nhac...' };
const PET_HEARTS = { happy: 3, love: 5, hungry: 1, party: 5, eating: 4 };

function petHeartSvg(on) {
  const px = [[1,0,2,1],[4,0,2,1],[0,1,7,1],[0,2,7,1],[1,3,5,1],[2,4,3,1],[3,5,1,1]];
  const r = px.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('');
  return `<svg class="${on ? 'on' : ''}" viewBox="0 0 7 6" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${r}</svg>`;
}

function updatePetDisplay(forceMood) {
  const faceEl = document.getElementById('petFace');
  const statusEl = document.getElementById('petStatus');
  const barEl = document.getElementById('petHungerBar');
  const heartsEl = document.getElementById('petHearts');
  if (!faceEl) return;

  const mood = forceMood || petMoodKey();

  // sprite
  faceEl.innerHTML = petSvg(16, petBodyShapes().concat(
    PET_FACES[mood].map(([x, y, w, h, fill, cls]) =>
      [x, y, w, h, (fill === undefined || fill === null) ? 'var(--lcd-bg)' : fill, cls])
  ));
  faceEl.classList.toggle('is-hungry', mood === 'hungry');

  // barra de fome (10 segmentos)
  if (barEl) {
    const filled = Math.round(petHunger / 10);
    barEl.innerHTML = Array.from({ length: 10 }, (_, i) =>
      `<i class="${i < filled ? 'on' : ''}"></i>`).join('');
    barEl.classList.toggle('is-low', petHunger > 70);
  }

  // corações de humor (5)
  if (heartsEl) {
    const n = PET_HEARTS[mood];
    heartsEl.innerHTML = Array.from({ length: 5 }, (_, i) => petHeartSvg(i < n)).join('');
  }

  // legenda (só atualiza se mudar, para não repetir no leitor de tela)
  faceEl.setAttribute('aria-label', `Bichinho virtual: ${PET_LABELS[mood]}, fome ${petHunger}%`);

  if (statusEl) {
    const caption = PET_LABELS[mood];
    if (caption !== petLastCaption) {
      statusEl.textContent = caption;
      petLastCaption = caption;
    }
  }
}

function petSetActionMood(mood, ms = 4000) {
  petActionMood = mood;
  clearTimeout(petActionTimer);
  petActionTimer = setTimeout(() => {
    petActionMood = null;
    updatePetDisplay();
  }, ms);
}

function feedPet() {
  const faceEl = document.getElementById('petFace');
  const foodEl = document.getElementById('petFood');

  petHunger = Math.max(0, petHunger - 25);

  // animação de comer: maçã entra na boca, depois o humor volta
  clearTimeout(petEatingTimer);
  if (foodEl) {
    foodEl.innerHTML = petSvg(6, PET_APPLE);
    foodEl.hidden = false;
    foodEl.style.animation = 'none';
    void foodEl.offsetWidth;
    foodEl.style.animation = '';
  }
  if (faceEl) faceEl.classList.add('is-busy');
  updatePetDisplay('eating');

  petEatingTimer = setTimeout(() => {
    if (foodEl) foodEl.hidden = true;
    if (faceEl) faceEl.classList.remove('is-busy');
    petSetActionMood(petHunger < 30 ? 'love' : null, 4000);
    updatePetDisplay();
  }, 1200);

  playClickSound();
}

function playPet() {
  const faceEl = document.getElementById('petFace');

  petHunger = Math.min(100, petHunger + 10);
  petSetActionMood('party', 3500);
  updatePetDisplay();

  if (faceEl) {
    faceEl.classList.remove('is-jumping');
    void faceEl.offsetWidth;
    faceEl.classList.add('is-jumping');
    setTimeout(() => faceEl.classList.remove('is-jumping'), 1600);
  }

  playClickSound();
}

setInterval(() => {
  if (petHunger < 100) petHunger = Math.min(100, petHunger + 2);
  updatePetDisplay();
}, 15000);

// =============================================
// ASSISTENTE VIRTUAL (MAYU-BOT)
// Estados: visível/escondida (botão "Chamar"), balão aberto/minimizado,
// anda entre os cantos ao trocar de seção e pode ser arrastada.
// =============================================

const VA_STORAGE_KEY = 'mayumi_portfolio_assistant';

const vaTips = [
  'Você pode clicar em qualquer foto de campo para ampliá-la com zoom!',
  'Teste o efeito VHS no menu lateral para alternar o visual retrô!',
  'Interaja com o Tamagotchi para mantê-lo feliz e saudável!',
  'Fique ligado nas últimas notícias no mundo da tecnologia! Clique no botão [ Tela cheia ] do feed de notícias para ler as notícias completas!',
  'Quer falar com a Mayumi? As redes sociais ficam no fim de "Sobre mim".',
  'Coloque a fita "Hackers" de Karl Casey para tocar no Cassette Player!',
  'Você pode me arrastar pela tela. Também posso me esconder, é só pedir!'
];

const vaSectionTips = {
  sobre: 'Esta é a página inicial! Aqui tem faculdades, habilidades, mural, redes sociais e entre outras subseções.',
  cursos: 'Esta seção mostra os cursos que a Mayumi fez e quais certificações ela possui.',
  experiencias: 'Esta seção mostra as experiências profissionais da Mayumi, incluindo estágios e trabalhos voluntários.',
  fotos: 'Esta seção contém registros de experiências e jornadas técnicas',
  projetos: 'Seção de projetos! Aqui você pode ver os trabalhos que a Mayumi desenvolveu, incluindo sites, aplicativos e outros projetos interessantes.'
};

const vaState = {
  hidden: false,     // escondida (só o botão "Chamar" aparece)
  muted: false,      // balão minimizado: novidades viram um "!" no robô
  bubbleOpen: false,
  corner: 'br',      // 'br' | 'bl' | 'free'
  x: 0, y: 0,
  typeToken: 0,
  closeTimer: null,
  idleTimer: null,
  lastTip: -1,
  hasUnread: false
};

const vaReduceMotion = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function vaEls() {
  return {
    root: document.getElementById('virtualAssistant'),
    bubble: document.getElementById('vaBubble'),
    text: document.getElementById('virtualAssistantText'),
    mascot: document.getElementById('vaMascot'),
    dot: document.getElementById('vaDot'),
    call: document.getElementById('vaCall')
  };
}

function vaSave() {
  try {
    localStorage.setItem(VA_STORAGE_KEY, JSON.stringify({
      hidden: vaState.hidden,
      muted: vaState.muted
    }));
  } catch (e) {}
}

function vaLoad() {
  try {
    const saved = JSON.parse(localStorage.getItem(VA_STORAGE_KEY) || '{}');
    vaState.hidden = !!saved.hidden;
    vaState.muted = !!saved.muted;
  } catch (e) {}
}

// Som curtinho de "fala"
function playTalkSound() {
  try {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(500 + Math.random() * 250, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

// ---------- Posição ----------
const VA_MARGIN = 16;

function vaSize() {
  const { root } = vaEls();
  return root ? root.offsetWidth || 96 : 96;
}

function vaCornerPos(corner) {
  const size = vaSize();
  const x = corner === 'bl' ? VA_MARGIN : window.innerWidth - size - VA_MARGIN;
  const y = window.innerHeight - size - VA_MARGIN;
  return { x: Math.max(0, x), y: Math.max(0, y) };
}

function vaClamp(x, y) {
  const size = vaSize();
  return {
    x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - size)),
    y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - size))
  };
}

function vaApplyPosition() {
  const { root } = vaEls();
  if (!root) return;
  root.style.left = vaState.x + 'px';
  root.style.top = vaState.y + 'px';
  vaUpdateSide();
}

// Decide para que lado o balão abre, para sempre caber na tela
function vaUpdateSide() {
  const { root, bubble } = vaEls();
  if (!root || !bubble) return;

  const size = vaSize();
  const vw = window.innerWidth;
  const bw = Math.min(260, vw - 16);
  const bh = bubble.hidden ? 170 : bubble.offsetHeight + 14;

  const left = vaState.x;
  const right = vaState.x + size;
  const fitsRight = right - bw >= 4;
  const fitsLeft = left + bw <= vw - 4;
  const centerOnRightHalf = (left + right) / 2 > vw / 2;

  let h = centerOnRightHalf ? 'right' : 'left';
  if (h === 'right' && !fitsRight && fitsLeft) h = 'left';
  if (h === 'left' && !fitsLeft && fitsRight) h = 'right';

  let shift = 0;
  if (h === 'right' && !fitsRight) shift = 4 - (right - bw);
  if (h === 'left' && !fitsLeft) shift = (vw - 4) - (left + bw);

  root.dataset.h = h;
  root.dataset.v = vaState.y >= bh + 8 ? 'up' : 'down';
  root.style.setProperty('--va-bx', shift + 'px');
}

function vaMoveTo(corner, instant = false) {
  const { root } = vaEls();
  if (!root) return;

  const target = vaCornerPos(corner);
  const goingLeft = target.x < vaState.x;
  const distance = Math.abs(target.x - vaState.x) + Math.abs(target.y - vaState.y);

  vaState.corner = corner;
  vaState.x = target.x;
  vaState.y = target.y;

  if (instant || vaReduceMotion || distance < 4) {
    root.style.transition = 'none';
    vaApplyPosition();
    void root.offsetWidth;
    root.style.transition = '';
    return;
  }

  root.dataset.facing = goingLeft ? 'left' : 'right';
  root.classList.add('is-moving');
  vaApplyPosition();

  setTimeout(() => {
    root.classList.remove('is-moving');
    root.dataset.facing = 'right';
  }, 950);
}

// ---------- Fala e balão ----------
function vaSetTalking(on) {
  const { root } = vaEls();
  if (root) root.classList.toggle('is-talking', on);
}

function vaClearCloseTimer() {
  clearTimeout(vaState.closeTimer);
  vaState.closeTimer = null;
}

function vaScheduleClose(ms = 12000) {
  vaClearCloseTimer();
  vaState.closeTimer = setTimeout(() => {
    const { bubble } = vaEls();
    // não fecha enquanto a pessoa estiver com o mouse ou foco no balão
    if (bubble && (bubble.matches(':hover') || bubble.contains(document.activeElement))) {
      vaScheduleClose(4000);
      return;
    }
    vaCloseBubble();
  }, ms);
}

function vaTypeText(text) {
  const { text: el } = vaEls();
  if (!el) return;

  const token = ++vaState.typeToken;

  if (vaReduceMotion) {
    el.textContent = text;
    vaSetTalking(false);
    vaUpdateSide();
    return;
  }

  el.textContent = '';
  vaSetTalking(true);

  let i = 0;
  const step = () => {
    if (token !== vaState.typeToken) return;

    i += 1;
    el.textContent = text.slice(0, i);
    if (i % 2 === 0) playTalkSound();

    if (i < text.length) {
      setTimeout(step, 24);
    } else {
      vaSetTalking(false);
      vaUpdateSide();
    }
  };
  step();
}

function vaOpenBubble() {
  const { bubble, dot } = vaEls();
  if (!bubble) return;
  bubble.hidden = false;
  vaState.bubbleOpen = true;
  vaState.hasUnread = false;
  if (dot) dot.hidden = true;
  vaUpdateSide();
}

function vaCloseBubble() {
  const { bubble } = vaEls();
  if (!bubble) return;
  vaClearCloseTimer();
  vaState.typeToken++;
  vaSetTalking(false);
  bubble.hidden = true;
  vaState.bubbleOpen = false;
  vaUpdateSide();
}

// Fala algo. Se estiver minimizada, só avisa com o "!" (a menos que force = true)
function assistantSay(message, { force = false } = {}) {
  const { dot } = vaEls();
  if (vaState.hidden) return;

  if (vaState.muted && !force) {
    vaState.hasUnread = true;
    vaState.pendingMessage = message;
    if (dot) dot.hidden = false;
    return;
  }

  vaOpenBubble();
  vaTypeText(message);
  vaScheduleClose(Math.max(9000, message.length * 90));
}

function vaNextTip() {
  let i;
  do {
    i = Math.floor(Math.random() * vaTips.length);
  } while (vaTips.length > 1 && i === vaState.lastTip);
  vaState.lastTip = i;
  return vaTips[i];
}

// Compatível com chamadas antigas
function assistantTip() {
  vaState.muted = false;
  vaSave();
  assistantSay(vaNextTip(), { force: true });
  playClickSound();
}

// ---------- Esconder / chamar ----------
function vaHide() {
  const { root, call } = vaEls();
  if (!root || vaState.hidden) return;

  vaClearCloseTimer();
  vaState.typeToken++;
  vaSetTalking(false);
  vaState.hidden = true;
  vaSave();

  root.classList.add('is-leaving');
  setTimeout(() => {
    root.hidden = true;
    root.classList.remove('is-leaving');
    if (call) call.hidden = false;
  }, vaReduceMotion ? 0 : 400);
  playClickSound();
}

function vaShow(greeting) {
  const { root, call } = vaEls();
  if (!root) return;

  vaState.hidden = false;
  vaState.muted = false;
  vaSave();

  if (call) call.hidden = true;
  root.hidden = false;
  vaMoveTo('br', true);

  root.classList.add('is-entering');
  setTimeout(() => root.classList.remove('is-entering'), 500);

  assistantSay(greeting || 'Voltei! Posso ajudar com alguma dica?', { force: true });
  vaScheduleIdle();
  playClickSound();
}

// ---------- Dicas espontâneas ----------
function vaScheduleIdle() {
  clearTimeout(vaState.idleTimer);
  vaState.idleTimer = setTimeout(() => {
    if (!vaState.hidden && !document.hidden && !vaState.bubbleOpen) {
      const corner = vaState.corner === 'br' ? 'bl' : 'br';
      if (vaState.corner !== 'free') vaMoveTo(corner);
      setTimeout(() => assistantSay(vaNextTip()), vaReduceMotion ? 0 : 1000);
    }
    vaScheduleIdle();
  }, 45000);
}

// ---------- Reações ao site ----------
function vaReactToSection(id) {
  if (vaState.hidden) return;
  const message = vaSectionTips[id];
  if (!message) return;

  // anda para o canto oposto e comenta a seção
  if (vaState.corner !== 'free') {
    vaMoveTo(vaState.corner === 'br' ? 'bl' : 'br');
  }
  setTimeout(() => assistantSay(message), vaReduceMotion ? 0 : 1000);
}

// ---------- Arrastar ----------
function vaSetupDrag() {
  const { root, mascot } = vaEls();
  if (!root || !mascot) return;

  let dragging = false;
  let moved = false;
  let startX = 0, startY = 0, originX = 0, originY = 0;

  mascot.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    originX = vaState.x;
    originY = vaState.y;
    try { mascot.setPointerCapture(e.pointerId); } catch (err) {}
  });

  mascot.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!moved && Math.hypot(dx, dy) < 6) return;

    if (!moved) {
      moved = true;
      root.classList.add('is-dragging');
      root.classList.remove('is-moving');
    }

    const pos = vaClamp(originX + dx, originY + dy);
    vaState.x = pos.x;
    vaState.y = pos.y;
    vaState.corner = 'free';
    vaApplyPosition();
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    try { mascot.releasePointerCapture(e.pointerId); } catch (err) {}
    root.classList.remove('is-dragging');

    if (moved) {
      // evita que o "click" do fim do arraste abra o balão
      mascot.dataset.justDragged = 'true';
      setTimeout(() => { delete mascot.dataset.justDragged; }, 50);
    }
  };

  mascot.addEventListener('pointerup', endDrag);
  mascot.addEventListener('pointercancel', endDrag);

  mascot.addEventListener('click', () => {
    if (mascot.dataset.justDragged) return;

    if (vaState.bubbleOpen) {
      vaCloseBubble();
    } else {
      vaState.muted = false;
      vaSave();
      assistantSay(vaState.hasUnread && vaState.pendingMessage
        ? vaState.pendingMessage
        : vaNextTip(), { force: true });
      vaState.pendingMessage = null;
    }
    playClickSound();
  });
}

// ---------- Inicialização ----------
function initVirtualAssistant() {
  const { root, bubble, call } = vaEls();
  if (!root || !bubble || !call) return;

  vaLoad();
  vaSetupDrag();

  document.getElementById('vaMinimize').addEventListener('click', () => {
    vaState.muted = true;
    vaSave();
    vaCloseBubble();
    playClickSound();
  });

  document.getElementById('vaTip').addEventListener('click', () => {
    assistantTip();
  });

  document.getElementById('vaHide').addEventListener('click', vaHide);
  call.addEventListener('click', () => vaShow());

  // pausa o fechamento automático enquanto o mouse está no balão
  bubble.addEventListener('mouseleave', () => {
    if (vaState.bubbleOpen) vaScheduleClose(5000);
  });

  // reage à navegação entre seções
  document.querySelectorAll('nav button[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => vaReactToSection(btn.getAttribute('data-go')));
  });

  // reage ao efeito VHS (este listener roda depois do que alterna a classe)
  const vhs = document.getElementById('vhs');
  if (vhs) {
    vhs.addEventListener('click', () => {
      assistantSay(document.body.classList.contains('vhs')
        ? 'Fita rebobinada! Visual VHS ligado.'
        : 'Modo limpo ativado. Sem chiado na tela!');
    });
  }

  window.addEventListener('resize', () => {
    if (vaState.hidden) return;
    if (vaState.corner === 'free') {
      const pos = vaClamp(vaState.x, vaState.y);
      vaState.x = pos.x;
      vaState.y = pos.y;
      vaApplyPosition();
    } else {
      vaMoveTo(vaState.corner, true);
    }
  });

  if (vaState.hidden) {
    root.hidden = true;
    call.hidden = false;
    return;
  }

  call.hidden = true;
  root.hidden = false;
  vaMoveTo('br', true);
  root.classList.add('is-entering');
  setTimeout(() => root.classList.remove('is-entering'), 500);

  if (vaState.muted) {
    vaState.hasUnread = true;
    vaState.pendingMessage = 'Olá! Clique nos botões para explorar o portfólio da Mayumi!';
    vaEls().dot.hidden = false;
  } else {
    setTimeout(() => assistantSay('Olá! Eu sou o Mayu-Bot. Clique nos botões para explorar o portfólio da Mayumi!'), 600);
  }

  vaScheduleIdle();
}

// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initVisitorCounter();
  initYouTubePlayer();
  initVirtualAssistant();
  updatePetDisplay();
});
