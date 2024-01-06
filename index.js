const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

// Centralized prompt messages
const prompts = {
  departmentName: "What is the name of the department?",
  // ... add other prompts
};

init();

function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
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
        // ... choices
      ],
    },
  ]).then(handleUserChoice).catch(handleError);
}

function handleUserChoice(res) {
  let choice = res.choice;
  switch (choice) {
    case "VIEW_EMPLOYEES":
      viewEmployees();
      break;
    // ... handle other choices
    default:
      quit();
  }
}

function viewEmployees() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(loadMainPrompts)
    .catch((error) => {
      console.error("Error viewing employees:", error);
      loadMainPrompts();
    });
}

// ... other functions

function handleError(error) {
  console.error("An unexpected error occurred:", error);
  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
