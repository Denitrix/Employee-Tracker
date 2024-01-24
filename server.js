const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
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

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const init = () => {
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
};

init();
