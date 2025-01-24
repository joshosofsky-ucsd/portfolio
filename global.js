console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// // Get an array of all <a> elements inside <nav>
// const navLinks = $$("nav a");

// // Log the array to verify
// console.log(navLinks);

// // Find the current page link
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );
  
// // Log the current link to verify
// console.log("Current Page Link:", currentLink);

// // Add the 'current' class to the current page link
// if (currentLink) {
//     currentLink.classList.add('current');
//   }

// Define the pages
const pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/joshosofsky-ucsd', title: 'GitHub Profile' }
  ];
  
  // Check if we are on the home page
  const ARE_WE_HOME = document.documentElement.classList.contains('home');
  
  // Create a <nav> element
  const nav = document.createElement('nav');
  document.body.prepend(nav); // Add <nav> to the top of <body>
  
  // Populate the navigation menu
  for (const page of pages) {
    const link = document.createElement('a'); // Create a new <a> element
  
    // Determine if the URL is external
    const isExternal = page.url.startsWith('http');
  
    // Adjust the URL only for internal links
    const adjustedUrl = isExternal ? page.url : ARE_WE_HOME ? page.url : `../${page.url}`;
    link.href = adjustedUrl; // Set the URL
    link.textContent = page.title; // Set the text content
  
    // Highlight the current page
    link.classList.toggle(
      'current',
      link.host === location.host && link.pathname === location.pathname
    );
  
    // Open external links in a new tab
    if (isExternal) {
      link.target = '_blank'; // Open in a new tab
      link.rel = 'noopener noreferrer'; // Security best practice for external links
    }
  
    nav.append(link); // Append the link to the <nav>
  }

// // Reference the dropdown
// const colorSchemeSwitch = document.getElementById('color-scheme-switch');

// // Function to update the color scheme
// function updateColorScheme(scheme) {
//   const root = document.documentElement;

//   if (scheme === 'light') {
//     root.style.colorScheme = 'light';
//   } else if (scheme === 'dark') {
//     root.style.colorScheme = 'dark';
//   } else {
//     root.style.colorScheme = 'light dark'; // Automatic
//   }
// }

// // Event listener for the dropdown
// colorSchemeSwitch.addEventListener('change', (event) => {
//   const selectedScheme = event.target.value;
//   updateColorScheme(selectedScheme);
// });

// // Optional: Set the initial value to "auto"
// colorSchemeSwitch.value = 'auto';
// updateColorScheme('auto');

document.addEventListener('DOMContentLoaded', () => {
    // Add the theme switcher dropdown
    console.log("DOM is fully loaded");
    document.body.insertAdjacentHTML(
        'afterbegin',
        `
        <label class="color-scheme">
            Theme:
            <select id="colorSchemeSelector">
                <option value="auto">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`
    );

    const selector = document.getElementById('colorSchemeSelector');
    const rootElement = document.documentElement;

    // Load the saved preference or set to "auto"
    const savedScheme = localStorage.getItem('colorScheme') || 'auto';
    selector.value = savedScheme;
    applyColorScheme(savedScheme);

    // Listen for changes
    selector.addEventListener('change', (event) => {
        const selectedScheme = event.target.value;
        localStorage.setItem('colorScheme', selectedScheme);
        applyColorScheme(selectedScheme);
    });

    function applyColorScheme(scheme) {
        if (scheme === 'auto') {
            rootElement.style.colorScheme = ''; // Default to OS preference
        } else {
            rootElement.style.colorScheme = scheme;
        }
    }
});






  
  