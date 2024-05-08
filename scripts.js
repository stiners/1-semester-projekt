// Select the button container
var buttonContainer = document.getElementById("emptyBaskBtnGrid");
// Create a new button element
var newButton = document.createElement("button");
newButton.textContent = "Click me";
// Add a click event listener to the button
newButton.addEventListener("click", function () {
  alert("Button clicked!");
});
// Append the button to the button container
//buttonContainer.appendChild(newButton); der er noget der driller

var calculateButton = document.querySelector("#calculateGrid button");
calculateButton.addEventListener("click", function () {
  var foodList = document.getElementById("foodListGrid");

  if (!foodList) {
    console.log("Element with id 'foodList' not found");
    return;
  }
  var numbers = foodList.innerText.split(" ").map(function (item) {
    var number = Number(item);
    if (isNaN(number)) {
      console.log("Non-numeric character found:", item);
      return 0;
    }
    return number;
  });
  var sum = numbers.reduce(function (a, b) {
    return a + b;
  }, 0);
  console.log("Sum:", sum);
});

// I MÅ HELST IKKE SLETTE DETTE :D
// var stinesPlaceholderBtn = document.createElement("button");
// stinesPlaceholderBtn.textContent = "Stines Knap";
// stinesPlaceholderBtn.setAttribute("id", "stinesKnap");
// stinesPlaceholderBtn.addEventListener("click", function () {
//   console.log("du har klikket på stines knap");
// });
// var buttonContainer = document.getElementById("circlesGrid");
// buttonContainer.appendChild(stinesPlaceholderBtn);

document.addEventListener("DOMContentLoaded", function () {
  var stinesPlaceholderBtn = document.createElement("button");
  stinesPlaceholderBtn.textContent = "Stines Knap";
  stinesPlaceholderBtn.setAttribute("id", "stinesKnap");

  var buttonContainer = document.getElementById("circlesGrid");
  buttonContainer.appendChild(stinesPlaceholderBtn);

  // Add event listener to the button
  stinesPlaceholderBtn.addEventListener("click", function () {
    // Create a new item element to represent the item in the shopping basket
    var newItem = document.createElement("div");
    newItem.textContent = "Item added to basket"; // Example content for the item

    // Append the new item to the shopping basket container
    var shoppingBasket = document.getElementById("foodListGrid");
    shoppingBasket.appendChild(newItem);
  });
});
