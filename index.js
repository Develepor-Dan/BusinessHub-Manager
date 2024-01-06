const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Business Hub Manager" }).render();
  console.log(logoText);
  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "View All Employees", value: "VIEW_EMPLOYEES" },
        { name: "View Employees by Department", value: "VIEW_EMPLOYEES_BY_DEPARTMENT" },
        { name: "Add Employee", value: "ADD_EMPLOYEE" },
        { name: "Remove Employee", value: "REMOVE_EMPLOYEE" },
        { name: "Update Employee Role", value: "uPDATE_EMPLOYEE_ROLE" },
        { name: "View All Roles", value: "VIEW_ALL_ROLES" },
        { name: "Add Role", value: "ADD_ROLE" },
        { name: "Remove Role", value: "REMOVE_ROLE" },
        { name: "View All Departments", value: "VIEW_ALL_DEPARTMENTS" },
        { name: "Add Department", value: "ADD_DEPARTMENT" },
        { name: "Remove Department", value: "REMOVE_DEPARTMENT" },
        { name: "Quit", value: "QUIT" },
      ],
    },
  ])
    .then(handleUserChoice)
    .catch(handleError)
    .finally(loadMainPrompts);
}

function handleUserChoice(res) {
  const choice = res.choice;
  switch (choice) {
    case "VIEW_EMPLOYEES":
      viewEmployees();
      break;
    // Add other cases
    case "QUIT":
      quit();
      break;
    default:
      console.error("Invalid choice. Please try again.");
  }
}

function viewEmployees() {
  db.findAllEmployees()
    .then(([rows]) => {
      const employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .catch(handleError);
}

// Add other functions with consistent error handling

function handleError(error) {
  console.error("An unexpected error occurred:", error);
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}

// Add other functions

init();
