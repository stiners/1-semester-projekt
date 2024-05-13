const myDiv = d3.select("#circlesGrid");

let mainData;
let shoppingBasketData = [];

const circlePos = [
 
  { radius: 30, cx: 100, cy: 100, kategori: "Grøntsager og grøntsagsprodukter" },
  { radius: 40, cx: 100, cy: 200, kategori: "Kød og fjerkræ" },
  { radius: 50, cx: 100, cy: 300, kategori: "Vin. øl og spiritus" },
  { radius: 60, cx: 100, cy: 400, kategori: "Brød og bageartikler" },
  { radius: 30, cx: 100, cy: 500, kategori: "Korn og kornprodukter" },
  { radius: 30, cx: 100, cy: 600, kategori: "Færdigretter" },
  { radius: 20, cx: 100, cy: 650, kategori: "Svampe og svampeprodukter" },
  { radius: 20, cx: 500, cy: 100, kategori: "Nødder og frø" },
  { radius: 20, cx: 500, cy: 200, kategori: "Slik og sukkervarer" },
  { radius: 20, cx: 500, cy: 300, kategori: "Frugt og frugtprodukter" },
  { radius: 20, cx: 500, cy: 400, kategori: "Planteprodukter og -drikke" },
  { radius: 20, cx: 500, cy: 500, kategori: "Fisk og skaldyr" },
  { radius: 20, cx: 500, cy: 600, kategori: "Smagsgivere og krydderier" },
  { radius: 20, cx: 500, cy: 650, kategori: "Mælk. mejeriprodukter og æg" },
  { radius: 20, cx: 800, cy: 100, kategori: "Bælgfrugter og bælgfrugtprodukter" },
  { radius: 20, cx: 800, cy: 200, kategori: "Drikkevarer" },
  
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
  .attr("expanded", false)
  .classed("circleClass", true);

// Tilføjer titel til cirkelerne, hvor jeg refererer til min circle position.
circles.append("title").text((d) => d.kategori);

const circleDivs = document.querySelectorAll(".circleClass");
circleDivs.forEach((circle) => {
  circle.addEventListener("click", function (event) {
    const kategori = circle.getAttribute("kategori");
    const clickedCircle = event.target;
    handleClick(clickedCircle, kategori);
  });
});

// Kategorien på cirkel er overens med den kategori der bliver trukket fra databasen
function handleClick(clickedCircle, kategori) {
  if (clickedCircle.getAttribute("expanded") === "false") {
    clickedCircle.setAttribute("expanded", true);

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
        createFoodItemCircles(kategori, categoryData.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  } else {
    removeFoodItemCircles(kategori);
    clickedCircle.setAttribute("expanded", false);
  }
}

function createFoodItemCircles(kategori, foodItems) {
  foodItems.forEach((foodItem) => {
    const circle = svg
      .append("circle")
      .attr("cx", Math.random() * 400)
      .attr("cy", Math.random() * 200)
      .attr("r", 25)
      .attr("fill", "purple")
      .attr("produkt", foodItem.produkt)
      .attr("kategori", kategori)
      .classed("foodItemCircle", true);

    circle.append("title").text(foodItem.produkt);
    // Add a text tag to the circle.
    svg
      .append("text")
      .attr("x", circle.attr("cx"))
      .attr("y", circle.attr("cy"))
      .text(foodItem.produkt)
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "black");
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
  // Create a new object with only the properties you need
  const foodItemProperties = {
    produkt: foodItem.produkt,
    co2e_pr_kg: foodItem.co2e_pr_kg,
    landbrug: foodItem.landbrug,
    forarbejdning: foodItem.forarbejdning,
    emballage: foodItem.emballage,
    transport: foodItem.transport,
    detail: foodItem.detail,
  };

  // Push the new object to the array
  shoppingBasketData.push(foodItemProperties);
}

function addToShoppingBasket(foodItem) {
  shoppingBasketData.push(foodItem);

  console.log("Shopping basket data:", shoppingBasketData);

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

function removeFoodItemCircles(kategori) {
  const foodItemCircles = document.querySelectorAll(".foodItemCircle");
  foodItemCircles.forEach((circle) => {
    if (circle.getAttribute("kategori") === kategori) {
      circle.remove();
    }
  });
}

// Attach event listener to the button when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("emptyBaskBtn")
    .addEventListener("click", emptyBasket);
});
