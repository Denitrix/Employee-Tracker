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
        "Delete Employee",
        "Update Employee Role",
        "View All Roles",
        "Add a Role",
        "Delete Role",
        "View All Departments",
        "Add Department",
        "Delete Department",
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
          await addEmployee();
          break;
        case "Delete Employee":
          await deleteEmployee();
          break;
        case "Update Employee Role":
          await updateEmployeeRole();
          break;
        case "View All Roles":
          await viewRoles();
          break;
        case "Add a Role":
          await addRole();
          break;
        case "Delete Role":
          await deleteRole();
          break;
        case "View All Departments":
          await viewDepartments();
          break;
        case "Add Department":
          await addDepartment();
          break;
        case "Delete Department":
          await deleteDepartment();
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
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id`);
  const transformed = rows.reduce((acc, { ID, ...x }) => {
    acc[ID] = x;
    return acc;
  }, {});
  console.table(transformed);
};

const getEmployees = async () => {
  const [rows, fields] = await db.query(`
    SELECT 
     id AS value, 
     CONCAT(first_name, " ", last_name) AS name 
    FROM employee`);
  return rows;
};

const addEmployee = async () => {
  const employees = await getEmployees();
  employees.unshift({ name: "None", value: null });

  const { first_name, last_name, role, manager } = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: await getRoles(),
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: employees,
    },
  ]);

  await db.query(
    `
  INSERT INTO employee 
    (first_name, 
    last_name, 
    role_id, 
    manager_id) 
  VALUES (?, ?, ?, ?)`,
    [first_name, last_name, role, manager]
  );
  console.log(`Added ${first_name} ${last_name} to the database`);
};

const updateEmployeeRole = async () => {
  const { employee, role } = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's roll do you want to update?",
      choices: await getEmployees(),
    },
    {
      type: "list",
      name: "role",
      message: "Which role do you want to assign the selected employee?",
      choices: await getRoles(),
    },
  ]);
  await db.query(
    `UPDATE employee 
    SET role_id = ? 
    WHERE employee.id = ?`,
    [role, employee]
  );
  console.log("Updated employee's role");
};

const deleteEmployee = async () => {
  const { id } = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Which employee do you want to delete?",
      choices: await getEmployees(),
    },
  ]);
  const [[{ name }], fields] = await db.query(
    `SELECT 
      CONCAT(first_name, " ", last_name) AS name 
    FROM employee
    WHERE id = ?`,
    [id]
  );
  await db.query(`DELETE FROM employee WHERE id = ?`, [id]);
  console.log(`Removed ${name} from the database`);
};

const viewRoles = async () => {
  const [rows, fields] = await db.query(`
    SELECT
      r.id AS ID, 
      r.title AS Title, 
      d.name AS Department, 
      r.salary AS Salary 
    FROM role AS r
    LEFT JOIN department d ON r.department_id = d.id
    `);
  const transformed = rows.reduce((acc, { ID, ...x }) => {
    acc[ID] = x;
    return acc;
  }, {});
  console.table(transformed);
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
    `INSERT INTO role 
      (title, 
      salary, 
      department_id) 
    VALUES (?, ?, ?)`,
    [title, salary, department]
  );
  console.log(`Added ${title} to the database`);
};

const deleteRole = async () => {
  const { id } = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Which role do you want to delete?",
      choices: await getRoles(),
    },
  ]);
  const [[{ title }], fields] = await db.query(
    `SELECT 
      title 
    FROM role
    WHERE id = ?`,
    [id]
  );
  await db.query(`DELETE FROM role WHERE id = ?`, [id]);
  console.log(`Removed ${title} from the database`);
};

const viewDepartments = async () => {
  const [rows, fields] = await db.query(`
    SELECT
      id AS ID, 
      name AS Department 
    FROM department
    `);
  const transformed = rows.reduce((acc, { ID, ...x }) => {
    acc[ID] = x;
    return acc;
  }, {});
  console.table(transformed);
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

const deleteDepartment = async () => {
  const { id } = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Which department do you want to delete?",
      choices: await getDepartments(),
    },
  ]);
  const [[{ name }], fields] = await db.query(
    `SELECT 
      name 
    FROM department
    WHERE id = ?`,
    [id]
  );
  console.log(`Removed ${name} from the database`);
  await db.query(`DELETE FROM department WHERE id = ?`, [id]);
};

init();
