require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

router.post('/signin', (req, res) => {
    const username = req.body.username
    const pword = req.body.pword

    mysql.query('SELECT * FROM user where BINARY username=?', [username], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json ({message :'Internal server error'})
        }
        else if (result.length == 0 ){
            console.log(result)
            res.json({message: "Wrong username !"})
        }
        else {
            const user = result[0]
            bcrypt.compare(pword, user.pword)
            .then(match => {
                if (!match)  {
                    console.log(user)
                    res.json({message:"Wrong password !"})
                }
                else {
                    const token = jwt.sign( 
                        { username: user.username, userId: user.id },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '1h' } 
                    )
                    res.status(200).json({message: "Welcome "+user.username , token: token})

                }
            })
            .catch (err => {
                console.error(err)
                res.status(500).json({message:"Internal server Error"})
            })
        }
    })
})

module.exports = router