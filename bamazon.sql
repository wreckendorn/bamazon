DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;
CREATE TABLE products (
    item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL
    PRIMARY KEY(item_id);
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fridge filter", "Kitchen", 39.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Socks", "Clothing", 4.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Multi-vitamin", "Health & Beauty", 19.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rainbow flip-flops", "Clothing", 25.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Epic protein bar", "Grocery", 2.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("5-piece pyrex set", "Kitchen", 99.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tent", "Outdoors", 69.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("50qt YETI cooler", "Outdoors", 199.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tarp", "Outdoors", 9.99, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("sleeping bag", "Outdoors", 39.99, 8);