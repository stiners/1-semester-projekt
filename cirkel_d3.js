const myDiv = d3.select("#circlesGrid");

let mainData;

const circlePos = [
  {
    radius: 30,
    cx: 100,
    cy: 100,
    kategori: "Grøntsager og grøntsagsprodukter",
  },
  { radius: 40, cx: 1000, cy: 200, kategori: "Kød og fjerkræ" },
  { radius: 50, cx: 400, cy: 300, kategori: "Vin. øl og spiritus" },
  { radius: 60, cx: 100, cy: 400, kategori: "Brød og bageartikler" },
  { radius: 70, cx: 700, cy: 500, kategori: "Korn og kornprodukter" },
];

// Append an SVG element to the selected div
const svg = myDiv.append("svg").attr("width", 1200).attr("height", 700);

// Append a circle to the SVG element
const circles = svg
  .selectAll("circle")
  .data(circlePos)
  .enter()
  .append("circle")
  .attr("cx", (d) => d.cx)
  .attr("cy", (d) => d.cy)
  .attr("r", (d) => d.radius)
  .attr("fill", "yellow")
  .attr("kategori", (d) => d.kategori)
  .classed("circleClass", true);

// Tilføjer titel til cirkelerne, hvor jeg refererer til min circle position.
circles.append("title").text((d) => d.kategori);

const circleDivs = document.querySelectorAll(".circleClass");
circleDivs.forEach((circle) => {
  circle.addEventListener("click", function (event) {
    const kategori = circle.getAttribute("kategori");
    handleClick(kategori);
  });
});

// Kategorien på cirkel er overens med den kategori der bliver trukket fra databasen
function handleClick(kategori) {
  console.log(kategori);
  fetch(`http://localhost:4000/category/${kategori}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((categoryData) => {
      console.log("Fetched category data:", categoryData);
      mainData = categoryData;
      // Process the fetched data as needed
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
}
