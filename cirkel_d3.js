const myDiv = d3.select("#circlesGrid");

let mainData;
let shoppingBasketData = [];

const circleData = [
  { radius: 120, cx: 720, cy: 450, category: "Grøntsager og grøntsagsprodukter" },
  { radius: 90, cx: 450, cy: 250, category: "Kød og fjerkræ" },
  { radius: 38, cx: 1280, cy: 750, category: "Vin. øl og spiritus" },
  { radius: 45, cx: 1250, cy: 180, category: "Brød og bageartikler" },
  { radius: 55, cx: 750, cy: 100, category: "Korn og kornprodukter" },
  { radius: 65, cx: 400, cy: 600, category: "Færdigretter" },
  { radius: 20, cx: 120, cy: 600, category: "Svampe og svampeprodukter" },
  { radius: 20, cx: 1000, cy: 100, category: "Nødder og frø" },
  { radius: 25, cx: 250, cy: 100, category: "Slik og sukkervarer" },
  { radius: 70, cx: 1000, cy: 300, category: "Frugt og frugtprodukter" },
  { radius: 55, cx: 650, cy: 750, category: "Planteprodukter og -drikke" },
  { radius: 80, cx: 1000, cy: 650, category: "Fisk og skaldyr" },
  { radius: 53, cx: 1250, cy: 450, category: "Smagsgivere og krydderier" },
  { radius: 50, cx: 250, cy: 440, category: "Mælk. mejeriprodukter og æg" },
  { radius: 30, cx: 150, cy: 250, category: "Bælgfrugter og bælgfrugtprodukter" },
  { radius: 40, cx: 200, cy: 750, category: "Drikkevarer" },
];

// Function to sanitize category names
function sanitizeCategoryName(category) {
  return category.replace(/[^a-zA-Z0-9]/g, "_");
}

// Append an SVG element to the selected div
const svg = myDiv.append("svg").attr("width", 1500).attr("height", 900);

// Append circles to the SVG element for categories
const circles = svg
  .selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle")
  .attr("cx", (d) => d.cx)
  .attr("cy", (d) => d.cy)
  .attr("r", (d) => d.radius)
  .attr("fill", "#D22B2B")
  .attr("data-category", (d) => d.category)
  .attr("data-expanded", false)
  .classed("circleClass", true);

  svg
  .selectAll(".circleText")
  .data(circleData)
  .enter()
  .append("text")
  .attr("x", (d) => d.cx)
  .attr("y", (d) => d.cy - d.radius - 10) // Adjust positioning above the circle
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("font-family", "Arial, sans-serif") // Set font family
  .attr("font-weight", "bold") // Set font weight
  .attr("fill", "#333") // Set text color
  .text((d) => d.category);
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
        removeFoodItemRects(sanitizedCategory);
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
      .attr("r", 1600)
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
      createFoodItemRects(category, categoryData);
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
}

// Function to create food item rectangles
function createFoodItemRects(category, foodItems) {
  const sanitizedCategory = sanitizeCategoryName(category);
  const rectsPerRow = 6;
  let currentX = 100;
  let currentY = 10;
  const rowHeight = 70;
  
  // Find the clicked circle
  const clickedCircle = d3.select(`circle[data-category="${category}"]`);
  const circleRadius = +clickedCircle.attr("r");
  const circleX = +clickedCircle.attr("cx");
  const circleY = +clickedCircle.attr("cy");
  
  // Calculate bounds for positioning the rectangles
  const minX = circleX - circleRadius + 10; // +10 for padding
  const maxX = circleX + circleRadius - 10; // -10 for padding
  const minY = circleY - circleRadius + 10; // +10 for padding
  const maxY = circleY + circleRadius - 10; // -10 for padding
  
  const foodItemRects = svg
    .selectAll(`.foodItemRect-${sanitizedCategory}`)
    .data(foodItems, (d) => d.produkt)
    .enter()
    .append("g")
    .classed(`foodItemGroup-${sanitizedCategory}`, true)
    .each(function (d, i) {
      const group = d3.select(this);
      const textLength = d.produkt.length * 7;
      const rectWidth = Math.max(60, textLength);
      
      if (i % rectsPerRow === 0 && i !== 0) {
        currentX = 100;
        currentY += rowHeight;
      }
      
      // Calculate position within bounds
      const rectX = Math.min(Math.max(currentX, minX), maxX - rectWidth);
      const rectY = Math.min(Math.max(currentY, minY), maxY - 60); // 60 is the rect height
      
      group
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", 60)
        .attr("fill", "purple")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("opacity", 0.8)
        .attr("data-product", d.produkt)
        .attr("data-category", sanitizedCategory)
        .classed(`foodItemRect-${sanitizedCategory}`, true);

      group
        .append("text")
        .attr("x", rectX + 10)
        .attr("y", rectY + 35)
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(d.produkt)
        .classed(`foodItemText-${sanitizedCategory}`, true);

      currentX = rectX + rectWidth + 10; // Adjust spacing between rectangles
    });

  // Add click event listeners to the groups
  foodItemRects.on("click", function (event, d) {
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
