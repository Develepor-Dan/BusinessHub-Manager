const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./DB");

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Business Hub" }).render();
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
        { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
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
    .finally(askForNextAction);
}

function handleUserChoice(res) {
  const choice = res.choice;
  switch (choice) {
    case "VIEW_EMPLOYEES":
      viewEmployees();
      break;
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      viewEmployeesByDepartment();
      break;
    case "ADD_EMPLOYEE":
      addEmployee();
      break;
    case "REMOVE_EMPLOYEE":
      removeEmployee();
      break;
    case "UPDATE_EMPLOYEE_ROLE":
      updateEmployeeRole();
      break;
    case "VIEW_ALL_ROLES":
      viewAllRoles();
      break;
    case "ADD_ROLE":
      addRole();
      break;
    case "REMOVE_ROLE":
      removeRole();
      break;
    case "VIEW_ALL_DEPARTMENTS":
      viewAllDepartments();
      break;
    case "ADD_DEPARTMENT":
      addDepartment();
      break;
    case "REMOVE_DEPARTMENT":
      removeDepartment();
      break;
    case "QUIT":
      quit();
      break;
    default:
      console.error("Invalid choice. Please try again.");
  }
}

// view all employees
function viewEmployees() {
     // Retrieve all employees from the database
     db.findAllEmployees()
       .then(([rows]) => {
         const employees = rows;
         // Log the employees in a formatted table
         console.log("\n");
         console.table(employees);
       })
       // Catch any errors that might occur during the database operation
       .catch(handleError);
}

// View all employees that belong to a department
function viewEmployeesByDepartment() {
     db.findAllDepartments()
       .then(([rows]) => {
         let departments = rows;
         const departmentChoices = departments.map(({ id, name }) => ({
           name: name,
           value: id
         }));
   
         prompt([
           {
             type: "list",
             name: "departmentId",
             message: "Which department would you like to see employees for?",
             choices: departmentChoices
           }
         ])
           .then(res => db.findAllEmployeesByDepartment(res.departmentId))
           .then(([rows]) => {
             let employees = rows;
             console.log("\n");
             console.table(employees);
           })
           .then(() => askForNextAction());  // Separate function for handling next actions
       });
}   

// Delete an employee
function removeEmployee() {
     db.findAllEmployees()
       .then(([rows]) => {
         let employees = rows;
         const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
           name: `${first_name} ${last_name}`,
           value: id
         }));
   
         prompt([
           {
             type: "list",
             name: "employeeId",
             message: "Which employee do you want to remove?",
             choices: employeeChoices
           }
         ])
           .then(res => {
             const confirmed = res.confirm; // assuming you add a confirmation property to the prompt result
             if (confirmed) {
               return db.removeEmployee(res.employeeId);
             } else {
               console.log("Employee removal canceled.");
               return Promise.resolve(); // Resolve the promise to continue with the chain
             }
           })
           .then(() => console.log("Removed employee from the database"))
           .catch(error => console.error("Error removing employee:", error))
           .finally(() => askForNextAction());
       })
}
   
// Add an employee
function addEmployee() {
     prompt([
       {
         name: "first_name",
         message: "What is the employee's first name?"
       },
       {
         name: "last_name",
         message: "What is the employee's last name?"
       }
     ])
       .then(res => {
         let firstName = res.first_name;
         let lastName = res.last_name;
   
         db.findAllRoles()
           .then(([rows]) => {
             let roles = rows;
             const roleChoices = roles.map(({ id, title }) => ({
               name: title,
               value: id
             }));
   
             prompt({
               type: "list",
               name: "roleId",
               message: "What is the employee's role?",
               choices: roleChoices
             })
               .then(res => {
                 let roleId = res.roleId;
   
                 db.findAllEmployees()
                   .then(([rows]) => {
                     let employees = rows;
                     const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                       name: `${first_name} ${last_name}`,
                       value: id
                     }));
   
                     managerChoices.unshift({ name: "None", value: null });
   
                     prompt({
                       type: "list",
                       name: "managerId",
                       message: "Who is the employee's manager?",
                       choices: managerChoices
                     })
                       .then(res => {
                         let employee = {
                           manager_id: res.managerId,
                           role_id: roleId,
                           first_name: firstName,
                           last_name: lastName
                         }
   
                         db.createEmployee(employee);
                       })
                       .then(() => console.log(
                         `Added ${firstName} ${lastName} to the database`
                       ))
                       .then(() => askForNextAction());
                   })
               })
           })
       })
   }
   
