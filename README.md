# bamazon

This is a Node.js app that uses mySQL for the relational database and inquirer for the user input/prompts. The app allows users to purchase items from the store, and checks to ensure the inventory can fulfill the order. 

There are three versions of the app: one for the customer, one for the manager, and one for the supervisor.

## Customer View
The customer app will allow the user to purchase an item from the inventory displayed using an ID number. They can then enter in a quantity and the app will determine if there is enough in the inventory to fulfill the order. If there's not, the user will be notified and they can choose to either quit or make another purchase. If the order is fulfilled, then the inventory reflects the items sold and lets the user know how much the items were.

[![CustomerViewVideo](https://img.youtube.com/vi/U76Re2yoxYg/0.jpg)](https://www.youtube.com/watch?v=U76Re2yoxYg)

## Manager View
The manager app will allow the user to choose between viewing the products for sale, viewing if any inventory items have less than 5 in stock, adding more items of a product to the inventory, or adding a new product. 

[![ManagerViewVideo](https://img.youtube.com/vi/fQRBZ4W8fic/0.jpg)](https://www.youtube.com/watch?v=fQRBZ4W8fic)

## Supervisor View
The supervisor app calculates the total profile by subtracting the overhead from the product_sales column.  It also allows a new department to be added to the database.

[![SupervisorViewVideo](https://img.youtube.com/vi/o_h-UEyATVI/0.jpg)](https://www.youtube.com/watch?v=o_h-UEyATVI)

To get started, follow these steps:
1. clone the app
1. Navigate to the folder in the command line
1. Run npm install to install all necessary dependencies
1. Run the customer or manager app with "node [app].js"

I am the sole contributor on this project and will maintain it. You can reach me at thechrisheckendorn@gmail.com for any questions.
