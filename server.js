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