// Background Music Setup
let backgroundMusic = null;
let isMusicPlaying = false;

function initBackgroundMusic() {
  // Create audio element
  backgroundMusic = new Audio();
  backgroundMusic.src = 'audio/audio1.mp3';
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3; // 30% volume
  backgroundMusic.preload = 'auto';
  backgroundMusic.autoplay = "on"
  backgroundMusic.autoplay();
  
  // Try to start music automatically
  const startMusic = async () => {
    try {
      backgroundMusic.volume = 0.5;
      backgroundMusic.currentTime = 48;
      backgroundMusic.muted = false;
      await backgroundMusic.play();
      isMusicPlaying = true;
    } catch (error) {
      isMusicPlaying = false;
    }
  };
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isMusicPlaying) {
      backgroundMusic.pause();
    } else if (!document.hidden && isMusicPlaying) {
      backgroundMusic.play().catch(() => {});
    }
  });
  
  // Multiple attempts to start music automatically
  const attemptAutoStart = () => {
    if (!isMusicPlaying) {
      startMusic();
    }
  };
  
  // Try to start immediately
  attemptAutoStart();
  
  // Try when audio is ready
  backgroundMusic.addEventListener('canplaythrough', attemptAutoStart);
  backgroundMusic.addEventListener('loadeddata', attemptAutoStart);
  
  // Multiple retry attempts after page load
  setTimeout(attemptAutoStart, 100);
  setTimeout(attemptAutoStart, 500);
  setTimeout(attemptAutoStart, 1000);
  setTimeout(attemptAutoStart, 2000);
  
  // Try to start on any user interaction (as fallback)
  const tryStartOnInteraction = () => {
    if (!isMusicPlaying) {
      attemptAutoStart();
    }
  };
  
  // Listen for any user interaction to start music
  document.addEventListener('click', tryStartOnInteraction, { once: true });
  document.addEventListener('touchstart', tryStartOnInteraction, { once: true });
  document.addEventListener('keydown', tryStartOnInteraction, { once: true });
  document.addEventListener('mousemove', tryStartOnInteraction, { once: true });
  document.addEventListener('scroll', tryStartOnInteraction, { once: true });
  
  // Additional events to trigger music
  window.addEventListener('load', attemptAutoStart);
  window.addEventListener('focus', attemptAutoStart);
  document.addEventListener('focus', attemptAutoStart);
}

// Initialize music after page loads
window.addEventListener('load', initBackgroundMusic);
document.addEventListener('DOMContentLoaded', initBackgroundMusic);

// Also try to initialize immediately for faster loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundMusic);
} else {
  initBackgroundMusic();
}

// Smooth scroll from chevron
document.getElementById('scrollDown')?.addEventListener('click', () => {
  document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
});

// Share / Print
const shareBtn = document.getElementById('shareBtn');
const printBtn = document.getElementById('printBtn');

shareBtn?.addEventListener('click', async () => {
  const data = {
    title: 'Մկրտության հրավիրատոմս',
    text: 'Սիրով հրավիրում ենք մասնակցելու մեր երեխաների մկրտությանը',
    url: window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
    } else {
      await navigator.clipboard.writeText(data.url);
      shareBtn.textContent = 'Հղումը պատճենվեց';
      setTimeout(() => (shareBtn.textContent = 'Կիսվել հրավիրումով'), 1600);
    }
  } catch (e) {
    try {
      await navigator.clipboard.writeText(data.url);
      shareBtn.textContent = 'Հղումը պատճենվեց';
      setTimeout(() => (shareBtn.textContent = 'Կիսվել հրավիրումով'), 1600);
    } catch (_) {
      alert('Կրկնօրինակեք այս հղումը՝ ' + data.url);
    }
  }
});

printBtn?.addEventListener('click', () => window.print());

// RSVP validation (client only)
const form = document.getElementById('rsvpForm');
const statusEl = document.getElementById('formStatus');

function setError(id, msg) {
  const el = document.querySelector(`.error[data-for="${id}"]`);
  if (el) el.textContent = msg || '';
}

function isValidPhone(v) {
  return /^[+()\-\s\d]{7,20}$/.test((v || '').trim());
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const attend = document.getElementById('attend');

  let ok = true;
  if (!name.value.trim()) { setError('name', 'Մուտքագրեք Ձեր անունը'); ok = false; } else setError('name');
  if (!isValidPhone(phone.value)) { setError('phone', 'Մուտքագրեք ճիշտ հեռախոսահամար'); ok = false; } else setError('phone');
  if (!attend.value) { setError('attend', 'Ընտրեք տարբերակը'); ok = false; } else setError('attend');

  if (!ok) return;

  const payload = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    attend: attend.value,
    submittedAt: new Date().toISOString(),
  };
  console.log('RSVP', payload);
  statusEl.textContent = 'Շնորհակալություն, Ձեր RSVP-ն ընդունված է!';
  form.reset();
});

// Countdown logic
(function initCountdown(){
  const target = new Date('2025-11-19T15:00:00'); // Event local time
  const $d = document.getElementById('cd-days');
  const $h = document.getElementById('cd-hours');
  const $m = document.getElementById('cd-mins');
  const $s = document.getElementById('cd-secs');
  const $note = document.getElementById('cd-note');
  if(!$d||!$h||!$m||!$s) return;

  function tick(){
    const now = new Date();
    let diff = target.getTime() - now.getTime();
    if(diff <= 0){
      $d.textContent = '0'; $h.textContent = '0'; $m.textContent = '0'; $s.textContent = '0';
      if($note) $note.textContent = 'Միջոցառումը սկսվել է. սպասում ենք ձեզ 🕊️';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    diff -= minutes * (1000*60);
    const seconds = Math.floor(diff / 1000);
    $d.textContent = String(days);
    $h.textContent = String(hours).padStart(2,'0');
    $m.textContent = String(minutes).padStart(2,'0');
    $s.textContent = String(seconds).padStart(2,'0');
    if($note) $note.textContent = 'Հանդիպմանը մնացել է';
  }
  tick();
  setInterval(tick, 1000);
})();

// Open Yandex Navigator from map buttons
document.querySelectorAll('.map-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const address = btn.getAttribute('data-address');
    if (!address) return;
    // Try Yandex Maps deep link first
    const encoded = encodeURIComponent(address);
    const yaUrl = `yandexmaps://maps.yandex.ru/?text=${encoded}`;
    const webUrl = `https://yandex.com/maps/?text=${encoded}`;
    // Attempt to open the app; fall back to web after short delay
    const open = () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = yaUrl;
      document.body.appendChild(iframe);
      setTimeout(() => {
        window.open(webUrl, '_blank');
        document.body.removeChild(iframe);
      }, 800);
    };
    open();
  });
});


