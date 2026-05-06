const revealItems = document.querySelectorAll('.reveal');
const themeToggle = document.getElementById('themeToggle');

const THEME_KEY = 'orlay-theme';

function setTheme(mode) {
  const isLight = mode === 'light';
  document.body.classList.toggle('light-theme', isLight);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Attiva tema scuro' : 'Attiva tema chiaro');
  }
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

setTheme(getInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    const nextTheme = isLight ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealVariants = ['reveal-up', 'reveal-left', 'reveal-right', 'reveal-zoom'];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
  }
);

revealItems.forEach((item, index) => {
  const variant = revealVariants[index % revealVariants.length];
  item.classList.add(variant);
  item.style.transitionDelay = `${Math.min(index * 50, 340)}ms`;
  revealObserver.observe(item);
});

const sections = document.querySelectorAll('main .section');
const parallaxTargets = document.querySelectorAll('.hero-visual, .screen-card, .console-shell');

if (!prefersReducedMotion) {
  parallaxTargets.forEach((el) => el.classList.add('parallax'));

  let rafPending = false;
  const updateOnScroll = () => {
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      const normalized = Math.max(0, 1 - distance / (viewportHeight * 0.85));
      section.style.setProperty('--section-progress', normalized.toFixed(3));
    });

    parallaxTargets.forEach((target, index) => {
      const rect = target.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }

      const elementCenter = rect.top + rect.height / 2;
      const delta = (elementCenter - viewportCenter) / viewportHeight;
      const intensity = index === 0 ? 12 : 8;
      target.style.setProperty('--parallax-y', `${(-delta * intensity).toFixed(2)}px`);
    });

    rafPending = false;
  };

  const onScrollOrResize = () => {
    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  updateOnScroll();
}

const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (form && formStatus) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formStatus.textContent = 'Compila i campi obbligatori per continuare.';
      return;
    }

    formStatus.textContent = 'Richiesta ricevuta. Ti contattiamo a breve per la demo.';
    form.reset();
  });
}
