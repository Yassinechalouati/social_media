require("dotenv").config()
const express = require("express")
const router = express.Router()
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

router.post('/loadchat', (req, res) => {
    const token = req.body.token
    const friend = req.body.username
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            console.log(err)
            res.status(500).json({message:"Internal server Error"})
        }
        else{
            const {userId} = decoded
           
            mysql.query('SELECT id FROM user where username = ?', [friend], (err, result) => { 
                if (err) {
                    console.log(err)
                    res.status(500).json({message: "Internal server Error"})
                }
                else {
                    const id = result[0].id
                    console.log(id)
                    console.log(userId)
                    mysql.query(`SELECT DISTINCT  t1.message_id, t1.sender_id , SENDER, t1.receiver_id, RECEIVER, t1.message, t1.sentAt,  t1.seen, t1.receiver_liked, t1.sender_liked, t1.image_sent, t1.seen_time
                    FROM (
                    SELECT  chat.message_id, chat.sender_id, user.username AS SENDER, chat.receiver_id, chat.message, user.pfp AS sender_pfp, sentAt, seen, receiver_liked, sender_liked, image_sent, seen_time  FROM chat, user where chat.sender_id = user.id 
                    ) AS t1
                    JOIN 
                    (
                    SELECT  chat.message_id, chat.sender_id, chat.receiver_id, user.username AS RECEIVER, chat.message, user.pfp AS receiver_pfp, sentAt, seen, receiver_liked, sender_liked, image_sent, seen_time  FROM chat, user where chat.receiver_id = user.id 
                    ) AS T2 where t1.sender_id = T2.sender_id  AND t1.receiver_id = t2.receiver_id AND ( (t1.sender_id= ? and t1.receiver_id=? ) or (t1.sender_id= ? and t1.receiver_id = ?)) order by t1.sentAt ASC
                    `, [userId, id, id ,userId], (error, resu )=> {
                        if (error) {
                            console.log(error)
                            res.status(500).json({message: "Internal Server Error"})
                        }
                        else if(resu.length >= 0){
                            res.json({message: resu})
                        }
                        else {
                            res.json({message: "No messages!"})
                        }
                    })

                }

            })
        }
    })
})

module.exports = router