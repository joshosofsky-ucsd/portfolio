import { fetchJSON, renderProjects } from '../global.js';
async function loadProjects() {
    try {
      const projects = await fetchJSON('../lib/projects.json');
      const projectsContainer = document.querySelector('.projects');
      renderProjects(projects, projectsContainer, 'h2');
      // Set the project count
      const projectsTitle = document.querySelector('.projects-title');
      if (projectsTitle) {
        projectsTitle.textContent = `${projects.length} Projects`;
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      const projectsContainer = document.querySelector('.projects');
      if (projectsContainer) {
        projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
      }
    }
  }
  
  loadProjects();