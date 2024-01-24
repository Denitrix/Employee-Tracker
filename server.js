/* const express = require("express"); */
// Import and require mysql2
const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

/* const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */

// Connect to database
let db;

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
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then(async (answers) => {
      const selection = answers.menu;
      switch (selection) {
        case "View All Employees":
          await viewEmployees();
          break;
        case "Add Employee":
          break;
        case "Update Employee Role":
          break;
        case "View All Roles":
          await viewRoles();
          break;
        case "Add a Role":
          await addRole();
          break;
        case "View All Departments":
          await viewDepartments();
          break;
        case "Add Department":
          await addDepartment();
          break;
        case "Quit":
          process.exit();
      }
    })
    .then(() => {
      menu();
    });
};

const viewEmployees = async () => {
  const [rows, fields] = await db.query(`
    SELECT 
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
    LEFT JOIN employee AS m ON e.manager_id = m.id`);
  console.table(rows);
};

const getEmployees = async () => {
  const [rows, fields] = await db.query(`
    SELECT 
     id AS value, 
     CONCAT(first_name, " ", last_name) AS name 
    FROM employee`);
  return rows;
};

const viewRoles = async () => {
  const [rows, fields] = await db.query(`
    SELECT
      r.id AS ID, 
      r.title AS Title, 
      d.name AS Department, 
      r.salary AS Salary 
    FROM role AS r
    JOIN department d ON r.department_id = d.id
    `);
  console.table(rows);
};

const getRoles = async () => {
  const [rows, fields] = await db.query(`
    SELECT 
     id AS value, 
    title AS name 
   FROM role`);
  return rows;
};

const addRole = async () => {
  const { title, salary, department } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: await getDepartments(),
    },
  ]);
  await db.query(
    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
    [title, salary, department]
  );
  console.log(`Added ${title} to the database`);
};

const viewDepartments = async () => {
  const [rows, fields] = await db.query(`
    SELECT
      id AS ID, 
      name AS Department 
    FROM department
    `);
  console.table(rows);
};

const getDepartments = async () => {
  const [rows, fields] = await db.query(`
    SELECT 
     id AS value, 
      name AS name 
    FROM department`);
  return rows;
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "What is the name of the department?",
  });
  await db.query(`INSERT INTO department (name) VALUES (?)`, [name]);
  console.log(`Added ${name} to the database`);
};

init();
