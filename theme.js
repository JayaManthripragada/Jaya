/* Restore a saved theme before the first paint. */
(() => {
  const key = 'jaya-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const validTheme = value => value === 'light' || value === 'dark';
  let preference = null;
  try {
    const saved = window.localStorage.getItem(key);
    if (validTheme(saved)) preference = saved;
  } catch (_) { /* Theme switching also works without storage. */ }
  function applyTheme() {
    const theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    document.querySelectorAll('[data-set-theme]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.setTheme === theme));
    });
  }
  root.classList.remove('no-js');
  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelectorAll('[data-set-theme]').forEach(button => {
      button.addEventListener('click', () => {
        preference = button.dataset.setTheme;
        try { window.localStorage.setItem(key, preference); } catch (_) { /* Optional persistence. */ }
        applyTheme();
      });
    });
  });
  system.addEventListener('change', () => { if (!preference) applyTheme(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = validTheme(event.newValue) ? event.newValue : null;
      applyTheme();
    }
  });
})();
