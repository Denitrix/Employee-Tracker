/* const express = require("express"); */
// Import and require mysql2
const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

/* const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
let db;

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */

const init = async () => {
  db = await mysql.createConnection(
    {
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: "",
      database: "employee_db",
    },
    console.log(`Connected to the employee_db database.`)
  );
  console.log(",----------------------------------------------------.");
  console.log("|                                                    |");
  console.log("|   ______                 _                         |");
  console.log("|  |  ____|_ __ ___  _ __ | | ___  _   _  ___  ___   |");
  console.log("|  |   _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  |");
  console.log("|  |  |___| | | | | | |_) | | (_) | |_| |  __/  __/  |");
  console.log("|  |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  |");
  console.log("|                   |_|            |___/             |");
  console.log("|   __  __                                           |");
  console.log("|  |  \\/  | __ _ _ __   __ _  __ _  ___ _ __         |");
  console.log("|  | |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|        |");
  console.log("|  | |  | | (_| | | | | (_| | (_| |  __/ |           |");
  console.log("|  |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|           |");
  console.log("|                            |___/                   |");
  console.log("|                                                    |");
  console.log("|                                                    |");
  console.log("`----------------------------------------------------'");

  menu();
};

const menu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add a Role",
        "Delete a Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then((answers) => {
      const selection = answers.menu;
      switch (selection) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          break;
        case "Update Employee Role":
          break;
        case "View All Roles":
          break;
        case "Add a Role":
          break;
        case "Delete a Role":
          break;
        case "View All Departments":
          break;
        case "Add Department":
          break;
        case "Quit":
          process.exit();
      }
    });
};

const viewEmployees = async () => {
  const [rows, fields] = await db.execute(
    `SELECT 
      e.id AS ID, 
      e.first_name AS First_Name, 
      e.last_name AS Last_Name, 
      r.title AS Role, 
      d.name AS Department, 
      r.salary AS Salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employee AS e
    LEFT JOIN role r ON e.role_id = r.id
    JOIN  department d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id`
  );
  console.table(rows);
  menu();
};

init();
