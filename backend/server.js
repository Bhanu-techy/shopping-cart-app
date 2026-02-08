const express = require("express")
const app = express()
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const db = new sqlite3.Database('./database.db')

app.use(express.json())

db.serialize(()=>{
   db.run("PRAGMA foreign_keys = ON");
   
   
})

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

app.get('/users', async (req, res)=>{
    db.all(`select * from users`,(err, rows)=>{
        if (err) return res.status(500).json({error: "Err"})
        res.json(rows)
    })
})

app.post('/users/login', async (req, res)=>{
    const {username, password}= req.body

    db.get(`select * from users where username = '${username}'`, async (err, user)=>{
        if (err) return res.json({error : err})
        if (user === undefined){
            res.status(400)
            res.json({error_msg : "Invalid User"});
        }else{
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            
            if (isPasswordMatched){
                const payload = {username,};
                const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
                
                if(user.token === null){
                db.run(`UPDATE users SET token = ? WHERE username= ?`,[jwtToken, username], (err)=>{
                    if (err) return res.status(500).json({error: 'Token updated failed'})
                    res.send(user)
                })
                }else{
                    res.json({error_msg : "user already login"})
                }
            }else{
                res.status(400);
                res.json({error_msg : "Invalid Password"})
            }
        }
    })
})

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

app.get('/items', (req, res)=>{
    db.all(`select * from carts`, (err, rows)=>{
        if (err) return res.json({error : err})
        res.json(rows)
    })
})

app.post('/carts', (req, res)=>{
    const {userId, name, status} = req.body
    db.run(`insert into carts (user_id, name, status) values (?, ?, ?)`, [userId, name, status], (err)=>{
        if (err) return res.json({error : err})
        res.json({message : "Added item to cart successfully"})
    })
})


app.post('/orders', (req, res)=>{
    const {userId, cartId} = req.body
    db.run(`insert into orders (user_id, cart_id) values (?, ?)`, [userId, cartId], (err)=>{
        if (err) return res.json({error : err})
        res.json({message : "order placed successfully"})
    })
})

app.get('/orders', (req, res)=>{
    db.all(`select * from orders`, (err, rows)=>{
        if (err) return res.json({error : err})
        res.json(rows)
    })
})

app.get('/orders/checkout', async (req, res)=>{
   
    db.get(`select * carts where user_id = 1`, (err, rows)=>{
        if (err) return res.json({error : err})
        return res.json(rows)
    })
})

app.listen(5000, ()=> {
    console.log("server running")
})