// Update an employee's role
async function updateEmployeeRole() {
     try {
       const [employeeRows] = await db.findAllEmployees();
       const employeeChoices = employeeRows.map(({ id, first_name, last_name }) => ({
         name: `${first_name} ${last_name}`,
         value: id
       }));
   
       const { employeeId } = await prompt([
         {
           type: "list",
           name: "employeeId",
           message: "Which employee's role do you want to update?",
           choices: employeeChoices
         }
       ]);
   
       const [roleRows] = await db.findAllRoles();
       const roleChoices = roleRows.map(({ id, title }) => ({
         name: title,
         value: id
       }));
   
       const { roleId } = await prompt([
         {
           type: "list",
           name: "roleId",
           message: "Which role do you want to assign the selected employee?",
           choices: roleChoices
         }
       ]);
   
       await db.updateEmployeeRole(employeeId, roleId);
       console.log("Updated employee's role");
       askForNextAction();
     } catch (error) {
       console.error("Error updating employee's role:", error);

     }
}
   
// View all roles
function viewAllRoles() {
     db.findAllRoles()
       .then(([rows]) => {
         let roles = rows;
         console.log("\n");
         console.table(roles);
       })
       .then(() => askForNextAction());
}

// Add a role
async function addRole() {
     try {
       const [departments] = await db.findAllDepartments();
       const departmentChoices = departments.map(({ id, name }) => ({
         name: name,
         value: id
       }));
   
       const role = await prompt([
         {
           name: "title",
           message: "What is the name of the role?"
         },
         {
           name: "salary",
           message: "What is the salary of the role?"
         },
         {
           type: "list",
           name: "department_id",
           message: "Which department does the role belong to?",
           choices: departmentChoices
         }
       ]);
   
       await db.createRole(role);
       console.log(`Added ${role.title} to the database`);
       askForNextAction();
     } catch (error) {
       console.error("Error adding role:", error);
     }
}

// Delete a role
function removeRole() {
     // Retrieve all roles from the database
     db.findAllRoles()
       .then(([rows]) => {
         let roles = rows;
         const roleChoices = roles.map(({ id, title }) => ({
           name: title,
           value: id
         }));
   
         // Prompt the user to choose a role to remove
         return prompt([
           {
             type: "list",
             name: "roleId",
             message:
               "Which role do you want to remove? (Warning: This will also remove employees)",
             choices: roleChoices
           }
         ]);
       })
       .then(res => {
         // Remove the selected role from the database
         return db.removeRole(res.roleId);
       })
       .then(() => {
         console.log("Removed role from the database");
       })
       .catch(error => {
         console.error("Error removing role:", error);
       })
       .finally(() => {
         // Ask for next action regardless of success or failure
         askForNextAction();
       });
   }
   
// View all departments
async function viewDepartments() {
     try {
       const [rows] = await db.findAllDepartments();
       let departments = rows;
       console.log("\n");
       console.table(departments);
     } catch (error) {
       console.error("Error fetching departments:", error);
     } finally {
       askForNextAction();
     }
}
     
// Add a department
function addDepartment() {
     prompt([
       {
         name: "name",
         message: "What is the name of the department?"
       }
     ])
       .then(res => {
         let { name } = res;
         db.createDepartment(name)
           .then(() => console.log(`Added ${name} to the database`))
           .then(() => askForNextAction())
       })
}
   
// Delete a department
function removeDepartment() {
     db.findAllDepartments()
       .then(([rows]) => {
         let departments = rows;
         const departmentChoices = departments.map(({ id, name }) => ({
           name: name,
           value: id
         }));
   
         prompt({
           type: "list",
           name: "departmentId",
           message:
             "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
           choices: departmentChoices
         })
           .then((res) => {
             // Confirm the deletion with the user
             return prompt({
               type: "confirm",
               name: "confirmation",
               message: `Are you sure you want to remove the selected department?`,
               default: false,
             }).then((confirmationRes) => {
               if (confirmationRes.confirmation) {
                 return db.removeDepartment(res.departmentId);
               } else {
                 console.log("Operation canceled.");
                 return Promise.reject("Operation canceled");
               }
             });
           })
           .then(() => console.log(`Removed department from the database`))
           .then(() => askForNextAction())
           .catch((err) => {
             console.error("Error:", err);
             // Handle errors gracefully
           });
       })
       .catch((err) => {
         console.error("Error:", err);
         // Handle errors gracefully
       });
}

   
// Add other functions with consistent error handling

function handleError(error) {
  console.error("An unexpected error occurred:", error);
}

// Separate function to prompt the user for the next action
function askForNextAction() {
     prompt({
       type: "confirm",
       name: "continue",
       message: "Do you want to perform another action?",
       default: true,
     })
       .then((answer) => {
         if (answer.continue) {
           loadMainPrompts(); // Return to the main menu
         } else {
           quit(); // Or handle application exit
         }
       });
   }
   
function quit() {
  console.log("Goodbye!");
  process.exit();
}

init();
