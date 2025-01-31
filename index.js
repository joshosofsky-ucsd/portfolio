import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('../lib/projects.json');
console.log('Projects fetched:', projects);
const latestProjects = projects.slice(0, 3);
console.log('Latest projects:', latestProjects);
const projectsContainer = document.querySelector('.featured-projects');
console.log('Projects container:', projectsContainer);
renderProjects(latestProjects, projectsContainer, 'h2');
const githubData = await fetchGitHubData('joshosofsky-ucsd');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
    profileStats.innerHTML = `
        <h2 class="github-stats-header">My GitHub Stats</h2>
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
      `;
  }

// async function loadLatestProjects() {
//   try {
//     const projects = await fetchJSON('../lib/projects.json');
//     console.log('Projects fetched:', projects);
//     const latestProjects = projects.slice(0, 3);
//     console.log('Latest projects:', latestProjects);
//     const projectsContainer = document.querySelector('.projects');
//     console.log('Projects container:', projectsContainer);
//     renderProjects(latestProjects, projectsContainer, 'h2');
//   } catch (error) {
//     console.error('Error loading latest projects:', error);
//     const projectsContainer = document.querySelector('.projects');
//     if (projectsContainer) {
//       projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
//     }
//   }
// }

// loadLatestProjects();