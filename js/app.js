const budgetController = (function() {
  let x = 23;
  let add = a => {
    return x + a;
  };

  return {
    publicTest: function(b) {
      return add(b);
    }
  };
})();

budgetController.publicTest(5);

const UIController = (function() {
  // some code
})();

const controller = (function(budgetCtrl, UICtrl) {
  let z = budgetCtrl.publicTest(10);

  return {
    anotherPublic: function() {
      return z;
    }
  };
})(budgetController, UIController);

console.log(controller.anotherPublic());
