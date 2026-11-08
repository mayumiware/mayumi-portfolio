(function(){
  // Navegação por Hash / Abas
  var btns = document.querySelectorAll('[data-go]');
  var secs = document.querySelectorAll('main section');

  function show(id){
    if(!document.getElementById(id)) id = 'sobre';
    secs.forEach(function(s){ s.classList.toggle('on', s.id === id); });
    btns.forEach(function(b){ b.setAttribute('aria-current', b.dataset.go === id); });
  }

  btns.forEach(function(b){
    b.addEventListener('click', function(){ location.hash = b.dataset.go; });
  });

  window.addEventListener('hashchange', function(){ show(location.hash.slice(1)); });
  show(location.hash.slice(1));

  // Relógio em tempo real
  var clock = document.getElementById('clock');
  setInterval(function(){
    clock.textContent = new Date().toLocaleTimeString('pt-BR');
  }, 1000);

  // Contador de Visitantes Real via API com Fallback
  (function fetchRealVisits() {
    const countEl = document.getElementById('count');
    const namespace = "mayumiware";
    const key = "portfolio-visits";

    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
      .then(response => response.json())
      .then(data => {
        if (countEl && data.value) {
          countEl.textContent = String(data.value).padStart(6, '0');
        }
      })
      .catch(error => {
        // Fallback local caso a API esteja indisponível
        var visits = 1;
        try {
          visits = parseInt(localStorage.getItem('site_visits') || '0', 10) + 1;
          localStorage.setItem('site_visits', visits);
        } catch(e) {
          visits = 1;
        }
        if (countEl) countEl.textContent = String(visits).padStart(6, '0');
      });
  })();

  // Alternador do Efeito VHS
  var vhs = document.getElementById('vhs');
  vhs.addEventListener('click', function(){
    playClickSound();
    var on = document.body.classList.toggle('vhs');
    vhs.textContent = 'Efeito VHS: ' + (on ? 'ligado' : 'desligado');
  });
})();

/* Sintetizador de Efeitos Sonoros com Web Audio API */
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClickSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch (e) {}
}

function playHoverSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
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
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180 + Math.random() * 500, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      }, i * 35);
    }
  } catch (e) {}
}

/* Modal de Visualização de Imagens */
function openModal(imageSrc, captionText) {
  playClickSound();
  const modal = document.getElementById("retroModal");
  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");
  const container = document.querySelector('.modal-img-container');

  if (modal && modalImg && caption) {
    modalImg.src = imageSrc;
    caption.textContent = captionText;
    if (container) container.classList.remove('zoomed');
    modal.style.display = "flex";
  }
}

function closeModal() {
  const modal = document.getElementById("retroModal");
  if (modal && modal.style.display === "flex") {
    playClickSound();
    modal.style.display = "none";
    const container = document.querySelector('.modal-img-container');
    if (container) container.classList.remove('zoomed');
  }
}

function closeModalOnOuterClick(event) {
  if (event.target.id === "retroModal") closeModal();
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});

function toggleZoom() {
  playClickSound();
  const container = document.querySelector('.modal-img-container');
  if (container) {
    container.classList.toggle('zoomed');
  }
}
