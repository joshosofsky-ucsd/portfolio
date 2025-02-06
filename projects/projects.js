import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = [];
let arcGenerator = d3.arc().innerRadius(0).outerRadius(200);

async function loadProjects() {
    try {
      projects = await fetchJSON('../lib/projects.json'); // Single source of truth
      const projectsContainer = document.querySelector('.projects');
      renderProjects(projects, projectsContainer, 'h2');
      
      // Set the project count
      const projectsTitle = document.querySelector('.projects-title');
      if (projectsTitle) {
        projectsTitle.textContent = `${projects.length} Projects`;
      }

      // Initial pie chart render AFTER data load
      renderPieChart(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      const projectsContainer = document.querySelector('.projects');
      if (projectsContainer) {
        projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
      }
      renderPieChart([]); // Clear chart on error
    }
}

// Function to render the pie chart (FIXED)
function renderPieChart(projectsGiven) {
  const svg = d3.select('svg');
  svg.selectAll('*').remove();
  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  if (!projectsGiven || projectsGiven.length === 0) return;

  // Data processing
  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  // Chart configuration
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const width = 400, height = 400;

  // SVG setup
  svg.attr("width", width)
     .attr("height", height)
     .attr("viewBox", `0 0 ${width} ${height}`) // Add viewBox
     .append("g")
     .attr("transform", `translate(${width/2}, ${height/2})`)
     .selectAll("path")
     .data(arcData)
     .join("path")
     .attr("d", arcGenerator)
     .attr("fill", (d, i) => colors(i));

  // Legend
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Initialize everything properly
document.addEventListener("DOMContentLoaded", () => {
  loadProjects(); // Load data and initial render

  // Search functionality
  let query = '';
  const searchInput = document.querySelector('.searchBar');
  const projectsContainer = document.querySelector('.projects');

  searchInput?.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase().trim();
    updateProjects();
  });

  function updateProjects() {
    const filteredProjects = query
      ? projects.filter(p => p.title.toLowerCase().includes(query))
      : projects;
    
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
  }
});