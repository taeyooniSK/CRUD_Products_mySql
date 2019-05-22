const express = require("express");
const router = express.Router();
const db = require("../db/db");

const { isLoggedIn } = require("../middleware"); 

// Show whole info of user

router.get("/", isLoggedIn, (req, res) => {
    // if there is a data, products will be shown. Otherwise, "No data" shows up in the template
    db.query("SELECT * FROM products WHERE user_id = ?", [req.user.id], (err, result) => {
        if (err) console.log(err);
            
            res.render("dashboard", {
                name: req.user.username,
                products: result
            });
            req.flash("success", "You are successfully logged in");
    });
});

// Create product in DB
router.post("/", isLoggedIn, (req, res) => {
    const { name, price, amount, total_price, description } = req.body;
    const user_id = req.user.id;
    const query = "INSERT INTO products (name, user_id, price, amount, total_price, description) VALUES(?, ?, ?, ?, ?, ?)";
    db.query(query, [name, user_id, price, amount, total_price, description], (err, result) => {
        console.log(result);
        if (err) console.log(err);
            req.flash("success", "The data is successfully saved in DB");
            res.redirect("/dashboard");
    });
});


// Show a product edit form
router.get("/products/:product_id/edit", isLoggedIn, (req, res) => {
    const product_id = req.params.product_id;
    const user_id = req.user.id;
    db.query("SELECT * FROM products WHERE id = ? && user_id = ?", [product_id, user_id], (err, result) => {
        const { name, price, amount, total_price, description } = result[0];
        if (err) console.log(err);
            res.render("product_edit", {
                product_id,
                name,
                price,
                amount,
                total_price,
                description
            });
        
    });
});


// Update 
router.put("/products/:product_id", isLoggedIn, (req, res) => {
    const { name, price, amount, total_price, description } = req.body;
    const user_id = req.user.id;
    const product_id = req.params.product_id;
    const query = "UPDATE products SET name = ?, price = ?, amount = ?, total_price = ?, description = ? WHERE id = ? && user_id = ?";
    db.query(query, [name, price, amount, total_price, description, product_id, user_id], (err, result) => {
        if (err) console.log(err);
        console.log(result);
        req.flash("success", "The data is updated");
        res.redirect("/dashboard");
    });
});


// Delete  
router.delete("/products/:product_id", isLoggedIn, (req, res) => {
    const product_id = req.params.product_id;
    const user_id = req.user.id;
    const query = "DELETE from products WHERE id = ? && user_id = ?";
    db.query(query, [product_id, user_id], (err, result) => {
        if (err) console.log(err);
        console.log(result);
        req.flash("success", "The data is deleted");
        res.redirect("/dashboard");
    });
});


module.exports = router;