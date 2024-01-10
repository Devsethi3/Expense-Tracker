// Get DOM elements
const balanceElement = document.getElementById("balance");
const incomeElement = document.querySelector(".income");
const expenseElement = document.querySelector(".expense");
const historyContainer = document.querySelector(".history-container");
const inputTitle = document.getElementById("input-title");
const inputAmount = document.getElementById("input-amount");
const addIncomeBtn = document.getElementById("add-income");
const addExpenseBtn = document.getElementById("add-expense");

// Initialize data
let balance = 0;
let transactions = [];

// Function to update the balance display
function updateBalanceDisplay() {
  balanceElement.textContent = `₹${balance.toFixed(2)}`;
}

// Function to update income and expense displays
function updateIncomeExpenseDisplays() {
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  incomeElement.textContent = `₹${income.toFixed(2)}`;
  expenseElement.textContent = `₹${Math.abs(expense).toFixed(2)}`;
}

// Function to update the transaction history display
function updateTransactionHistoryDisplay() {
  historyContainer.innerHTML = "";

  transactions.forEach((transaction, index) => {
    const historyGroup = document.createElement("div");
    historyGroup.classList.add(
      "history-group",
      transaction.amount > 0 ? "add" : "subtract"
    );

    const titleElement = document.createElement("p");
    titleElement.classList.add("history-title");
    titleElement.textContent = transaction.title;

    const cashElement = document.createElement("p");
    cashElement.classList.add("cash");
    cashElement.textContent = `${transaction.amount < 0 ? "-₹" : "₹"}${Math.abs(
      transaction.amount
    ).toFixed(2)}`;

    const editIcon = createIcon("ri-edit-line", () => editTransaction(index));
    const deleteIcon = createIcon("ri-delete-bin-line", () =>
      deleteTransaction(index)
    );

    historyGroup.appendChild(titleElement);
    historyGroup.appendChild(cashElement);
    historyGroup.appendChild(editIcon);
    historyGroup.appendChild(deleteIcon);

    historyContainer.appendChild(historyGroup);
  });
}

// Function to create an icon element
function createIcon(className, clickHandler) {
  const icon = document.createElement("i");
  icon.classList.add(className);
  icon.addEventListener("click", clickHandler);
  return icon;
}

// Function to add a transaction
function addTransaction(title, amount) {
  const transaction = { title, amount };
  transactions.push(transaction);
  updateTransactionHistoryDisplay();
  updateLocalStorage(); // Update local storage after adding a transaction
}

// Function to edit a transaction
function editTransaction(index) {
  const transaction = transactions[index];
  const newTitle = prompt("Enter new title:", transaction.title);
  const newAmount = prompt("Enter new amount:", transaction.amount);

  if (newTitle !== null && newAmount !== null) {
    const newAmountFloat = parseFloat(newAmount);
    balance += newAmountFloat - transaction.amount;
    transaction.title = newTitle.trim();
    transaction.amount = newAmountFloat;
    updateTransactionHistoryDisplay();
    updateBalanceDisplay();
    updateIncomeExpenseDisplays();
    updateLocalStorage(); // Update local storage after editing a transaction
  }
}

// Function to delete a transaction
function deleteTransaction(index) {
  const deletedTransaction = transactions[index];
  balance -= deletedTransaction.amount;
  transactions.splice(index, 1);
  updateTransactionHistoryDisplay();
  updateBalanceDisplay();
  updateIncomeExpenseDisplays();
  updateLocalStorage(); // Update local storage after deleting a transaction
}

// Function to save data to local storage
function updateLocalStorage() {
  localStorage.setItem("balance", balance.toFixed(2));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to retrieve data from local storage on page load
function loadFromLocalStorage() {
  const storedBalance = localStorage.getItem("balance");
  const storedTransactions = localStorage.getItem("transactions");

  if (storedBalance) {
    balance = parseFloat(storedBalance);
  }

  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
  }

  updateBalanceDisplay();
  updateIncomeExpenseDisplays();
  updateTransactionHistoryDisplay();
}

// Event listeners for adding income and expense
addIncomeBtn.addEventListener("click", () => {
  const title = inputTitle.value.trim();
  const amount = parseFloat(inputAmount.value);

  if (title && !isNaN(amount)) {
    balance += amount;
    addTransaction(title, amount);
    updateBalanceDisplay();
    updateIncomeExpenseDisplays();
    inputTitle.value = "";
    inputAmount.value = "";
  }
});

addExpenseBtn.addEventListener("click", () => {
  const title = inputTitle.value.trim();
  const amount = parseFloat(inputAmount.value);

  if (title && !isNaN(amount)) {
    balance -= amount;
    addTransaction(title, -amount); // Note the negative sign for expenses
    updateBalanceDisplay();
    updateIncomeExpenseDisplays();
    inputTitle.value = "";
    inputAmount.value = "";
  }
});

// Load data from local storage on page load
loadFromLocalStorage();
