// theme toggle: paper or blueprint
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function isDark() {
  if (root.dataset.theme) return root.dataset.theme === 'dark';
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

function showTheme() {
  toggle.textContent = isDark() ? 'Paper' : 'Blueprint';
  toggle.setAttribute('aria-label', isDark() ? 'Switch to the paper theme' : 'Switch to the blueprint theme');
}

toggle.hidden = false;
showTheme();
toggle.addEventListener('click', () => {
  root.dataset.theme = isDark() ? 'light' : 'dark';
  try {
    localStorage.setItem('theme', root.dataset.theme);
  } catch (e) {}
  showTheme();
});

// the bus line energizes as you scroll and closes each sheet's node
const main = document.querySelector('main');
const live = document.querySelector('.bus-live');
const nodes = document.querySelectorAll('.sheet, .contact');
let queued = false;

function energize() {
  queued = false;
  const box = main.getBoundingClientRect();
  const reach = innerHeight * 0.55 - box.top;
  live.style.transform = `scaleY(${Math.min(Math.max(reach / box.height, 0), 1)})`;
  nodes.forEach((node) => {
    node.classList.toggle('is-live', node.getBoundingClientRect().top < innerHeight * 0.55 - 56);
  });
}

function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(energize);
}

addEventListener('scroll', queue, { passive: true });
addEventListener('resize', queue);
addEventListener('load', queue);
energize();
