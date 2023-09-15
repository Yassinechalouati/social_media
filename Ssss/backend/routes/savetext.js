require("dotenv").config()
const express = require("express")
const router = express.Router()
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')



router.post('/insertext', (req, res) => {
    const token = req.body.token
    const receiver = req.body.receiver
    const message = req.body.message
    const image = req.body.image

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(500).json({message:"Internal server Error"})
        }
        else {
            const {userId} = decoded
            console.log(decoded)
            mysql.query(`SELECT id FROM user where username=?`, [receiver], (err, result) => {
                if (err) {
                    res.status(500).json({message:"Internal server Error"})
                }
                else {
                    const receiver_id = result[0].id
                        mysql.query(`INSERT INTO chat(sender_id, receiver_id, message, seen, receiver_Liked, sender_Liked, image_sent) VALUES(?, ?, ?, 0, 0, 0, ?)`, [userId, receiver_id, message, image], (error, result) => {
                            if (error) {
                                console.log(error)
                                res.json({message:error})
                            }
                            else {
                                console.log(result)
                                res.json({message: "Message Sent !"})
                            }
                        })

                    
                    
                }
            })
        }
    })
})

module.exports = router