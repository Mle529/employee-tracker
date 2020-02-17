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
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Accountant", 125000, 3),
    ("Account Manager", 140000, 3),
    ("Legal Team Lead", 190000, 4),
    ("Lawyer", 150000, 4);

