const myDiv = d3.select("#circlesGrid");

let mainData;
let shoppingBasketData = [];

const circlePos = [
  {
    radius: 30,
    cx: 100,
    cy: 100,
    kategori: "Grøntsager og grøntsagsprodukter",
  },
  { radius: 40, cx: 800, cy: 200, kategori: "Kød og fjerkræ" },
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
      createFoodItemCircles(categoryData.slice(0, 3));
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
}

function createFoodItemCircles(foodItems) {
  foodItems.forEach((foodItem) => {
    const circle = svg
      .append("circle")
      .attr("cx", Math.random() * 400)
      .attr("cy", Math.random() * 200)
      .attr("r", 25)
      .attr("fill", "purple")
      .attr("produkt", foodItem.produkt)
      .classed("foodItemCircle", true);

    circle.append("title").text(foodItem.produkt);
  });

  const foodItemCircles = document.querySelectorAll(".foodItemCircle");
  foodItemCircles.forEach((circle) => {
    circle.addEventListener("click", function () {
      const foodItem = foodItems.find(
        (item) => item.produkt === circle.getAttribute("produkt")
      );

      addToShoppingBasket(foodItem);
    });
  });
}

function addToShoppingBasket(foodItem) {
  shoppingBasketData.push(foodItem);

  let foodListGrid = document.getElementById("foodListGrid");

  const foodItemDiv = document.createElement("div");
  foodItemDiv.innerText = foodItem.produkt;

  foodListGrid.appendChild(foodItemDiv);
}

// Function to empty the shopping basket
function emptyBasket() {
  const shopBasket = document.getElementById("foodListGrid");
  while (shopBasket.firstChild) {
    shopBasket.removeChild(shopBasket.firstChild);
    shoppingBasketData = [];
  }
}

// Attach event listener to the button when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("emptyBaskBtn")
    .addEventListener("click", emptyBasket);
});
