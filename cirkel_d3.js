const myDiv = d3.select("#circlesGrid");

let mainData;
let shoppingBasketData = [];

const rectData = [
  { width: 120, height: 90, category: "Grøntsager og grøntsagsprodukter" },
  { width: 90, height: 70, category: "Kød og fjerkræ" },
  { width: 38, height: 38, category: "Vin. øl og spiritus" },
  { width: 45, height: 45, category: "Brød og bageartikler" },
  { width: 55, height: 55, category: "Korn og kornprodukter" },
  { width: 65, height: 65, category: "Færdigretter" },
  { width: 20, height: 20, category: "Svampe og svampeprodukter" },
  { width: 20, height: 20, category: "Nødder og frø" },
  { width: 25, height: 25, category: "Slik og sukkervarer" },
  { width: 70, height: 70, category: "Frugt og frugtprodukter" },
  { width: 55, height: 55, category: "Planteprodukter og -drikke" },
  { width: 80, height: 80, category: "Fisk og skaldyr" },
  { width: 53, height: 53, category: "Smagsgivere og krydderier" },
  { width: 50, height: 50, category: "Mælk. mejeriprodukter og æg" },
  { width: 30, height: 30, category: "Bælgfrugter og bælgfrugtprodukter" },
  { width: 40, height: 40, category: "Drikkevarer" },
];

// Function to sanitize category names
function sanitizeCategoryName(category) {
  return category.replace(/[^a-zA-Z0-9]/g, "_");
}

// Append an SVG element to the selected div
const svg = myDiv.append("svg").attr("width", 1500).attr("height", 900);

// Position rectangles in a grid with 4 rows
const cols = 4;
const spacing = 50;
const rects = svg
  .selectAll("rect")
  .data(rectData)
  .enter()
  .append("rect")
  .attr("x", (d, i) => (i % cols) * (200 + spacing) + 100)
  .attr("y", (d, i) => Math.floor(i / cols) * (150 + spacing) + 50)
  .attr("width", (d) => d.width)
  .attr("height", (d) => d.height)
  .attr("fill", "#D22B2B")
  .attr("data-category", (d) => d.category)
  .classed("rectClass", true);

svg
  .selectAll(".rectText")
  .data(rectData)
  .enter()
  .append("text")
  .attr("x", (d, i) => (i % cols) * (200 + spacing) + 100 + d.width / 2)
  .attr("y", (d, i) => Math.floor(i / cols) * (150 + spacing) + 50 + d.height / 2)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("font-family", "Arial, sans-serif")
  .attr("font-weight", "bold")
  .attr("fill", "#333")
  .text((d) => d.category);

// Attach click event listener to rectangles
rects.on("click", function (event, d) {
  const sanitizedCategory = sanitizeCategoryName(d.category);
  handleCategoryClick(d.category);
});

// Function to handle category rectangle click
function handleCategoryClick(category) {
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
      showPopup(category, categoryData);
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
}

// Function to show popup
function showPopup(category, foodItems) {
  const sanitizedCategory = sanitizeCategoryName(category);
  const popup = d3.select("body")
    .append("div")
    .attr("class", "popup")
    .style("position", "fixed")
    .style("left", "50%")
    .style("top", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "white")
    .style("padding", "20px")
    .style("border", "1px solid black")
    .style("box-shadow", "0 0 10px rgba(0,0,0,0.5)");

  popup.append("h2").text(category);
  const foodItemContainer = popup.append("div");

  foodItemContainer.selectAll(".foodItem")
    .data(foodItems)
    .enter()
    .append("div")
    .attr("class", "foodItem")
    .style("margin", "5px 0")
    .style("cursor", "pointer")
    .text(d => d.produkt)
    .on("click", function(event, d) {
      addToShoppingBasket(d);
    });

  popup.append("button")
    .text("Close")
    .on("click", function() {
      popup.remove();
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

// Select the "Tøm kurv" button
const emptyBasketBtn = document.getElementById("emptyBaskBtn");

// Attach click event listener to the button
emptyBasketBtn.addEventListener("click", emptyBasket);

// Function to empty the shopping basket
function emptyBasket() {
  const shopBasket = document.getElementById("foodListGrid");
  while (shopBasket.firstChild) {
    shopBasket.removeChild(shopBasket.firstChild);
  }
  shoppingBasketData = [];
}


// Function to remove food item rectangles and text
function removeFoodItemRects(category) {
  const sanitizedCategory = sanitizeCategoryName(category);
  svg.selectAll(`.foodItemGroup-${sanitizedCategory}`)
    .transition()
    .duration(500)
    .attr("opacity", 0)
    .on("end", function () {
      d3.select(this).remove();
    });
}