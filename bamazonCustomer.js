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
    console.log("        =========== WELCOME TO BAMAZON ===============         ".inverse);
    console.log("\n");
    afterConnection();
});

function afterConnection() {
    var table = new Table({
        head: ['Item ID', 'Product', 'Price']
      , colWidths: [20, 21, 25]
    });
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.log("                 HERE ARE TODAY'S PRODUCTS                      ".bgRed.white);
        console.log("\n");
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, "$" + res[i].price, ]
            );
            
        }
        console.log(table.toString());
            console.log("\n");
        askUser();
    })
 
}

//asks user what item ID they want to purchase and how many
function askUser() {
inquirer
    .prompt([
        {
            name: "askID",
            type: "input",
            message: "What is the Item ID for the product you'd like to buy?",
        },
        {
            name: "askUnits",
            type: "input",
            message: "How many units?"
        }

        
]).then(function(answer) {
    //select the products table itemID column
   connection.query("SELECT * FROM products WHERE ?", { item_id: answer.askID }, function(err, res) {
    //set variable for itemID from user
    var iD = answer.askID;   
    //set variable for number of units user wants to buy
    var quantityWanted = answer.askUnits;
    //set variable for number of units currently in stock
    var quantityHave = res[0].stock_quantity;
    var productSales = res[0].product_sales;
    if(err) throw err;
    //if there's enough inventory
    if (quantityHave > quantityWanted) {
        //set variable for number of units left after user makes their purchase
        var quantityLeft = quantityHave - quantityWanted;
        //sets variable for final cost(number of units they are purchasing x price of unit)
        var totalCost = quantityWanted * res[0].price;
        var totalSales = productSales + totalCost;
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log("    S O L D!  S O L D!   S O L D!   S O L D!".rainbow);
        console.log("\n");
        console.log("\n");
        console.log("\n");
        console.log("Your total cost is: $" + totalCost);
        console.log("\n");
        //calls function to update stock_quantity
        updateInventory(iD, quantityLeft, totalSales);
    }
    else {
        console.log("I'm sorry - we can't accommodate this request.");
        //if there's not enough inventory, ask them if they want to continue shopping
        continueShopping();
    }
   });
     
});

}
//updates stock_quantity
function updateInventory(iD, quantityLeft, totalSales) {
    connection.query("UPDATE products SET ? WHERE ?", 
    [
        {
            stock_quantity: quantityLeft
        },
        {
            item_id: iD
        }
    ],
    function(err, res) {
        if (err) throw err;
        console.log("Updating inventory...");
        console.log("\n");
        console.log("\n");
 //calls function to update totalSales
    updateTotalSales(iD, totalSales);
    });
   
}

//updates total Sales
function updateTotalSales(iD, totalSales) {
    connection.query("UPDATE products SET ? WHERE ?", 
    [
        {
            product_sales: totalSales
        },
        {
            item_id: iD
        }
    ],
    function(err, res) {
        if (err) throw err;
    // calls function to continue shopping
    continueShopping();
    });
 
}


function continueShopping() {
    inquirer
        .prompt({
            name: "anotherRound",
            type: "confirm",
            message: "Do you want to continue shopping?"
        })
        .then(function(answer) {
            if (answer.anotherRound == true) {
                afterConnection();
            }
            else {
                endShopping();
            }
        });
}

function endShopping() {
    console.log("\n");
    console.log("Thank you for shopping with us. Come back again soon.");
    console.log("\n");
    connection.end();
}