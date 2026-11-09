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

// --- Contador de Visitantes Real (CountAPI) ---
function initVisitorCounter() {
  const countEl = document.getElementById('count');
  if (!countEl) return;

  // Exibe o texto de carregamento retrô
  countEl.textContent = 'LOAD...';

  fetch('https://api.countapi.xyz/hit/mayumiware-portfolio/visits')
    .then(res => res.json())
    .then(data => {
      if (data && typeof data.value !== 'undefined') {
        countEl.textContent = String(data.value).padStart(6, '0');
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      // Fallback clássico caso a API caia momentaneamente
      countEl.textContent = '001337';
    });
}

// --- Modal 1: Imagem com Zoom ---
const modal = document.getElementById('retroModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalImgContainer = document.querySelector('.modal-img-container');

function openModal(src, captionText) {
  if (modal && modalImage) {
    modalImage.src = src;
    if (modalCaption) modalCaption.textContent = captionText;
    modal.style.display = 'flex';
    modalImgContainer.classList.remove('zoomed');
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    if (modalImage) modalImage.src = '';
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

// --- Web Audio API para Efeitos Sonoros Retrô ---
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClickSound() {
  try {
    initAudio();
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
    for(let i=0; i<4; i++) {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100 + Math.random()*800, audioCtx.currentTime);
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

// --- WIDGET 2: Tamagotchi Cyber Pet (Expressões Dinâmicas) ---
let petHunger = 50;
let petMood = '😀';
const petFaces = {
  happy: ['(>^ω^<)', '(•ω•)', '(=^‥^=)'],
  love: ['(｡♥‿♥｡)', '(✿ ♥‿♥)', '(˘⌣˘ʃƪ)'],
  hungry: ['(°ロ°)', '(¬_¬)', '(-_-)'],
  party: ['(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', ' \\(^ヮ^)/ ']
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
  '🤖 "Não deixe de assinar o livro de visitas com persistência local!"',
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

// --- WIDGET 4: Livro de Visitas (Guestbook) com Persistência (localStorage) ---
const GUESTBOOK_KEY = 'mayumi_space_guestbook';

function loadGuestbook() {
  const container = document.getElementById('guestbookMessages');
  if (!container) return;

  const savedMessages = JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || [];
  
  if (savedMessages.length === 0) {
    container.innerHTML = '<div style="color: var(--yellow);">[Sistema]: Deixe seu recado!</div>';
  } else {
    container.innerHTML = '';
    savedMessages.forEach(item => {
      const entry = document.createElement('div');
      entry.style.marginTop = '4px';
      entry.innerHTML = `<b style="color: var(--pink);">${escapeHtml(item.name)}:</b> <span style="color: var(--text);">${escapeHtml(item.msg)}</span>`;
      container.appendChild(entry);
    });
    container.scrollTop = container.scrollHeight;
  }
}

function signGuestbook() {
  const nameInput = document.getElementById('guestName');
  const msgInput = document.getElementById('guestMsg');
  
  if (nameInput && msgInput) {
    const name = nameInput.value.trim() || 'Anônimo';
    const msg = msgInput.value.trim();
    
    if (!msg) {
      alert('Escreva uma mensagem para assinar!');
      return;
    }
    
    const savedMessages = JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || [];
    savedMessages.push({ name, msg });
    localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(savedMessages));
    
    loadGuestbook();
    
    nameInput.value = '';
    msgInput.value = '';
    playClickSound();
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// --- Inicialização ao Carregar a Página ---
document.addEventListener('DOMContentLoaded', () => {
  loadGuestbook();
  initVisitorCounter();
});
