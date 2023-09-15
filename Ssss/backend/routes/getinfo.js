require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

router.post('/info',(req, res) => {
    const token = req.body.token
    console.log(token)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.error(err);
        } else {
          const {username} = decoded;
          console.log(decoded)
          mysql.query('SELECT * FROM user where username = ?', [username], (err, result) => {
            if (err){
                console.log(err)
                res.status(500).json({message: 'Internal server Eror'})
            }
            else if(result.length > 0){
                res.json({message: result[0].pfp})
            }
            else {
                res.json({message: 'User Doesnt exist'})
            }
        })
        }
      });


    
})

module.exports = router