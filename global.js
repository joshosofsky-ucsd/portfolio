console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// ========== IMPROVED NAVIGATION ========== //
const pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/joshosofsky-ucsd', title: 'GitHub Profile' }
];

// Improved home page detection
const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Create semantic header with nav
const header = document.createElement('header');
document.body.prepend(header);

const nav = document.createElement('nav');
header.append(nav);

// Create wrapper for theme switcher
const themeContainer = document.createElement('div');
themeContainer.className = 'theme-switcher';
header.append(themeContainer);

pages.forEach(page => {
  const link = document.createElement('a');
  const isExternal = page.url.startsWith('http');
  
  // Improved path handling
  let adjustedUrl = page.url;
  if (!isExternal) {
    adjustedUrl = ARE_WE_HOME ? page.url : `../${page.url}`;
    // Ensure trailing slash consistency
    if (!page.url.endsWith('/') && page.url !== '') adjustedUrl += '/';
  }

  link.href = adjustedUrl;
  link.textContent = page.title;

  // Improved current page detection
  const currentPath = normalizePath(location.pathname);
  const linkPath = normalizePath(link.pathname);
  
  link.classList.toggle('current', 
    !isExternal && 
    link.host === location.host && 
    currentPath === linkPath
  );

  if (isExternal) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('external');
  }

  nav.append(link);
});

// Helper function for path normalization
function normalizePath(path) {
  return path.replace(/\/+$/, '') || '/';  // Remove trailing slashes
}

// ========== IMPROVED THEME SWITCHER ========== //
// global.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme Switcher Elements
  const themeHTML = `
    <label class="color-scheme">
      Theme:
      <select id="colorSchemeSelector">
        <option value="auto">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>`;
  
  document.body.insertAdjacentHTML('afterbegin', themeHTML);
  const selector = document.getElementById('colorSchemeSelector');
  const root = document.documentElement;

  // Theme Management Functions
  const getSystemTheme = () => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const applyTheme = (scheme) => {
    // Clear existing theme classes
    root.classList.remove('light-theme', 'dark-theme');
    
    if (scheme === 'auto') {
      // Match OS preference
      const systemTheme = getSystemTheme();
      root.style.colorScheme = 'light dark';
      root.classList.add(`${systemTheme}-theme`);
    } else {
      // Apply explicit theme
      root.style.colorScheme = scheme;
      root.classList.add(`${scheme}-theme`);
    }
  };

  // Initialize Theme
  const savedScheme = localStorage.getItem('colorScheme') || 'auto';
  selector.value = savedScheme;
  applyTheme(savedScheme);

  // Theme Change Listener
  selector.addEventListener('change', (e) => {
    const scheme = e.target.value;
    localStorage.setItem('colorScheme', scheme);
    applyTheme(scheme);
  });

  // Watch for OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (selector.value === 'auto') applyTheme('auto');
  });
});