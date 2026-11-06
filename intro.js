import { itemAppearance } from './item-policy.js';
const $ = id => document.getElementById(id);
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceEffects = motion.matches;
try { reduceEffects ||= localStorage.getItem('mu_intro_reduced_effects') === 'true'; } catch {}
function updateEffects() {
  document.documentElement.classList.toggle('reduced-effects', reduceEffects);
  $('effects-toggle').setAttribute('aria-pressed', String(reduceEffects));
  $('effects-toggle').textContent = reduceEffects ? 'EFEITOS REDUZIDOS' : 'REDUZIR EFEITOS';
}
$('effects-toggle').addEventListener('click', () => { reduceEffects = !reduceEffects; updateEffects(); try { localStorage.setItem('mu_intro_reduced_effects', String(reduceEffects)); } catch {} });
motion.addEventListener('change', event => { if (event.matches) { reduceEffects = true; updateEffects(); } });
updateEffects();
const embers = document.querySelector('.embers');
for (let i = 0; i < 18; i++) {
  const spark = document.createElement('i'); spark.className = 'ember';
  spark.style.setProperty('--x', `${10 + (i * 37 % 85)}%`);
  spark.style.setProperty('--duration', `${8 + i % 9}s`);
  spark.style.setProperty('--delay', `-${i * 1.7}s`);
  embers.appendChild(spark);
}
function updateItem() {
  const level = Number($('level-range').value);
  const transparent = itemAppearance(level) === 'transparent';
  $('forge-level').textContent = '+' + level;
  $('level-output').value = '+' + level;
  $('forge-sword').classList.toggle('transparent', transparent);
  $('forge-appearance').textContent = transparent ? 'Aparência transparente · +12 a +15' : 'Aparência normal · +0 a +11';
}
$('level-range').addEventListener('input', updateItem); updateItem();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      document.querySelectorAll('.chapter-nav a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
      document.querySelectorAll('.intro-header nav a[href^="#"]').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id));
    }
  }, { rootMargin: '-20% 0px -40% 0px', threshold: 0 });
  document.querySelectorAll('.chapter').forEach(section => observer.observe(section));
}
$('copyright-year').textContent = new Date().getFullYear();
