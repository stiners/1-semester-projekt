const myDiv = d3.select("#circlesGrid");

let mainData;
let shoppingBasketData = [];

const circleData = [
  { radius: 30, cx: 100, cy: 100, category: "Grøntsager og grøntsagsprodukter" },
  { radius: 40, cx: 100, cy: 200, category: "Kød og fjerkræ" },
  { radius: 50, cx: 100, cy: 300, category: "Vin. øl og spiritus" },
  { radius: 60, cx: 100, cy: 400, category: "Brød og bageartikler" },
  { radius: 30, cx: 100, cy: 500, category: "Korn og kornprodukter" },
  { radius: 30, cx: 100, cy: 600, category: "Færdigretter" },
  { radius: 20, cx: 100, cy: 650, category: "Svampe og svampeprodukter" },
  { radius: 20, cx: 500, cy: 100, category: "Nødder og frø" },
  { radius: 20, cx: 500, cy: 200, category: "Slik og sukkervarer" },
  { radius: 20, cx: 500, cy: 300, category: "Frugt og frugtprodukter" },
  { radius: 20, cx: 500, cy: 400, category: "Planteprodukter og -drikke" },
  { radius: 20, cx: 500, cy: 500, category: "Fisk og skaldyr" },
  { radius: 20, cx: 500, cy: 600, category: "Smagsgivere og krydderier" },
  { radius: 20, cx: 500, cy: 650, category: "Mælk. mejeriprodukter og æg" },
  { radius: 20, cx: 800, cy: 100, category: "Bælgfrugter og bælgfrugtprodukter" },
  { radius: 20, cx: 800, cy: 200, category: "Drikkevarer" },
];

// Function to sanitize category names
function sanitizeCategoryName(category) {
  return category.replace(/[^a-zA-Z0-9]/g, "_");
}

// Append an SVG element to the selected div
const svg = myDiv.append("svg").attr("width", 1200).attr("height", 700);

// Append circles to the SVG element
const circles = svg
  .selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle")
  .attr("cx", (d) => d.cx)
  .attr("cy", (d) => d.cy)
  .attr("r", (d) => d.radius)
  .attr("fill", "yellow")
  .attr("data-category", (d) => d.category)
  .attr("data-expanded", false)
  .classed("circleClass", true);

// Add titles to circles
circles.append("title").text((d) => d.category);

// Attach click event listener to circles
circles.on("click", function (event, d) {
  const clickedCircle = d3.select(this);
  const sanitizedCategory = sanitizeCategoryName(d.category);

  if (clickedCircle.attr("data-expanded") === "true") {
    // Transition the circle back to its original size and position
    clickedCircle
      .transition()
      .duration(500)
      .attr("r", clickedCircle.attr("data-original-r"))
      .attr("cx", clickedCircle.attr("data-original-cx"))
      .attr("cy", clickedCircle.attr("data-original-cy"))
      .on("end", function () {
        this.parentNode.appendChild(this);
        removeFoodItemCircles(sanitizedCategory);
      });

    // Reset the expanded attribute
    clickedCircle.attr("data-expanded", "false");
  } else {
    // Transition the circle to a larger size and store its original size and position
    clickedCircle
      .attr("data-original-r", clickedCircle.attr("r"))
      .attr("data-original-cx", clickedCircle.attr("cx"))
      .attr("data-original-cy", clickedCircle.attr("cy"))
      .transition()
      .duration(500)
      .attr("r", 1200)
      .on("end", function () {
        this.parentNode.appendChild(this);
        handleCategoryClick(clickedCircle, d.category);
      });

    // Set the expanded attribute
    clickedCircle.attr("data-expanded", "true");
  }
});

// Attach hover event listeners to circles
circles
  .on("mouseenter", function () {
    d3.select(this).classed("hovered", true);
  })
  .on("mouseleave", function () {
    d3.select(this).classed("hovered", false);
  });

// Function to handle category circle click
function handleCategoryClick(clickedCircle, category) {
  fetch(`http://localhost:4000/category/${category}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((categoryData) => {
      console.log("Fetched category data:", categoryData);
      mainData = categoryData;
      createFoodItemCircles(category, categoryData);
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
}

// Function to create food item circles
function createFoodItemCircles(category, foodItems) {
  const sanitizedCategory = sanitizeCategoryName(category);
  const circlesPerRow = 10;

  const foodItemCircles = svg
    .selectAll(`.foodItemCircle-${sanitizedCategory}`)
    .data(foodItems, (d) => d.produkt)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => 100 + (i % circlesPerRow) * 70)
    .attr("cy", (d, i) => 100 + Math.floor(i / circlesPerRow) * 70)
    .attr("r", 30)
    .attr("fill", "purple")
    .attr("data-product", (d) => d.produkt)
    .attr("data-category", sanitizedCategory)
    .classed(`foodItemCircle-${sanitizedCategory}`, true);

  foodItemCircles.on("click", function (event, d) {
    addToShoppingBasket(d);
  });
}

// Function to add item to the shopping basket
function addToShoppingBasket(foodItem) {
  shoppingBasketData.push(foodItem);

  console.log("Shopping basket data:", shoppingBasketData);

  const foodListGrid = document.getElementById("foodListGrid");

  const foodItemDiv = document.createElement("div");
  foodItemDiv.innerText = foodItem.produkt;

  foodListGrid.appendChild(foodItemDiv);
}

// Function to empty the shopping basket
function emptyBasket() {
  const shopBasket = document.getElementById("foodListGrid");
  while (shopBasket.firstChild) {
    shopBasket.removeChild(shopBasket.firstChild);
  }
  shoppingBasketData = [];
}

// Function to remove food item circles
function removeFoodItemCircles(category) {
  const sanitizedCategory = sanitizeCategoryName(category);
  svg.selectAll(`.foodItemCircle-${sanitizedCategory}`)
    .transition()
    .duration(500)
    .attr("r", 0)
    .on("end", function () {
      d3.select(this).remove();
    });
}

// Attach event listener to the empty basket button when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("emptyBaskBtn").addEventListener("click", emptyBasket);
});
