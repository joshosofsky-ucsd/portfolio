import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
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
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
// let arc = arcGenerator({
//   startAngle: 0,
//   endAngle: 2 * Math.PI,
// });
// d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');
let data = [1, 2, 3, 4, 5, 5];
let sliceGenerator = d3.pie();
let total = 0;
for (let d of data) {
  total += d;
}
let angle = 0;
let arcData = sliceGenerator(data);
// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }
let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
  d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx)); // Fill in the attribute for fill color via indexing the colors variable
})