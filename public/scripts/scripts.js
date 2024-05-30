// Define arrays to store numbers and percentages
let numbers = [];
let percentages = [];

// Define an array of IDs corresponding to percentage divs
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


// Function definitions for CO2 and other metric calculations
function calculateTotalCO2() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.co2e_pr_kg || 0), 0);
}

function calculateTotalLandbrug() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.landbrug || 0), 0);
}

function calculateTotalForarbejdning() {
  return shoppingBasketData.reduce((total, item) => total + Math.abs(Number(item.forarbejdning || 0)), 0);
}

function calculateTotalEmballage() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.emballage || 0), 0);
}

function calculateTotalTransport() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.transport || 0), 0);
}

function calculateTotalDetail() {
  return shoppingBasketData.reduce((total, item) => total + Number(item.detail || 0), 0);
}

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
  const totalRoundedCo2 = Math.round(totalCO2);
  const averageCO2 = Math.round(totalCO2 / shoppingBasketData.length);
  const color = determineColor(averageCO2);

  const circleElement = document.getElementById("CO2Circle");
  circleElement.innerText = `${totalRoundedCo2} CO₂/kg`;
  circleElement.style.backgroundColor = color;
  console.log(averageCO2);

  // Calculate percentages of total CO2
  const totals = [totalLandbrug, totalForarbejdning, totalEmballage, totalTransport, totalDetail, totalILUC];

  // Calculate total of non-zero values
  const totalOfNonZero = totals.reduce((sum, total) => sum + total, 0);

  // Calculate percentages in a single step
  percentages = totals.map((total) => {
    if (totalOfNonZero !== 0) {
      return Math.round((total / totalOfNonZero) * 100);
    } else {
      return 0;
    }
  });
}

// Fetching necessary elements for modal functionality
let modal = document.getElementById("myModal");
let btn = document.getElementById("calculateBtn");
let span = document.getElementsByClassName("close")[0];

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

// Function to populate percentage divs with percentages
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

// Generate bar chart
function barChart() {
  const maxPercentage = Math.max(...percentages);

  percentageDivs.forEach((divId, index) => {
    const div = document.getElementById(divId);
    if (div) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.id = "bar-" + index;

      
      const normalizedPercentage = (percentages[index] / maxPercentage) * 100;

      bar.style.width = normalizedPercentage + "%";
      div.appendChild(bar);
      console.log("Bar chart added to the modal");
    } else {
      console.error(`Element with id ${divId} not found`);
    }
  });
}

// CO2 thresholds and color determination
const green_co2 = 10;
const yellow_co2 = 20;

 // Determine the color based on the thresholds
function determineColor(avarageCO2) {
  let color;
  let text;
  const fixedText = "Til venstre ses CO2-udslippet pr. kg mad, og til højre ses fordelingen af udslippet i de forskellige kategorier. Før musen hen over ikonerne for at se hvad de betyder.";
  
  if (avarageCO2 < green_co2) {
    color = "#91C483";
    text =
      "Grøn: Lavt CO2-aftryk – Godt gået! Din kurv består hovedsageligt af produkter med lav CO2-udledning, som grøntsager, frugt, korn og bælgfrugter. Fortsæt med at vælge bæredygtige varer for at minimere din miljøpåvirkning.";
  } else if (avarageCO2 < yellow_co2) {
    color = "#F7D060";
    text =
      "Gul: Mellem CO2-aftryk – Din kurv indeholder både produkter med højt og lavt CO2-aftryk. Der er plads til forbedring. For eksempel kan du bytte svinekød eller mejeriprodukter med plantebaserede alternativer som tofu, havremælk eller andre plantebaserede produkter.";
  } else {
    color = "#FF6D60";
    text =
      "Rød: Højt CO2-aftryk – Dette betyder sandsynligvis, at der er produkter i din kurv som oksekød, lam eller importerede varer, der har rejst lange afstande. Overvej at erstatte disse med mere bæredygtige alternativer som kylling, bælgfrugter, eller lokale og sæsonbetonede grøntsager.";
  }

  const textBoxGrid = document.getElementById("textBoxText");
  textBoxGrid.innerHTML = text + "<br><br>" + fixedText;

  return color;
}
