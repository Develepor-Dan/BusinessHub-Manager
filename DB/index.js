const connection = require("./pool");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  //Find all employees
  async findAllEmployees() {
    try {
      const [rows] = await this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // View all departments
  async findAllDepartments() {
     try {
       const [rows] = await this.connection.promise().query(
         "SELECT department.id, department.name FROM department;"
       );
       return rows;
     } catch (error) {
       throw error;
     }
   }
   
   // Add a new employee
  async createEmployee(employee) {
    try {
      await this.connection.promise().query("INSERT INTO employee SET ?", employee);
    } catch (error) {
      throw error;
    }
  }

  //Remove an employee
  async removeEmployee(employeeId) {
    try {
      await this.connection.promise().query("DELETE FROM employee WHERE id = ?", employeeId);
    } catch (error) {
      throw error;
    }
  }

  //Update employee role
  async updateEmployeeRole(employeeId, roleId) {
    try {
      await this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
    } catch (error) {
      throw error;
    }
  }

  // Add a department
  async createDepartment(department) {
     try {
       const [result] = await this.connection.promise().query("INSERT INTO department SET ?", department);
       return result;
     } catch (error) {
       throw error;
     }
   }

   //find all roles
   async findAllRoles() {
     try {
       const [rows] = await this.connection.promise().query(
         "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
       );
       return rows;
     } catch (error) {
       throw error;
     }
   }
   

   //create a new role
   async createRole(role) {
     try {
       await this.connection.promise().query("INSERT INTO role SET ?", role);
     } catch (error) {
       throw error;
     }
   }   

   //remove a role
   async removeRole(roleId) {
     try {
       await this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
     } catch (error) {
       throw error;
     }
   }
   
   
   //Delete a department
  async removeDepartment(departmentId) {
    try {
      await this.connection.promise().query("DELETE FROM department WHERE id = ?", departmentId);
    } catch (error) {
      throw error;
    }
  }

  // Find employee by department
  async findAllEmployeesByDepartment(departmentId) {
     try {
       const [rows] = await this.connection.promise().query(
         "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
         departmentId
       );
       return rows;
     } catch (error) {
       throw error;
     }
   }
   
}

module.exports = new DB(connection);
