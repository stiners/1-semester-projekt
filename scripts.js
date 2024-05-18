let numbers = [];

// Definition af CO2-udslipstærskler
const grøn_tærskel = 1000; // Definér grøn tærskelværdi
const gul_tærskel = 2000; // Definér gul tærskelværdi

// Select the button container
let buttonContainer = document.getElementById("emptyBaskBtnGrid");
// Create a new button element
let newButton = document.createElement("button");
newButton.textContent = "Click me";
// Add a click event listener to the button
newButton.addEventListener("click", function () {
  alert("Button clicked!");
});

// calculate button selector
let calculateButton = document.querySelector("#calculateGrid button");
calculateButton.addEventListener("click", calculateCO2);

// Funktions for calculation af CO2
function calculateTotalCO2() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.co2e_pr_kg || 0),
    0
  );
}

// function for calculation of landbrug
function calculateTotalLandbrug() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.landbrug || 0),
    0
  );
}

// function for calculation of forarbejdning
function calculateTotalForarbejdning() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.forarbejdning || 0),
    0
  );
}

// function for calculation of emballage
function calculateTotalEmballage() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.emballage || 0),
    0
  );
}

// function for calculation of transport
function calculateTotalTransport() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.transport || 0),
    0
  );
}

// fonction for calculation of detail
function calculateTotalDetail() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.detail || 0),
    0
  );
}

// Hovedfunktion til at beregne CO2 og logge resultaterne
function calculateCO2() {
  const totalLandbrug = calculateTotalLandbrug();
  console.log("Total Landbrug:", totalLandbrug);

  const totalForarbejdning = calculateTotalForarbejdning();
  console.log("Total Forarbejdning:", totalForarbejdning);

  const totalEmballage = calculateTotalEmballage();
  console.log("Total Emballage:", totalEmballage);

  const totalTransport = calculateTotalTransport();
  console.log("Total Transport:", totalTransport);

  const totalDetail = calculateTotalDetail();
  console.log("Total Detail:", totalDetail);

  const totalCO2 = calculateTotalCO2();
  console.log("Total CO2:", totalCO2);
}




// Bestem farven baseret på det beregnede CO2-udslip
let color;
let sum;
if (sum < grøn_tærskel) {
  color = "green";
} else if (sum < gul_tærskel) {
  color = "yellow";
} else {
  color = "red";
}
/*
// Opdater farven på den ydre cirkel
const outerCircle = document.getElementById("outerCircle");
outerCircle.style.display = "block"; // Vis cirklen
outerCircle.style.backgroundColor = color; // Indstil farven på den ydre cirkel

// Tjek om den indre cirkel allerede eksisterer, hvis ikke opret den
let innerCircle = document.querySelector(".innerCircle");
if (!innerCircle) {
  innerCircle = document.createElement("div");
  innerCircle.classList.add("innerCircle");
  outerCircle.appendChild(innerCircle);
}

innerCircle.textContent = sum; // Opdater summen i den indre cirkel

// Funktion til at ændre farven på den indre cirkel
function changeouterCircleColor(color) {
  document.querySelector(".outerCircle").style.backgroundColor = color;
}
*/