USE employeesDB;

INSERT INTO department
    (title)
VALUES
    ("Engineering"),
    ("Sales"),
    ("Legal"),
    ("Finance");

INSERT INTO 
    role
    (title, salary, department_id)
VALUES
    ("Sales Lead", 90000, 1),
    ("Salesperson", 70000, 1),
    ("Lead Engineer", 125000, 2),
    ("Engineer", 100000, 2),
    ("Assistant Accountant", 80000, 3),
    ("Accountant", 100000, 3),
    ("Legal Senior Advisor", 150000, 4),
    ("Lawyer", 120000, 4);

