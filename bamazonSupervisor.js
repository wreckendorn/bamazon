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
    console.log("                        (( Supervisor portal ))                          ".bgYellow);
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
                choices: ["View product sales by department","Create new department"]
            }

    ]).then(function(answer) {
        var job = answer.askFunction;
        if (job === "View product sales by department"){
        productSalesReport();
        }
        else if (job === "Create new department") {
        addDepartment();
        }
        
    });

}

//grabs all data from products table
function productSalesReport() {
    var totalProfit = 0;
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales ";
    query += "FROM departments ";
    query += "INNER JOIN products ";
    query += "ON departments.department_name=products.department_name ";
    query += "GROUP BY department_name "
    query += "ORDER BY department_id;";
    connection.query(query, function(err, res) {
        var table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit']
          , colWidths: [19, 21, 21, 15, 18]
        });
        for (var i = 0; i < res.length; i++) {
            totalProfit = res[i].product_sales - res[i].over_head_costs;
            table.push(
                [res[i].department_id, res[i].department_name, "$" + res[i].over_head_costs, "$" + res[i].product_sales, "$" + totalProfit]
            );
        };
        console.log(table.toString());
        console.log("\n");
        continueSupervising();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "newDepartment",
                type: "input",
                message: "What is the name of this new department?"
            },
           {
               name: "newOverhead",
               type: "input",
               message: "How much is the overhead for this department?"
           }

    ]).then(function(answer) {
        var newDepartment = answer.newDepartment;
        var newOverhead = parseFloat(answer.newOverhead);

        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: newDepartment, 
                over_head_costs: newOverhead
            },
            function(err) {
                if (err) throw err;
                console.log("This department has been added")
                console.log("\n");
                continueSupervising();
            }   
        );   
    });
}

function continueSupervising() {
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
                endSupervising();
            }
        });
}

function endSupervising() {
    console.log("Ending session now. Bye");
    console.log("\n");
    connection.end();
}