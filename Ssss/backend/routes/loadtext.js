require("dotenv").config()
const express = require("express")
const router = express.Router()
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

router.post('/loaddata', (req, res) => {
    const token = req.body.token

    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(500).json({message: "Internal Server Error"})
        }
        else {
            const {userId} = decoded

            mysql.query(`SELECT
            c.contact_id,
            c.last_sentAt,
            CASE
                WHEN c.sender_id = ? THEN 'User'
                ELSE 'Other'
            END AS last_sender,
            c.message,
            c.image_sent,
            u.username,
            u.pfp,
            c.message_id,
            u.isActive, 
            c.seen,
            c.receiver_Liked
        FROM
            (
                SELECT
                    CASE
                        WHEN m1.sender_id = ? THEN m1.receiver_id
                        ELSE m1.sender_id
                    END AS contact_id,
                    m1.sender_id,
                    m1.receiver_id,
                    m1.sentAt AS last_sentAt,
                    m1.message,
                    m1.image_sent,
                    m1.message_id,
                    m1.seen, 
                    m1.receiver_Liked
                FROM
                    chat AS m1
                LEFT JOIN
                    chat AS m2 ON (
                        (m1.sender_id = m2.sender_id AND m1.receiver_id = m2.receiver_id)
                        OR (m1.sender_id = m2.receiver_id AND m1.receiver_id = m2.sender_id)
                    )
                    AND m1.sentAt < m2.sentAt
                WHERE
                    m1.sender_id = ? OR m1.receiver_id = ?
                GROUP BY
                    contact_id,
                    m1.sender_id,
                    m1.receiver_id,
                    m1.sentAt,
                    m1.message,
                    m1.image_sent,
                    m1.message_id,
                    m1.seen, 
                    m1.receiver_Liked
                HAVING
                    COUNT(m2.message_id) = 0
            ) AS c
        JOIN
            user AS u ON c.contact_id = u.id
        ORDER BY
            c.last_sentAt DESC;
        `, [userId, userId, userId, userId], (err, result) => {
                if (err) {
                    res.status(500).json({message: "Internal Server Error", error: err})
                }
                else {
                    res.json({message: result})
                   
                }
            })
            
        }
    })
})

module.exports= router