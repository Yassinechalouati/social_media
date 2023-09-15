require("dotenv").config();
const express = require("express")
const router = express.Router()
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

router.post('/search', (req, res)=> {
    
    const token = req.body.token
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=> {
        if (err) {
            console.log(err) 
            res.status(500).json({message: "Internal Server Error"})
        }
        else {
            const {userId} =decoded
            mysql.query('SELECT id, isActive, pfp, username FROM user where id <> ?', [userId], (err, result) => {
                if(err){
                    console.log(err)
                    res.status(500).json({message: "Internal Server Error"})
                }
                else{
                    res.json({message: result})
                }
            })
        }
    })
})

module.exports =  router