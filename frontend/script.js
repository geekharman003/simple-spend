const USER_BASE_URL = "http://localhost:3000/user";
const EXPENSE_BASE_URL = "http://localhost:3000/expenses";
const BASE_URL = "http://localhost:3000";

// pagination variables
let page = 0;
const limit = 10;
let skip = 0;
let totalItems = null; //stores the total expenses
let fetchedItems = 0; //tracks how many expenses are fetched

const handleSignUpForm = (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
  const message = document.getElementById("message");

  axios
    .post(`${USER_BASE_URL}/signup`, {
      name,
      email,
      password,
    })
    .then((res) => {
      message.textContent = res.data;
      message.style.color = "green";
    })
    .catch((err) => {
      message.textContent = err.response.data;
      message.style.color = "red";
      console.log(err.message);
    });
};

const handleLoginForm = (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;

  axios
    .post(`${USER_BASE_URL}/login`, {
      email,
      password,
    })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      if (res.data.redirect) {
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      message.textContent = err.response.data;
      message.style.color = "red";
    });
};

const handleForgotForm = async (event) => {
  event.preventDefault();

  const email = event.target.email.value;
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${BASE_URL}/password/forgotpassword`,
      {
        email,
      }
      // {
      //   headers: { Authorization: token },
      // }
    );

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

const handleExpenseForm = (event) => {
  event.preventDefault();

  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const token = localStorage.getItem("token");

  axios
    .post(
      `${EXPENSE_BASE_URL}/addexpense`,
      {
        amount,
        description,
      },
      { headers: { Authorization: token } }
    )
    .then((res) => {
      const { id, amount, description, category } = res.data;
      console.log(category);
      createLi(id, amount, description, category);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createLi = (id, amount, description, category) => {
  const ul = document.getElementById("expense-list");
  const li = document.createElement("li");
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    deleteExpense(id, li);
  });
  li.textContent = `${amount}-${description}-${category}`;
  li.appendChild(deleteBtn);

  ul.appendChild(li);
};

const deleteExpense = (id, li) => {
  const token = localStorage.getItem("token");
  axios
    .delete(`${EXPENSE_BASE_URL}/delete/${id}`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      if (res.data.success) {
        li.remove();
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const showLeaderBoard = () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";
  axios
    .get(`${BASE_URL}/premium/leaderBoard`)
    .then((res) => {
      const users = res.data;
      users.forEach((user) => {
        const { name, totalExpenses } = user;
        addUserToLeaderBoard(leaderboardList, name, totalExpenses);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addUserToLeaderBoard = (leaderboardList, name, totalExpenses) => {
  const li = document.createElement("li");
  li.textContent = `Name-${name},Total Expenses-${totalExpenses}`;

  leaderboardList.appendChild(li);
};

const setTotalItemsCount = (count) => {
  totalItems = count;
};

// called when user clicked on prev nutton
const loadPrevNItems = async () => {
  // only call the api when not on first page
  if (page > 1) {
    fetchedItems = fetchedItems - 10;
    page--;
    skip = page * limit - limit;
    const table = document.getElementById("expense-table");
    table.innerHTML = "";
    table.innerHTML = `
    <tr id="expense-headings">
      <th>amount</th>
      <th>Description</th>
      <th>Category</th>
    </tr>`;

    try {
      const res = await axios.get(
        `${EXPENSE_BASE_URL}/loadNExpenses?limit=${limit}&skip=${skip}`
      );

      const expenses = res.data;

      expenses.forEach((expense) => {
        const { amount, description, category } = expense;
        addNItemsToUi(amount, description, category, table);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("you are at first page");
  }
};

// called when the user clicked on next button
const loadNextNItems = async () => {
  // call the api only when all records are not fetched
  if (fetchedItems < totalItems) {
    fetchedItems = fetchedItems + 10;
    page++;
    skip = page * limit - limit;
    const table = document.getElementById("expense-table");
    table.innerHTML = "";
    table.innerHTML = `
    <tr id="expense-headings">
      <th>amount</th>
      <th>Description</th>
      <th>Category</th>
    </tr>`;
    try {
      const res = await axios.get(
        `${EXPENSE_BASE_URL}/loadNExpenses?limit=${limit}&skip=${skip}`
      );

      const expenses = res.data;

      expenses.forEach((expense) => {
        const { amount, description, category } = expense;
        addNItemsToUi(amount, description, category, table);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("all the items are fetched");
  }
};

const addNItemsToUi = (amount, description, category, table) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
  <td>${amount}</td>
  <td>${description}</td>
  <td>${category}</td>
  `;

  table.appendChild(tr);
};

const enablePremiumUserFeatures = () => {
  const premiumUserMessage = document.getElementById("premium-user-message");
  const payBtn = document.getElementById("pay-btn");
  const leaderboardSection = document.getElementById("leaderboard-section");
  const downloadExpenseBtn = document.getElementById("download-expense-btn");
  premiumUserMessage.textContent = "You are now a premium👑 user.😀";
  payBtn.style.display = "none";
  leaderboardSection.style.display = "initial";
  downloadExpenseBtn.style.display = "initial";
};
