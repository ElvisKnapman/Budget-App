// BUDGET CONTROLLER
const budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    percentage: -1,
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

    deleteItem: function (type, id) {
      let ids, index;
      id = Number(id);

      // return new array of all IDs
      ids = data.allItems[type].map((item) => {
        return item.id;
      });

      // find index in array of specific id
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent (round it) --- only calculate if there is income
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach((item) => {
        item.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      const allPercentages = data.allItems.exp.map((item) => {
        return item.getPercentage();
      });

      return allPercentages;
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
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage"
  };

  const formatNumber = (num, type) => {
    let numSplit, int, dec;

    /* 
    + or - before number
    exactly 2 decimal places
    comma separating the thousands

    1798.5621 -> + 1,798.56
    2000 -> + 2,000.00

    1000000
    */

    // get absolute number
    num = Math.abs(num);
    // format number to 2 decimal places
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];

    // format number with commas if in the thousands
    int = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    dec = numSplit[1];

    // determine if it's an income or an expense for prepending a sign


    return `${(type === 'exp' ? '-' : '+')} ${int}.${dec}`;

  }

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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      // store element
      const el = document.getElementById(selectorID);

      // select parent node of element to remove, remove the child from the parent
      el.parentNode.removeChild(el);
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

    displayBudget: function (obj) {
      let type;

      // assign a type to show a '+' or '-' before number
      obj.budget >= 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(
          DOMstrings.percentageLabel
        ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

      fields.forEach((field, index) => {
        if (percentages[index] > 0) {
          field.textContent = `${percentages[index]}%`;
        } else {
          field.textContent = '----'
        }
      });
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

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  const updateBudget = () => {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return the budget
    const budget = budgetCtrl.getBudget();

    // 3. display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = () => {
    // 1. calculate the percentages
    budgetCtrl.calculatePercentages();

    // 2. read the percentages from the budget controller
    const percentages = budgetCtrl.getPercentages();

    // 3. update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = () => {
    let input, newItem;

    // 1. get the field input data
    input = UICtrl.getInput();

    // check to make sure description is not blank, and the value is both: not NaN and greater than zero
    if (
      input.description !== "" &&
      Number.isNaN(input.value) !== true &&
      input.value > 0
    ) {
      // 2. add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear UI input fields
      UICtrl.clearFields();

      // 5. calculate and update the budget
      updateBudget();

      // 6. calculate and update the percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = (event) => {
    let itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = Number(splitID[1]);

      // 1. delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. update and show the new budget
      updateBudget();

      // 4. calculate and update the percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("app started");
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
    },
  };
})(budgetController, UIController);

controller.init();
