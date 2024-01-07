use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Floor Worker'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Salesperson', 60000, 1),
    ('Floor Worker', 50000, 2),
    ('Accountant', 75000, 3),
    ('Legal Team ', 80000, 4),

INSERT INTO employee
    (first_name, last_name, role_id)
VALUES
    ('John', 'Doe', 1),
    ('Mike', 'Chan', 2),
    ('Ashley', 'Rodriguez', 3),
    ('Kevin', 'Tupik', 4),
    ('Kunal', 'Singh', 5),
    ('Malia', 'Brown', 6),
    ('Sarah', 'Lourd', 7),
    ('Tom', 'Allen', 8);
