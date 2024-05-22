let numbers = [];
let percentages = [];
const percentageDivs = [
  "farmingPercentage",
  "processingPercentage",
  "packagingPercentage",
  "transportPercentage",
  "detailPercentage",
  "ILUCPercentage",
];

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
  const roundedTotalCO2 = totalCO2.toFixed(2);
  const color = determineColor(totalCO2);
  const circleElement = document.getElementById("CO2Circle");
  circleElement.textContent = `${roundedTotalCO2} co2/kg`;
  circleElement.style.backgroundColor = color;

  // Calculate percentages of total CO2

  // Array of totals
  const totals = [totalLandbrug, totalForarbejdning, totalEmballage, totalTransport, totalDetail, totalILUC];

  // Calculate total of non-zero values
  const totalOfNonZero = totals.reduce((sum, total) => sum + total, 0);

  // Calculate percentages in a single step
  percentages = totals.map((total) => {
    if (totalOfNonZero !== 0) {
      return Math.round((total / totalOfNonZero) * 100);
    } else {
      // If all input values are zero, distribute percentages equally
      return Math.round(100 / totals.length);
    }
  });

  // Destructure the percentages array
  const [percentLandbrug, percentForarbejdning, percentEmballage, percentTransport, percentDetail, percentILUC] =
    percentages;

  // Sum of all percentages
  const totalPercentage = percentages.reduce((sum, percent) => sum + parseFloat(percent), 0).toFixed(2);
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("calculateBtn");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";

  populatePercentageDivs();
  barChart();
};

// When the user clicks on  (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  clearPercentageDivs();
  percentages.length = [];
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    clearPercentageDivs();
    percentages.length = [];
  }
};

function populatePercentageDivs() {
  percentageDivs.forEach((divId, index) => {
    const div = document.getElementById(divId);
    if (div) {
      const percentage = document.createElement("span");
      percentage.classList.add("percentage-span");
      percentage.id = "percentage-span-" + index;
      percentage.textContent = percentages[index] + "%";
      div.appendChild(percentage);
    } else {
      console.error(`Element with id ${divId} not found`);
    }
  });
}

// Function to clear percentage divs
function clearPercentageDivs() {
  percentageDivs.forEach((divId) => {
    const div = document.getElementById(divId);
    if (div.childNodes.length > 1) {
      div.removeChild(div.lastChild);
      div.removeChild(div.lastChild);
    }
  });
}

function barChart() {
  // Find the maximum percentage
  const maxPercentage = Math.max(...percentages);

  percentageDivs.forEach((divId, index) => {
    const div = document.getElementById(divId);
    if (div) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.id = "bar-" + index;

      // Normalize the percentage
      const normalizedPercentage = (percentages[index] / maxPercentage) * 100;

      bar.style.width = normalizedPercentage + "%";
      div.appendChild(bar);
      console.log("Bar chart added to the modal");
    } else {
      console.error(`Element with id ${divId} not found`);
    }
  });
}

// Definition af CO2-udslipstærskler
const green_co2 = 10;
const yellow_co2 = 20;

function determineColor(totalCO2) {
  // Determine the color based on the thresholds
  let color;
  if (totalCO2 < green_co2) {
    color = "#91C483";
  } else if (totalCO2 < yellow_co2) {
    color = "#F7D060";
  } else {
    color = "#FF6D60";
  }

  return color;
}
