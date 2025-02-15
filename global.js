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
  { url: 'meta/', title: 'Meta' },
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

  fetchJSON('./lib/projects.json').then(data => {
    const containerElement = document.querySelector('.projects');
    renderProjects(data, containerElement, 'h2'); // Specify the heading level here
  }).catch(error => {
    console.error('Error fetching projects:', error);
  });;
});

export async function fetchJSON(url) {
  // const baseURL = window.location.origin; // Gets root URL
  // const response = await fetch(`${baseURL}${path}`);
  try {
      const response = await fetch(url);

      console.log(response)
      
      // Check if response is successful (status 200-299)
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      
      // Parse and return the JSON data
      const data = await response.json();
      console.log(data)
      return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
      // Re-throw the error to allow handling by calling code
      throw error;
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Your code will go here
  // Check if containerElement is valid
  if (!containerElement) {
    console.error('Error: containerElement is null or undefined.');
    return;
  }

  // Check if projects is a valid array
  if (!Array.isArray(projects)) {
    console.error('Error: projects is not a valid array.');
    return;
  }

  // Validate headingLevel
  const validHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadingLevels.includes(headingLevel)) {
    console.warn(`Warning: Invalid heading level "${headingLevel}". Defaulting to "h2".`);
    headingLevel = 'h2';
  }

  containerElement.innerHTML = '';
  // Check if projects array is empty
  if (projects.length === 0) {
    containerElement.innerHTML = '<p>No projects available.</p>';
    return;
  }
  projects.forEach(project => {
    const article = document.createElement('article');
    // Create the heading element with the specified level
    const heading = document.createElement(headingLevel);
    if (project.link) {
      heading.innerHTML = `<a href="${project.link}" target="_blank">${project.title || 'Untitled Project'}</a>`;
    } else {
      heading.textContent = project.title || 'Untitled Project';
    }
    article.appendChild(heading);
    let img_source = project.image;
    let link_source = project.link;
    if (!ARE_WE_HOME && !img_source.startsWith('http')) {
      img_source = '.' + img_source;
    }
    // if (!ARE_WE_HOME && !link_source.startsWith('http')) {
    //   link_source = '.' + link_source;
    if (link_source) {
      heading.innerHTML = `<a href="${link_source}" target="_blank">${project.title || 'Untitled Project'}</a>`;
    } else {
      heading.textContent = project.title || 'Untitled Project';
    }
    article.innerHTML += `
      ${img_source ? `<img src="${img_source}" alt="${project.title || 'Project Image'}">` : '<div>No image available</div>'}
      <p class="project-description">${project.description || 'No description available'}</p>
      <p class="project-year"><strong>Year:</strong> ${project.year || 'N/A'}</p>
    `;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}