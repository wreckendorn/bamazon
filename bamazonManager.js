var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');



var connection = mysql.createConnection({
    host: "localhost",
    port: 8880,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("\n");
    console.log("\n");
    console.log("\n");
    console.log("               =========== WELCOME TO BAMAZON ===============            ".inverse);
    console.log("                        (( manager portal ))                             ".bgYellow);
    console.log("\n");
    askUser();
});

// function that allows user to choose a task
function askUser() {
    inquirer
        .prompt([
            {
                name: "askFunction",
                type: "list",
                message: "What would you like to do?",
                choices: ["View products for sale","View low inventory", "Add to Inventory", "Add new product"]
            }

    ]).then(function(answer) {
        var job = answer.askFunction;
        if (job === "View products for sale"){
        showInventory(job);
        }
        else if (job === "View low inventory") {
        lowInventory();
        }
        else if (job === "Add to Inventory") {
            addInventory();
        }
        else if (job === "Add new product") {
            addNewProduct();
        }
        
    });

}

//function show the current inventory
function showInventory(job) {
    console.log("Your answer was " + job);
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.log("                           CURRENT INVENTORY                              ".bgRed.white);
        console.log("\n");
        console.log("\n");
// build our table using table NPM
        var table = new Table({
            head: ['Item ID', 'Product', 'Price', 'Quantity']
          , colWidths: [20, 21, 25, 17]
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
            );
        };
        console.log(table.toString());
        console.log("\n");
        console.log("\n");
        continueManaging();
    });
   
}

// function that displays any product that has less than five items in inventory
function lowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        var table = new Table({
            head: ['Item ID', 'Product', 'Price', 'Quantity']
          , colWidths: [20, 21, 25, 17]
        });
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
                );
            }

        }
        console.log(table.toString());
        console.log("\n");
        continueManaging();
    })
    
}

// function that allows user to add more items of a specific product
function addInventory() {
    var itemID = 0;
    var numItems = 0;
    inquirer
        .prompt([
            {
                name: "whichProduct",
                type: "input",
                message: "What is the Item ID?"
            },
            {
                name: "numberToAdd",
                type: "input",
                message: "How many do you want to add?"
            }

    ]).then(function(answer) {
        itemID = parseInt(answer.whichProduct);
        numItems = parseInt(answer.numberToAdd);
        updateInventory(itemID, numItems);
    });
    
    
}

function updateInventory(itemID, numItems) {
    var newNum = 0;
    var itemID = itemID;
    connection.query(
        "SELECT * FROM products WHERE ?", { item_id: itemID }, function(err, res) {
          if (err) throw err;
        currentNum = parseInt(res[0].stock_quantity);
        newNum = currentNum + numItems;
        processInventory(itemID, newNum);
        }
      )   
}

function processInventory(itemID, newNum) {
    var newNum = newNum;
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newNum
            },
            {
                item_id: itemID
            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log("\n");
            console.log("Updating inventory...");
            console.log("\n");
            continueManaging();
    });
    
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "newProduct",
                type: "input",
                message: "What is the name of this new product?"
            },
           {
               name: "newPrice",
               type: "input",
               message: "What's the price?"
           }, 
           {
               name: "newCount",
               type: "input",
               message: "How many items do we have of this product?"
           },
           {
               name: "newDepartment",
               type: "input",
               message: "Which department does this belong to?"
           }


    ]).then(function(answer) {
        var newProduct = answer.newProduct;
        var newPrice = parseFloat(answer.newPrice);
        var newDepartment = answer.newDepartment;
        var newCount = parseInt(answer.newCount);
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: newProduct, 
                department_name: newDepartment, 
                price: newPrice, 
                stock_quantity: newCount
            },
            function(err) {
                if (err) throw err;
                console.log("This item has been added")
                console.log("\n");
                continueManaging();
            }   
        );   
    });
}

//function that asks the user if they want to do another task or end their session
function continueManaging() {
    inquirer
        .prompt({
            name: "anotherRound",
            type: "confirm",
            message: "Do you want to run another task?"
        })
        .then(function(answer) {
            if (answer.anotherRound == true) {
                console.log("\n");
                askUser();
            }
            else {
                console.log("\n");
                endManaging();
            }
        });
}

//function to end the session
function endManaging() {
    console.log("Ending session now. Bye");
    console.log("\n");
    connection.end();
}