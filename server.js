// Var to link the inquirer and mySql database
var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Bootcamp1234",
    database: "employeesDB"
});

// connect to the mysql server and sql database--//
connection.connect(function (err) {

    if (err) throw err;

    start();
});

// function to start the app and prompt the user
function start() {
    inquirer
        .prompt({
            name: "userOptions",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "VIEW",
                "ADD",
                "UPDATE",
                "EXIT"
            ]

        }).then(function (answers) {
            if (answers.userOptions === "VIEW") {
                viewInfo();
            }
            else if (answers.userOptions === "ADD") {
                addInfo();
            }
            else if (answers.userOptions === "UPDATE") {
                updateInfo();
            }
            else {
                connection.end();
                console.log("Thank you for using the app!");
            }
        });
}

// function if user chooses to add info to the database
function addInfo() {
    inquirer
        .prompt({
            name: "addOption",
            type: "list",
            message: "Would you like to add a Department, Role, or Employee?",
            choices: [
                "DEPARTMENT",
                "ROLE",
                "EMPLOYEE",
                "EXIT"
            ]
        }).then(function (answers) {
            if (answers.addOption === "DEPARTMENT") {
                addDepartment();
            }
            else if (answers.addOption === "ROLE") {
                addRole();
            }
            else if (answers.addOption === "EMPLOYEE") {
                addEmployee();
            }
            else {
                start();
            }
        });
}

// Allow user to add a new department
function addDepartment() {
    inquirer
        .prompt({
            name: "addDepartment",
            type: "input",
            message: "What is the name of the department you would like to add?",
        })
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.addDepartment
                },
                function (err) {
                    if (err) throw err;

                    console.log(`${answer.addDepartment} added to the list of departments.`)
                    start();
                }
            );
        });
};

// Allow user to add a new role
function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log(res)
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the role you want to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for this role?"
                },
                {
                    name: "department",
                    type: "list",
                    message: "What is the department for this role?",
                    choices: function () {
                        var depArr = [];

                        for (var i = 0; i < res.length; i++) {
                            depArr.push(res[i].name);

                        }
                        return depArr;
                    }
                }

            ])
            .then(function (answer) {
                connection.query("SELECT id FROM department WHERE department = ?", answer.department, function (err, res) {
                    if (err) throw err;

                    connection.query("INSERT INTO role SET ?",
                        {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: res[0].id
                        },
                        function (err) {
                            if (err) throw err;

                            console.log(`${answer.title} added to the list of roles.`)

                            start();
                        }
                    );
                });
            });
    });

};

// Allow user to add a new employee
function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choiceArr = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArr.push(results[i].title);
                        }
                        return choiceArr;
                    },
                    message: "What is the employee's role ID?"
                },
                {
                    name: "managerID",
                    type: "number",
                    message: "What is the employee's manager ID?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: chosenItem.id,
                        manager_id: answer.managerID
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`${answer.firstName} ${answer.lastName} has been added to the list of employees`);

                        start();
                    }
                );
            });
    })
};

// Lets user view info for each table
function viewInfo() {
    inquirer
        .prompt({
            name: "viewAllInfo",
            type: "list",
            message: "Would you like to view Department, Roles, or Employees?",
            choices: [
                "DEPARTMENT",
                "ROLES",
                "EMPLOYEES",
                "EXIT"
            ]
        })
        .then(function (answer) {
            if (answer.viewAllInfo === "DEPARTMENT") {
                viewDepartmentInfo();
            }
            else if (answer.viewAllInfo === "ROLES") {
                viewRoleInfo();
            }
            else if (answer.viewAllInfo === "EMPLOYEES") {
                viewEmployeeInfo();
            }
            else {
                start();
            }
        });
}

function viewDepartmentInfo() {
    connection.query("SELECT * FROM department ORDER BY id", function (err, depRes) {
        if (err) throw err;
        console.log("\n");
        console.table(depRes);

        start();
    });
};

function viewRoleInfo() {
    connection.query("SELECT * FROM role ORDER BY id", function (err, roleRes) {
        if (err) throw err;
        console.log("\n");
        console.table(roleRes);
        start();
    });
};

function viewEmployeeInfo() {
    connection.query("SELECT * FROM employee ORDER BY id", function (err, empRes) {
        if (err) throw err;
        console.log("\n");
        console.table(empRes);
        start();
    });
};

// allow user to update the role of an employee
function updateInfo() {
    connection.query("SELECT concat(first_name, ' ', last_name) AS full_name FROM employee", function (err, empRes) {
        if (err) throw err;

        connection.query("SELECT title FROM role", function (err, roleRes) {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < empRes.length; i++)
                            empArray.push(empRes[i].full_name);
                        return empArray;
                    }
                },
                {
                    name: "role",
                    type: "list",
                    message: "Choose employee's new role.",
                    choices: function () {
                        let roleArray = [];
                        for (let i = 0; i < roleRes.length; i++)
                            roleArray.push(roleRes[i].title);
                        return roleArray;
                    }
                }
            ]).then(function (answer) {
                connection.query("SELECT id FROM role WHERE title = ?", answer.role, function (err, roleIdRes) {
                    if (err) throw err;

                    connection.query("UPDATE employee SET role_id = ? WHERE concat(first_name, ' ', last_name) = ?",
                        [roleIdRes[0].id, answer.employee],
                        function (err) {
                            if (err) throw err;

                            console.log(`${answer.employee}'s role has been updated to ${answer.role}.`)

                            start();
                        }
                    );
                });
            });
        });
    });
}