var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("=========== WELCOME TO BAMAZON ===============");
    console.log("\n");
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.log("=========== Here are today's products ===============");
        console.log("\n");
        console.log("\n");
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Product: " +
                res[i].product_name +
                " || Price: " +
                res[i].price + 
                " || Item ID: " + 
                res[i].item_id);
            console.log("\n");
        }
        askUser();
    })
 
}

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
    console.log(answer.askID);
   connection.query("SELECT * FROM products WHERE ?", { item_id: answer.askID }, function(err, res) {
    var iD = answer.askID;   
    var quantityWanted = answer.askUnits;
    var quantityHave = res[0].stock_quantity;
    if(err) throw err;
       if (quantityHave > quantityWanted) {
           var quantityLeft = quantityHave - quantityWanted;
           var totalCost = quantityWanted * res[0].price;
           console.log("SOLD!");
           console.log("Your total cost is:" + totalCost);
           updateInventory(iD, quantityLeft);
       }
       else {
           console.log("I'm sorry - we can't accommodate this request.")
            continueShopping();
       }
   });
     
});

}

function updateInventory(iD, quantityLeft) {
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
    });
    continueShopping();
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
    console.log("Thank you for shopping with us. Come back again soon.");
    connection.end();
}