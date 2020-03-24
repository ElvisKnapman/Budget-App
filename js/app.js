// BUDGET CONTROLLER
const budgetController = (function() {
  // some code
})();

// UI CONTROLLER
const UIController = (function() {

  // DOM elements
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value'

  }
  
  return {
    getInput: function() {

      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    }
  }
})();

// GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

  const ctrlAddItem = () => {

    // 1. Get the field input data
    const input = UIController.getInput();
    console.log(input);

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget

  } 

  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

  document.addEventListener('keyup', (event) => {

    // event.which used for older browser support
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
