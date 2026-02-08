const express = require("express")
const app = express()
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const db = new sqlite3.Database('./database.db')

app.use(express.json())

db.serialize(()=>{
    db.run(`create table if not exists users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            token TEXT DEFAULT NULL
        )`)
})

app.post('/users', async (req, res) =>{
    const {username, password} = req.body
    
    const hasspassword = await bcrypt.hash(password, 10)
    const query = `insert into users (username, password)
    values('${username}', '${hasspassword}')`
    const response = await db.run(query)
    res.send({id : response.lastID})
    
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

app.listen(5000, ()=> {
    console.log("server running")
})