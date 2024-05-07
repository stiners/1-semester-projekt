  


// Select the button container
var buttonContainer = document.getElementById("emptyBaskBtn");

// Create a new button element
var button = document.createElement("button");
button.textContent = "Click me";

// Add a click event listener to the button
button.addEventListener("click", function () {
  alert("Button clicked!");
});

// Append the button to the button container
buttonContainer.appendChild(button);

