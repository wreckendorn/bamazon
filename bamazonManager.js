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
    console.log("=========== ENTERING MANAGER'S VIEW ===============");
    console.log("\n");
    askUser();
});


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

function showInventory(job) {
    console.log("Your answer was " + job);
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.log("=========== CURRENT INVENTORY ===============");
        console.log("\n");
        console.log("\n");
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Product: " +
                res[i].product_name +
                " || Price: " +
                res[i].price + 
                " || Item ID: " + 
                res[i].item_id + 
                " || Quantity: " +
                res[i].stock_quantity +
                "\n");
        }
        askUser();
    });
   
}

function lowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(
                    "Product: " +
                    res[i].product_name +
                    " || Price: " +
                    res[i].price + 
                    " || Item ID: " + 
                    res[i].item_id + 
                    " || Quantity: " +
                    res[i].stock_quantity +
                    "\n");
            }
        }
        askUser();
    })
    
}

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
    console.log("am i here?");
    var newNum = 0;
    var itemID = itemID;
    connection.query(
        "SELECT * FROM products WHERE ?", { item_id: itemID }, function(err, res) {
          if (err) throw err;
        currentNum = parseInt(res[0].stock_quantity);
        newNum = currentNum + numItems;
        console.log("current Number is " + currentNum);
        console.log("new Number of items is " + newNum);
        processInventory(itemID, newNum);
        }
      )
      
}

function processInventory(itemID, newNum) {
    var newNum = newNum;
    console.log(newNum);
    console.log("We're here");
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
            console.log("Updating inventory...");
            askUser();
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
        console.log("new product is: " + newProduct);
        var newPrice = parseFloat(answer.newPrice);
        console.log("new price is: " + newPrice);
        var newDepartment = answer.newDepartment;
        console.log("new department is: " + newDepartment);
        var newCount = parseInt(answer.newCount);
        console.log("new count is: " + newCount);
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
                askUser();
            }   
        );   
    });
}