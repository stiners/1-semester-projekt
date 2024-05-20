let numbers = [];
let percentages = [];

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

// Calculate button selector
let calculateButton = document.querySelector("#calculateGrid button");
calculateButton.addEventListener("click", calculateCO2);

// Functions for calculation of CO2
function calculateTotalCO2() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.co2e_pr_kg || 0), 0);
}

// Function for calculation of landbrug
function calculateTotalLandbrug() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.landbrug || 0), 0);
}

// Function for calculation of forarbejdning
function calculateTotalForarbejdning() {
  return shoppingBasketData.reduce((total, item) => total + Math.abs(Number(item.forarbejdning || 0)), 0);
}

// Function for calculation of emballage
function calculateTotalEmballage() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.emballage || 0), 0);
}

// Function for calculation of transport
function calculateTotalTransport() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.transport || 0), 0);
}

// Function for calculation of detail
function calculateTotalDetail() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.detail || 0), 0);
}

// Function for calculation of ILUC
function calculateTotalILUC() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.ILUC || 0), 0);
}

// Main function to calculate CO2 and log the results
function calculateCO2() {
  const totalLandbrug = calculateTotalLandbrug();
  const totalForarbejdning = calculateTotalForarbejdning();
  const totalEmballage = calculateTotalEmballage();
  const totalTransport = calculateTotalTransport();
  const totalDetail = calculateTotalDetail();
  const totalILUC = calculateTotalILUC();
  const totalCO2 = calculateTotalCO2();

  // Calculate percentages of total CO2

  // Array of totals
  const totals = [totalLandbrug, totalForarbejdning, totalEmballage, totalTransport, totalDetail, totalILUC];

  // Calculate total of non-zero values
  const totalOfNonZero = totals.reduce((sum, total) => sum + total, 0);

  // Calculate percentages in a single step
  percentages = totals.map((total) => {
    if (totalOfNonZero !== 0) {
      return ((total / totalOfNonZero) * 100).toFixed(2);
    } else {
      // If all input values are zero, distribute percentages equally
      return (100 / totals.length).toFixed(2);
    }
  });

  // Destructure the percentages array
  const [percentLandbrug, percentForarbejdning, percentEmballage, percentTransport, percentDetail, percentILUC] =
    percentages;

  // Sum of all percentages
  const totalPercentage = percentages.reduce((sum, percent) => sum + parseFloat(percent), 0).toFixed(2);
  // Round the totals to 2 decimal places for logging
  const roundedTotalLandbrug = totalLandbrug.toFixed(2);
  const roundedTotalForarbejdning = totalForarbejdning.toFixed(2);
  const roundedTotalEmballage = totalEmballage.toFixed(2);
  const roundedTotalTransport = totalTransport.toFixed(2);
  const roundedTotalDetail = totalDetail.toFixed(2);
  const roundedTotalILUC = totalILUC.toFixed(2);
  const roundedTotalCO2 = totalCO2.toFixed(2);

  // Log the results
  console.log("Total CO2:", totalCO2);
  console.log("Total Landbrug:", totalLandbrug, "(Landbrug Procent:", percentLandbrug + "%)");
  console.log("Total Forarbejdning:", totalForarbejdning, "(Forarbejdning Procent:", percentForarbejdning + "%)");
  console.log("Total Emballage:", totalEmballage, "(Emballage Procent:", percentEmballage + "%)");
  console.log("Total Transport:", totalTransport, "(Transport Procent:", percentTransport + "%)");
  console.log("Total Detail:", totalDetail, "(Detail Procent:", percentDetail + "%)");
  console.log("Total ILUC:", totalILUC, "(ILUC Procent:", percentILUC + "%)");
  console.log("Total Procent:", totalPercentage + "%");
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("calculateBtn");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";

  const farmingDiv = document.getElementById("farmingPercentage");
  const farmingPercentage = document.createTextNode(percentages[0] + "%");
  farmingDiv.appendChild(farmingPercentage);

  const processingDiv = document.getElementById("processingPercentage");
  const processingPercentage = document.createTextNode(percentages[1] + "%");
  processingDiv.appendChild(processingPercentage);

  const packagingDiv = document.getElementById("packagingPercentage");
  const packagingPercentage = document.createTextNode(percentages[2] + "%");
  packagingDiv.appendChild(packagingPercentage);

  const transportDiv = document.getElementById("transportPercentage");
  const transportPercentage = document.createTextNode(percentages[3] + "%");
  transportDiv.appendChild(transportPercentage);

  const detailDiv = document.getElementById("detailPercentage");
  const detailPercentage = document.createTextNode(percentages[4] + "%");
  detailDiv.appendChild(detailPercentage);

  const ILUCDiv = document.getElementById("ILUCPercentage");
  const ILUCPercentage = document.createTextNode(percentages[5] + "%");
  ILUCDiv.appendChild(ILUCPercentage);
};

// When the user clicks on  (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

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
// Funktion til at opdatere farvespektrummet
function updateColorSpectrum() {
  const colorSpectrum = document.getElementById("colorSpectrum");
  colorSpectrum.style.display = "block"; // Vis farvespektrummet

  // Definer grænser for farveskift
  const grøn_tærskel = 100; // Eksempelværdi, skal ændres efter dine behov
  const gul_tærskel = 200; // Eksempelværdi, skal ændres efter dine behov

  // Anvend lineær gradient til baggrund
  colorSpectrum.style.background = `linear-gradient(to right, green ${grøn_tærskel}px, yellow ${gul_tærskel}px, red ${gul_tærskel}px)`;
}

// Hent knappen og tilføj en event listener til klik
document.getElementById("calculateGrid").addEventListener("click", updateColorSpectrum);

 product_circles
function calculateCO2() {
  // Simpel beregning
  let greenThreshold = 0;
  let yellowThreshold = 500;
  let redThreshold = 1000;

  // Vis farvespektrum
  let colorSpectrum = document.getElementById("colorSpectrum");
  colorSpectrum.style.display = "block";

  // Vis tallene
  let colorValues = document.getElementById("colorValues");
  //c.appendChild(innerCircle);
}

// function calculateCO2() {
//   // Simpel beregning
//   let greenThreshold = 0;
//   let yellowThreshold = 500;
//   let redThreshold = 1000;

//   // Vis farvespektrum
//   let colorSpectrum = document.getElementById("colorSpectrum");
//   colorSpectrum.style.display = "block";

//   // Vis tallene
//   let colorValues = document.getElementById("colorValues");
//   c.appendChild(innerCircle);
// }

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
