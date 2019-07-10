const express = require("express");
const router = express.Router();
const db = require("../db/db");

const { isLoggedIn } = require("../middleware"); 

// Show whole info of user


router.get("/", isLoggedIn, (req, res) => {
    // make a function in Date.prototype so that I can use it as a method
    Date.prototype.yyyymmdd = function (){
        const yyyy = this.getFullYear(); 
        const mm = this.getMonth() + 1; // getMonth() is 0 based
        const dd = this.getDate();

        return [yyyy, (mm > 9 ? "" : "0" ) + mm, (dd > 9 ? "" : "0" ) + dd].join("-");
    };

    const user_id = req.user.id;
    const date = new Date();
    const today = date.yyyymmdd(); 
    
    // if there is a data, products will be shown. Otherwise, "No data" shows up in the template
    const q = "SELECT * FROM products WHERE user_id = ?;" +
              "SELECT MIN(price) AS min_price FROM products WHERE user_id = ? && type='P' && DATE_FORMAT(created_at, '%Y-%m-%d') = ?;" +
              "SELECT SUM(total_price) AS total_price FROM products WHERE user_id = ? && type='P' && DATE_FORMAT(created_at, '%Y-%m-%d') = ?;" +
              "SELECT SUM(total_price) AS total_price FROM products WHERE user_id = ? && type='P' && DATE(created_at) >= DATE_SUB(DATE(NOW()), INTERVAL 7 DAY);" +
              "SELECT MIN(price) AS min_price FROM products WHERE user_id = ? && type='S' && DATE_FORMAT(created_at, '%Y-%m-%d') = ?;" +
              "SELECT SUM(total_price) AS total_price FROM products WHERE user_id = ? && type='S' && DATE_FORMAT(created_at, '%Y-%m-%d') = ?;" +
              "SELECT SUM(total_price) AS total_price FROM products WHERE user_id = ? && type='S' && DATE(created_at) >= DATE_SUB(DATE(NOW()), INTERVAL 7 DAY);" +
              "SELECT SUM(total_price) AS total_price, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM products WHERE user_id = ? && type='P' && DATE(created_at) >= DATE_SUB(DATE(NOW()), INTERVAL 7 DAY) group by DATE_FORMAT(created_at,'%Y-%m-%d') ORDER BY DATE_FORMAT(created_at, '%Y-%m-%d');" +
              "SELECT SUM(total_price) AS total_price, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM products WHERE user_id = ? && type='S' && DATE(created_at) >= DATE_SUB(DATE(NOW()), INTERVAL 7 DAY) group by DATE_FORMAT(created_at,'%Y-%m-%d') ORDER BY DATE_FORMAT(created_at, '%Y-%m-%d');"
    db.query(q, [user_id, user_id, today, user_id, today, user_id, user_id, today, user_id, today, user_id, user_id, user_id], (err, result) => {
        if (err) console.log(err);
            console.log(result);
            res.render("dashboard", {
                name: req.user.username,
                products: result
            });
            req.flash("success", "You are successfully logged in");
    });
});


module.exports = router;