// BUDGET CONTROLLER
const budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = (type) => {
    let sum = 0;

    data.allItems[type].forEach((item) => {
      sum += item.value;

      data.totals[type] = sum;
    });
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: 0,
  };

  return {
    addItem: function (type, desc, val) {
      let newItem, id;

      // create new ID
      if (data.allItems[type].length > 0) {
        // if data in array, increment ID
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        // id is 0 if array is empty
        id = 0;
      }

      // type uses 'exp' or 'inc' --- same as property names in object
      if (type === "exp") {
        newItem = new Expense(id, desc, val);
      } else if (type === "inc") {
        newItem = new Income(id, desc, val);
      }

      // push into data structure
      data.allItems[type].push(newItem);

      // return the new item
      return newItem;
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent (round it)
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      return data;
    },
  };
})();

// UI CONTROLLER
const UIController = (function () {
  // DOM elements
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
  };

  return {
    getInput: function () {
      return {
        // trim method for all property values to eliminate leading and trailing whitespace
        type: document.querySelector(DOMstrings.inputType).value.trim(),
        description: document
          .querySelector(DOMstrings.inputDescription)
          .value.trim(),
        // convert value from string to number format
        value: Number(
          document.querySelector(DOMstrings.inputValue).value.trim()
        ),
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;

      // create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      let fields;

      // select all input fields
      fields = document.querySelectorAll("input");

      // convert node list to array
      fieldsArr = Array.from(fields);

      // loop over array of fields and clear values
      fieldsArr.forEach((field) => {
        field.value = "";
      });

      // set focus back to first field
      fieldsArr[0].focus();
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = () => {
    // DOM element strings
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keyup", (event) => {
      // event.which used for older browser support
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const updateBudget = () => {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    const budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
  };

  const ctrlAddItem = () => {
    let input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // check to make sure description is not blank, and the value is both: not NaN and greater than zero
    if (
      input.description !== "" &&
      Number.isNaN(input.value) !== true &&
      input.value > 0
    ) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear UI input fields
      UICtrl.clearFields();

      // 5. Calculate and update the budget
      updateBudget();
    }
  };

  return {
    init: function () {
      console.log("app started");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
