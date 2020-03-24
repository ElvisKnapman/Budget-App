// BUDGET CONTROLLER
const budgetController = (function() {
  // some code
})();

// UI CONTROLLER
const UIController = (function() {
  // some code
})();

// GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

  const ctrlAddItem = () => {

    // 1. Get the field input data

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget

    console.log('It works');
  } 

  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

  document.addEventListener('keyup', (event) => {

    // event.which used for older browser support
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
