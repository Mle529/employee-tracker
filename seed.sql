USE employeesDB;

INSERT INTO department
    (title)
VALUES
    ("Engineering"),
    ("Sales"),
    ("Legal"),
    ("Finance");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Engineer", 120000, 1),
    ("Sales", 80000, 2),
    ("Legal", 190000, 3),
    ("Finance", 125000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Scott", 1, 2),
    ("Jim", "Halpert", 2, 3),
    ("Pam", "Beesly", 2, 1),
    ("Dwight", "Schrute", 2, 1),
    ("Leslie", "Knope", 3, 2);
