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

// --- Modal 1: Imagem com Zoom (Com Som Integrado) ---
const modal = document.getElementById('retroModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalImgContainer = document.querySelector('.modal-img-container');

function openModal(src, captionText) {
  if (modal && modalImage) {
    modalImage.src = src;
    if (modalCaption) modalCaption.textContent = captionText;
    modal.style.display = 'flex';
    if (modalImgContainer) modalImgContainer.classList.remove('zoomed');
    playClickSound();
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    if (modalImage) modalImage.src = '';
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

// --- Modal 2: Notícias (Cybersec Brazil) ---
const newsModal = document.getElementById('newsModal');

function openNewsModal() {
  if (newsModal) {
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
  }
});

// --- Alternador de Efeito VHS ---
const vhsBtn = document.getElementById('vhs');
if (vhsBtn) {
  vhsBtn.addEventListener('click', () => {
    document.body.classList.toggle('vhs');
    const isVhsOn = document.body.classList.contains('vhs');
    vhsBtn.textContent = `Efeito VHS: ${isVhsOn ? 'ligado' : 'desligado'}`;
    playClickSound();
  });
}

// --- Web Audio API para Efeitos Sonoros Retrô (Universal & Desbloqueado) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Desbloqueia automaticamente o áudio no primeiro clique em qualquer lugar da página
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
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch(e) {}
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
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch(e) {}
}

function playGlitchSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    for(let i = 0; i < 4; i++) {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100 + Math.random() * 800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }, i * 40);
    }
  } catch(e) {}
}

// --- WIDGET 1: Winamp Player Controls ---
function playerAction(action) {
  const iframe = document.getElementById('youtubePlayer');
  if (!iframe) return;
  
  if (action === 'play') {
    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  } else if (action === 'pause') {
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  } else if (action === 'restart') {
    iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  }
  playClickSound();
}

// --- WIDGET 2: Tamagotchi Cyber Pet ---
let petHunger = 50;
let petMood = '😀';
const petFaces = {
  happy: ['(>^ω^<)', '(•ω•)', '(=^‥^=)'],
  love: ['(｡♥‿♥｡)', '(✿ ♥‿♥)', '(˘⌣˘ʃƪ)'],
  hungry: ['(°ロ°)', '(¬_¬)', '(-_-)'],
  party: ['(ﾉ◕ヮ◕)ﾉ*;✧', ' \\(^ヮ^)/ ']
};

function updatePetDisplay() {
  const statusEl = document.getElementById('petStatus');
  const faceEl = document.getElementById('petFace');
  if (statusEl && faceEl) {
    statusEl.textContent = `Fome: ${petHunger}% | Humor: ${petMood}`;
    
    let list = petFaces.happy;
    if (petHunger > 70) {
      list = petFaces.hungry;
    } else if (petMood === '🎉') {
      list = petFaces.party;
    } else if (petMood === '😍' || petMood === '😎') {
      list = petFaces.love;
    }
    const randomFace = list[Math.floor(Math.random() * list.length)];
    faceEl.textContent = randomFace;
  }
}

function feedPet() {
  petHunger = Math.max(0, petHunger - 25);
  petMood = petHunger < 30 ? '😍' : '😎';
  updatePetDisplay();
  playClickSound();
}

function playPet() {
  petMood = '🎉';
  petHunger = Math.min(100, petHunger + 10);
  updatePetDisplay();
  playClickSound();
}

setInterval(() => {
  if (petHunger < 100) petHunger += 2;
  if (petHunger > 80) petMood = '😭';
  updatePetDisplay();
}, 15000);

// --- ASSISTENTE VIRTUAL FLUTUANTE ---
const tips = [
  '🤖 "Sabia que você pode clicar em qualquer foto de campo para ampliá-la com zoom?"',
  '🤖 "Teste o efeito VHS no menu lateral para alternar o visual retrô!"',
  '🤖 "Interaja com o Tamagotchi para mantê-lo feliz e saudável!"',
  '🤖 "Não se esqueça de assinar o livro de visitas!"',
  '🤖 "Dê um play na trilha sonora de Karl Casey para curtir o som!"'
];

function assistantTip() {
  const assistantEl = document.getElementById('virtualAssistantText');
  if (assistantEl) {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    assistantEl.textContent = randomTip;
  }
  playClickSound();
}

function toggleAssistant() {
  const body = document.querySelector('.floating-assistant .assistant-body');
  const btn = document.querySelector('.assistant-toggle-btn');
  if (body && btn) {
    if (body.style.display === 'none') {
      body.style.display = 'block';
      btn.textContent = '[ _ ]';
    } else {
      body.style.display = 'none';
      btn.textContent = '[ + ]';
    }
  }
  playClickSound();
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  initVisitorCounter();
});
