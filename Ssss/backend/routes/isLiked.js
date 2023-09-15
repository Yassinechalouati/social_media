require("dotenv").config();
const express = require("express")
const jwt = require("jsonwebtoken")
const mysql = require('../helpers/Sql_connection')
const router = express.Router()


router.post('/isLiked' , (req, res) => {
   const token = req.body.token
   const id = req.body.id
   const type = req.body.type

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    
    if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Token Error' });
    }
    else {
        const {userId, username} = decoded
        console.log("post_id: ", id, "userId: ", userId)
        if (type === 'posts_likes') {
            mysql.query(`SELECT * FROM posts_likes where post_id = ? and id = ?`, [id, userId], (error, results) => {
                if (error ) {
                    console.error(error)
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                else {
                    console.log("posts: ", results[0])
                    return res.json({ message: results[0] });
                }
            })

        }
        else if (type==='story_likes'){
            mysql.query('SELECT * FROM story_likes where story_id = ? and user_id = ?', [id, userId], (error, results) => {
                if (error) {
                    console.error(error)
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                else {
                    console.log("stories: ", results[0])
                    return res.json({message: results[0]})
                }
            })
        }
    }
   })
})

module.exports = router