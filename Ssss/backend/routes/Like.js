require("dotenv").config();
const express = require("express")
const jwt = require("jsonwebtoken")
const mysql = require('../helpers/Sql_connection')
const router = express.Router()


router.post('/like' , (req, res) => {
    const token =  req.body.token
    const type = req.body.type
    const value = req.body.value
    const id = req.body.id
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Token Error' });
        }
        else {
            const {userId, username } = decoded
            if (type === "stories") {
                mysql.query(`UPDATE ${type} SET likes = likes+? where story_id = ?`, [value, id], (error, results) => {
                    if (error) {
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }
                    else {
                        mysql.query(`SELECT * FROM story_likes where user_id = ? and story_id= ? `, [userId, id], (err, resul) => {
                            if (err) {
                                console.error(err)
                                return res.status(500).json({ message: 'Internal Server Error' });

                            }
                            else {
                                if (resul.length >0) {
                                    mysql.query(`UPDATE story_likes set liked = ${value ===1? value : 0} where user_id = ? and story_id = ? `, [userId, id], (err, resul) =>{
                                        if (err) {
                                            console.error(err);
                                            return res.status(500).json({ message: 'Internal Server Error' });
                                        }
                                        else {
                                            return res.json({message: "Success!"})
                                        }
                                    })
                                }
                                else {
                                    mysql.query(`INSERT INTO story_likes(story_id, user_id, liked) VALUES (?, ?,  1) `, [id, userId], (err, resul) =>{
                                        if (err) {
                                            console.error(err);
                                            return res.status(500).json({ message: 'Internal Server Error' });
                                        }
                                        else {
                                            return res.json({message: "Success!"})
                                        }
                                    })
                                }

                            }
                        })
                    }
                })
            }
            else if (type === "posts") {
                mysql.query(`UPDATE ${type} SET likes = likes+? where post_id = ?`, [value, id], (error, results) => {
                    if (error) {
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }
                    else {
                        mysql.query(`SELECT * FROM posts_likes where id = ? and post_id = ?`, [userId, id], (err, resul) => {
                            if (err) {
                                console.error(err)
                                return res.status(500).json({ message: 'Internal Server Error' });

                            }
                            else {
                                if (resul.length >0) {
                                    mysql.query(`UPDATE posts_likes set liked = ${value ===1? value : 0} where id = ? and post_id= ?`  , [userId, id], (err, result) =>{
                                        if (err) {
                                            console.error(err);
                                            return res.status(500).json({ message: 'Internal Server Error' });
                                        }
                                        else {
                                            return res.json({message: "Success!"})
                                        }
                                    })
                                }
                                else {
                                    mysql.query(`INSERT INTO posts_likes(post_id, id, shared, liked) VALUES (?, ?, 0, 1) `, [id, userId], (err, resul) =>{
                                        if (err) {
                                            console.error(err);
                                            return res.status(500).json({ message: 'Internal Server Error' });
                                        }
                                        else {
                                            return res.json({message: "Success!"})
                                        }
                                    })
                                }

                            }
                        })
                        
                    }
                })
            }
            else if (type === "posts_comments") {
                mysql.query(`UPDATE ${type} SET likes = ? where comment_id = ?`, [value, id], (error, results) => {
                    if (error) {
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }
                    else {
                        return res.json({message: "Success!"})
                    }
                })
            }

        }
    })

})

module.exports = router