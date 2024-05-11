const myDiv = d3.select("#circles");

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
  .on("click", handleClick);

// Tilføjer titel til cirkelerne, hvor jeg refererer til min circle position.
circles.append("title").text((d) => d.kategori);

// Kategorien på cirkel er overens med den kategori der bliver trukket fra databasen
function handleClick(d, i) {
  const kategori = d.kategori;

  fetchCategoryData(kategori, (error, categoryData) => {
    if (error) {
      console.error("Error fetching category data:", error);
    } else {
      console.log("Fetched category data:", categoryData);
    }
  });
}

// funktion som fetch d
function fetchCategoryData(kategori, callback) {
  pool.query(
    "SELECT mad.*, mad_kategori.kategori AS kategori_name FROM mad JOIN mad_kategori ON mad.kategori_id = mad_kategori.id WHERE mad_kategori.kategori = $1;",
    [kategori],
    (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        // Process the query results and pass them to the callback function
        callback(null, results.rows);
      }
    }
  );
}
