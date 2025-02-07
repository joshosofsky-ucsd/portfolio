import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = [];
let arcGenerator = d3.arc().innerRadius(0).outerRadius(150);

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

function renderPieChart(projectsGiven) {
  const svg = d3.select('svg');
  svg.selectAll('*').remove();
  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  if (!projectsGiven || projectsGiven.length === 0) return;

  // Process data
  let data = recalculate(projectsGiven);

  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const width = 300, height = 300;
  let selectedIndex = -1; // Track selected wedge

  const g = svg.attr("width", width)
     .attr("height", height)
     .attr("viewBox", `0 0 ${width} ${height}`)
     .append("g")
     .attr("transform", `translate(${width/2}, ${height/2})`);

  const paths = g.selectAll("path")
    .data(arcData)
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", (d, i) => colors(i))
    .attr("class", "wedge")
    .on("click", function(event, d) {
      const index = arcData.indexOf(d);

      if (selectedIndex === index) {
        // Deselect: Restore full dataset
        selectedIndex = -1;
        d3.select(this).attr("fill", colors(index)); // Reset color
        legend.selectAll("li").classed("selected", false);

        // Restore full dataset
        renderProjects(projects, document.querySelector('.projects'), 'h2');
        renderPieChart(projects); // This correctly restores the full pie chart
      } else {
        // Deselect previous selection
        if (selectedIndex !== -1) {
          g.selectAll("path").filter((_, i) => i === selectedIndex)
            .attr("fill", colors(selectedIndex));
          legend.selectAll("li").filter((_, i) => i === selectedIndex)
            .classed("selected", false);
        }

        // Select new wedge
        selectedIndex = index;
        d3.select(this).attr("fill", "purple"); // Change color of selected wedge
        legend.selectAll("li").filter((_, i) => i === index)
          .classed("selected", true);

        // Get the selected year
        let selectedYear = data[selectedIndex].label;

        // Filter projects by the selected year
        let filteredProjects = projects.filter(project => project.year === selectedYear);

        // Render only filtered projects in the list
        renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');

        // ❌ Do NOT re-render the pie chart with filtered projects.
        // ❌ That’s what caused the one big wedge problem.
      }
    });

  // Render legend
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .classed("legend-item", true)
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
let selectedIndex = -1;
for (let i = 0; i < arcs.length; i++) {
  const svgNS = "http://www.w3.org/2000/svg"; // to create <path> tag in memory
  let path = document.createElementNS(svgNS, "path");
  
  path.setAttribute("d", arcs[i]);
  path.setAttribute("fill", colors(i));
  path.classList.add("wedge");

  path.addEventListener('click', (event) => {
    if (selectedIndex === i) {
      // Deselect if already selected
      selectedIndex = -1;
      path.setAttribute("fill", colors(i)); // Reset to original color
      legendNew.children[i].classList.remove("selected");
    } else {
      // Deselect previous selection if any
      if (selectedIndex !== -1) {
        let prevPath = svg.children[selectedIndex];
        prevPath.setAttribute("fill", colors(selectedIndex));
        legendNew.children[selectedIndex].classList.remove("selected");
      }

      // Select the new wedge
      selectedIndex = i;
      path.setAttribute("fill", "black"); // Highlight color for selected wedge
      legendNew.children[i].classList.add("selected");
    }
  });

  let li = document.createElement('li');
  li.style.setProperty('--color', colors(i));
  li.classList.add("legend-item");

  // Create the swatch span
  let swatch = document.createElement('span');
  swatch.className = 'swatch';
  swatch.style.backgroundColor = colors(i);
  
  // Append the swatch to the list item
  li.appendChild(swatch);

  // Set the label and value
  li.innerHTML += `${data[i].label} <em>(${data[i].value})</em>`;

  legendNew.appendChild(li);
  svg.appendChild(path);
}

function recalculate(projectsGiven) {
  let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year
  );
  let newData = newRolledData.map(([year, count]) => ({
      value: count,
      label: year
  }));
  return newData;
}
