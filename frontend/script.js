const USER_BASE_URL = "http://localhost:3000/user";
const EXPENSE_BASE_URL = "http://localhost:3000/expenses";
const BASE_URL = "http://localhost:3000";

// pagination variables
let currentPage = 1;
let currentPageCount = 0;
let limit = 3;
let skip = 0;
let totalItems = null; //stores the total expenses
let totalPages = null;

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const currentPageElement = document.getElementById("current-page");
const totalPageElement = document.getElementById("total-pages");

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
      },
      {
        headers: { Authorization: token },
      }
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
  const table = document.getElementById("expense-table");
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
      addNItemsToUi(id, amount, description, category, table);
      // createLi(id, amount, description, category,table);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// const createLi = (id, amount, description, category) => {
//   const ul = document.getElementById("expense-list");
//   const li = document.createElement("li");
//   const deleteBtn = document.createElement("button");

//   deleteBtn.textContent = "Delete";
//   deleteBtn.addEventListener("click", () => {
//     deleteExpense(id, li);
//   });
//   li.textContent = `${amount}-${description}-${category}`;
//   li.appendChild(deleteBtn);

//   ul.appendChild(li);
// };

const deleteExpense = (id, tr) => {
  currentPageCount--;

  // if no items left on currentpage,
  // load previous page items
  if (currentPageCount === 0) {
    if (totalPages > 1) {
      totalPages--;
    }
    loadPrevNItems();
  }
  const token = localStorage.getItem("token");
  axios
    .delete(`${EXPENSE_BASE_URL}/delete/${id}`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      if (res.data.success) {
        tr.remove();
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const showLeaderBoard = () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";
  const token = localStorage.getItem("token");
  axios
    .get(`${BASE_URL}/premium/leaderBoard`, {
      headers: { Authorization: token },
    })
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
  totalPages = Math.ceil(totalItems / limit);
  totalPageElement.textContent = totalPages;
  currentPageElement.textContent = totalPages;
};

// called when user clicked on prev nutton
const loadPrevNItems = async () => {
  // only call the api when page is >=1
  if (currentPage > 1) {
    currentPage--;
    if (nextBtn.hasAttribute("disabled")) {
      nextBtn.removeAttribute("disabled");
    }
    if (currentPage === 1) {
      prevBtn.setAttribute("disabled", "true");
    }

    skip = (currentPage - 1) * limit;
    currentPageElement.textContent = currentPage;
    try {
      const table = document.getElementById("expense-table");
      const response = await axios.get(
        `${EXPENSE_BASE_URL}/loadNExpenses?skip=${skip}&limit=${limit}`
      );
      table.innerHTML = "";
      table.innerHTML = `
      <tr id="expense-headings">
      <th>amount</th>
      <th>Description</th>
      <th>Category</th>
      <th></th>
      </tr>
      `;

      currentPageCount = 0;
      const expenses = response.data;

      expenses.forEach((expense) => {
        const { id, amount, description, category } = expense;
        addNItemsToUi(id, amount, description, category, table);
      });
    } catch (error) {
      console.error(error.message);
    }
  } else {
    console.log("ypu are at first page");
  }
};

// called when the user clicked on next button
const loadNextNItems = async () => {
  if (currentPage < totalPages) {
    currentPage++;

    //show prev button when current page is not 1
    if (currentPage > 1) {
      if (prevBtn.hasAttribute("disabled")) {
        prevBtn.removeAttribute("disabled");
      }
    }

    // if current page is the last page
    // disable next button
    if (currentPage === totalPages) {
      nextBtn.setAttribute("disabled", "true");
    }

    skip = (currentPage - 1) * limit;
    currentPageElement.textContent = currentPage;
    try {
      const table = document.getElementById("expense-table");
      const res = await axios.get(
        `${EXPENSE_BASE_URL}/loadNExpenses?limit=${limit}&skip=${skip}`
      );

      table.innerHTML = "";
      table.innerHTML = `
      <tr id="expense-headings">
      <th>amount</th>
      <th>Description</th>
      <th>Category</th>
      <th></th>
      </tr>`;

      currentPageCount = 0;
      const expenses = res.data;

      expenses.forEach((expense) => {
        const { id, amount, description, category } = expense;
        addNItemsToUi(id, amount, description, category, table);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("you are at last page");
  }
};

const addNItemsToUi = (id, amount, description, category, table) => {
  // if the current page become full
  if (currentPageCount === limit) {
    // check whether we already have a next page,if yes,then
    // first load the expenses of next page
    // if(currentPage < totalPages){
    //   loadNextNItems();
    //   addNItemsToUi(id,amount,description,category,table);
    //   return;
    // }

    // otherwise create a new page
    currentPageCount = 0;
    currentPage++;
    if (currentPage > totalPages) {
      totalPages++;
    }

    if (prevBtn.hasAttribute("disabled")) {
      prevBtn.removeAttribute("disabled");
    }
    table.innerHTML = "";
    table.innerHTML = `<tr id="expense-headings">
    <th>amount</th>
    <th>Description</th>
    <th>Category</th>
    <th></th>
    </tr>`;
    currentPageElement.textContent = currentPage;
    totalPageElement.textContent = currentPage;
  }

  currentPageCount++;
  const tr = document.createElement("tr");
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-expense-btn";
  deleteBtn.addEventListener("click", () => {
    deleteExpense(id, tr);
  });

  tr.innerHTML = `
  <td>${amount}</td>
  <td>${description}</td>
  <td>${category}</td>
  `;
  const td = document.createElement("td");
  td.appendChild(deleteBtn);
  tr.appendChild(td);

  table.appendChild(tr);
};

const changeRowsPerPage = (event) => {
  limit = Number(event.target.value);
  currentPage = 0;
  skip = 0;
  totalPages = Math.round(totalItems / limit);
  if (totalPages > 1) {
    if (nextBtn.hasAttribute("disabled")) {
      nextBtn.removeAttribute("disabled");
    }
  }
  totalPageElement.textContent = totalPages;
  prevBtn.setAttribute("disabled", "true");
  loadNextNItems();
};

const downloadExpenses = async (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/premium/downloadExpenses`, {
    responseType: "blob",
    headers: { Authorization: token },
  });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
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
