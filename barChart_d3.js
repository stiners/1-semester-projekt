const dataset = [
  5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
];

const w = 500;
const h = 100;
const barPadding = 1;

// Create SVG element
let chartSVG = d3
  .select("#barChartGrid")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

chartSVG
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function (d, i) {
    return i * (w / dataset.length);
  })
  .attr("y", function (d) {
    return h - d * 4; // Height minus data value
  })
  .attr("width", w / dataset.length - barPadding)
  .attr("height", function (d) {
    return d * 4; // Just the data value
  })
  .attr("fill", function (d) {
    return "rgb(0, 0, " + Math.round(d * 10) + ")";
  });
