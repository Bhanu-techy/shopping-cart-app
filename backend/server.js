const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const db = new sqlite3.Database('./database.db');
const cors=require('cors');

app.use(cors());
app.use(express.json());

db.serialize(()=>{
   db.run("PRAGMA foreign_keys = ON");
});

// POST API to add new user
app.post('/users', async (req, res) =>{
    const {username, password} = req.body
    
    const hasspassword = await bcrypt.hash(password, 10)
    db.get(`select * from users where username = '${username}'`, async (err, user)=>{
        if (err) return res.json({error : err})
        if (user === undefined){
            const query = `insert into users (username, password)
            values ('${username}', '${hasspassword}')`
            const response = await db.run(query)
            return res.json({id : response.lastID})
        }else{
            return res.json({message : "User already exists"})
        }
    })
})

// GET API to get all users
app.get('/users', async (req, res)=>{
    db.all(`select * from users`,(err, rows)=>{
        if (err) return res.status(500).json({error: "Err"})
        res.json(rows)
    })
})

// POST API to login user
app.post('/users/login', async (req, res)=>{
    const {username, password}= req.body

    db.get(`select * from users where username = '${username}'`, async (err, user)=>{
        if (err) return res.json({error : err})
        if (user === undefined){
            return res.status(400).json({error_msg : "Invalid User"});
        }else{
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            
            if (isPasswordMatched){
                const payload = {username,};
                const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
                
                if(user.token === null){
                db.run(`UPDATE users SET token = ? WHERE username= ?`,[jwtToken, username], (err)=>{
                    if (err) return res.status(500).json({error: 'Token updated failed'})
                    res.json({id : user.id, jwt_token: jwtToken})
                })
                }else{
                    return res.status(400).json({error_msg : "user already logged in on another device"})
                }
            }else{
                res.status(400).json({error_msg : "Invalid Password"})
            }
        }
    })
})

// POST API to logout user
app.post('/users/logout', async (req, res)=>{
    const {userId} = req.body
    db.get(`select * from users where id = ?`, [userId], (err)=>{
        if (err)  return res.json({error : err})
        db.run(`UPDATE users SET token = NULL where id = ?`,[userId], (err)=>{
            if (err) return res.status(500).json({error: 'Logout failed'})
            res.json({message : "Logout success"})
        })
    })
})

// GET API to get list of items
app.get('/items', (req, res)=>{
    db.all(`select * from carts`, (err, rows)=>{
        if (err) return res.json({error : err})
        res.json(rows)
    })
})

// POST API to add cart of a user
app.post('/carts', (req, res)=>{
    const {userId, name, status} = req.body
    db.run(`insert into carts (user_id, name, status) values (?, ?, ?)`, [userId, name, status], (err)=>{
        if (err) return res.json({error : err})
        res.json({message : "Added item to cart successfully"})
    })
})

app.get("/cart/:Id", async (req, res)=>{
    const {Id} = req.params
    db.get(`select * from carts where id = ?`,[Id], (err, row)=>{
        if (err) return res.json({error : err})
        res.json(row)
    })
})

// POST API to add order
app.post('/orders', (req, res)=>{
    const {userId, cartId} = req.body
    db.run(`insert into orders (user_id, cart_id) values (?, ?)`, [userId, cartId], (err)=>{
        if (err) return res.json({error : err})
        res.json({message : "order placed successfully"})
    })
})

// GET API to get order
app.get('/orders', (req, res)=>{
    db.all(`select * from orders`, (err, rows)=>{
        if (err) return res.json({error : err})
        res.json(rows)
    })
})

// GET API
app.get('/orders/checkout', async (req, res)=>{
    db.get(`select * carts where user_id = 1`, (err, rows)=>{
        if (err) return res.json({error : err})
        return res.json(rows)
    })
})

app.listen(5000, ()=> {
    console.log("server running on http://localhost:5000")
})