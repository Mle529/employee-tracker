DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department
(
    id INT NOT NULL
    AUTO_INCREMENT,
    title VARCHAR
    (45) NOT NULL,
    PRIMARY KEY
    (id)
);

    CREATE TABLE role
    (
        id INT NOT NULL
        AUTO_INCREMENT,
    title VARCHAR
        (45) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
        (id)
);

        CREATE TABLE employee
        (
            id INT NOT NULL
            AUTO_INCREMENT,
    first_name VARCHAR
            (45) NOT NULL,
    last_name VARCHAR
            (45) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY
            (id)
);