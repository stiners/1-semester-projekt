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
// Append the button to the button container
//buttonContainer.appendChild(newButton); der er noget der driller

//til at hente data om co2 fra indkøbskurven

let calculateButton = document.querySelector("#calculateGrid button");
calculateButton.addEventListener("click", calculateCO2);

// Funktion til at beregne CO2 og oprette cirklen
function calculateTotalCO2() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.co2e_pr_kg || 0),
    0
  );
}

function calculateCO2() {
  const totalLandbrugAndTransport = calculateSumOfLandbrugAndTransport();
  console.log("Total Landbrug and Transport:", totalLandbrugAndTransport);

  const totalCO2 = calculateTotalCO2();
  console.log("Total CO2:", totalCO2);
}

function calculateSumOfLandbrugAndTransport() {
  return shoppingBasketData.reduce(
    (total, item) => total + Number(item.landbrug || 0) + (item.transport || 0),
    0
  );
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
