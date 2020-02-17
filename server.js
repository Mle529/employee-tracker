// Var to link the inquirer and mySql database
var mysql = require("mysql");
var inquirer = require("inquirer");

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
            message: "Would you like to view, add, update, or exit?",
            choices: [
                "VIEW",
                "ADD",
                "DELETE",
                "EXIT"
            ]

        }).then(function (answers) {
            if (answers.userOptions === "VIEW") {
                viewInfo();
            }
            else if (answers.userOptions === "ADD") {
                addInfo();
            }
            else if (answers.userOptions === "DELETE") {
                deleteInfo();
            }
            else {
                connection.end();
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

function addDepartment() {
    inquirer
        .prompt({
            name: "addDepart",
            type: "input",
            message: "What is the name of the department you would like to add?"
        })
        .then(function (answer) {
            connection.query(
                "INSERT INTO department set ?", {
                title: answer.addDepart
            },
                function (err) {
                    if (err) throw err;
                    start();
                }
            );
        });
};

function addRole() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "roleTitle",
                    type: "input",
                    message: "What is the title of the role you want to add?"
                },
                {
                    name: "roleSalary",
                    type: "number",
                    message: "What is the salary for this role?"
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArr = [];

                        for (var i = 0; i < results.length; i++) {
                            choiceArr.push(results[i].title);
                        }
                        return choiceArr;
                    },
                    message: "What is the department for this role?"
                },

            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        department_id: chosenItem.id
                    },
                    function (err) {
                        if (err) throw err;
                        start();
                    }
                );
            });
    });

};

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
                    type: "rawlist",
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
                    "INSERT INTO role SET ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: chosenItem.id,
                        manager_id: answer.managerID
                    },
                    function (err) {
                        if (err) throw err;
                        start();
                    }
                );
            });
    })
};

function viewInfo() {
    inquirer
        .prompt({
            name: "viewAllInfo",
            type: "list",
            message: "Would you like to view Departments, roles, or employees?",
            choices: [
                "DEPARTMENTS",
                "ROLES",
                "EMPLOYEES",
                "EXIT"
            ]
        })
        .then(function (answer) {
            if (answer.viewAllInfo === "DEPARTMENTS") {
                viewDepartInfo();
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

function viewDepartInfo() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(" " + res[i].id + " - " + res[i].title);

        }
        start();
    });
};

function viewRoleInfo() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Role id: " + res[i].id + " " + "Title " + res[i].title + " " + "Salary " + res[i].salary + " " + "Department ID " + res[i].department_id);

        }
        start();
    });
};

function viewEmployeetInfo() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " - " + res[i].first_name + res[i].last_name + " -- Role ID: " + res[i].role_id + " " + " -- Manager ID: " + res[i].manager_id);

        }
        start();
    });
};

function updateInfo() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArr = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArr.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return choiceArr;
                    },
                    message: "Which employee would you like to update?"
                },
                {
                    name: "newRole",
                    type: "list",
                    message: "What would you like to update their role to? [1]Engineer [2]Sales [3]Legal [4]Finance",
                    choices: [1, 2, 3, 4]
                }

            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].last_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: answer.newRole
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        start();
                    }
                )
            });
    });
};