require("dotenv").config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

const uploadDirectory = path.join(__dirname, '../../images_videos'); // Replace with your directory path

// Route to fetch and send uploaded files
router.post('/posts', (req, res) => {

  const token = req.body.token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Token Error' });
    }
    else {
      mysql.query(`SELECT posts.post_id, posts.id, user.username, user.pfp, posts.post_content, posts.creation, posts.likes, posts.caption from posts
      JOIN 
      user
      on user.id = posts.id order by post_id desc`, (err, results) => {
        if(err) {
          console.error(err)
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
          mysql.query(`	select comment_id, post_id, user.id, comment, comment_time, likes, pfp, isActive, username from posts_comments 
          join user
          on posts_comments.id = user.id`, (error, result) => {
            if (error ) {
              console.error(error)
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            else {
              fs.readdir(uploadDirectory, (err, files) => {
                if (err) {
                  console.log(err)
                  return res.status(500).json({ message: 'Error reading directory' });
                }
                const fileData = files
                .filter((file) => results.some((row) => row.post_content === file))
                .map((file) => {
                  const matchingRow = results.find((row) => row.post_content === file);
                  
                  console.log(matchingRow.post_content, file);
                  
                  return {
                    posts_id: matchingRow.post_id,
                    posts_content: `${file}`,
                    pfp: matchingRow.pfp,
                    username: matchingRow.username,
                    creation: matchingRow.creation,
                    likes: matchingRow.likes,
                    caption: matchingRow.caption,
                    comments: result
                     // Replace with your server URL
                  };
                });
                res.json({ files: fileData });
              });
            }
          })
  
        }
      })
    }
  })
});


module.exports = router
