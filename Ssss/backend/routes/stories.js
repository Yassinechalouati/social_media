require("dotenv").config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

const uploadDirectory = path.join(__dirname, '../../images_videos'); // Replace with your directory path

// Route to fetch and send uploaded files
router.post('/stories', (req, res) => {

  const token = req.body.token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Token Error' });
    }
    else {
      const {userId, username} = decoded
      mysql.query(`SELECT 
      stories.story_id, 
      stories.id, 
      user.username, 
      user.pfp, 
      stories.story_content, 
      stories.creation, 
      stories.likes, 
      stories.caption 
  FROM 
      stories
  JOIN 
      user
  ON 
      user.id = stories.id
  WHERE 
      TIMESTAMPDIFF(HOUR, stories.creation, NOW()) <= 24;`, (err, results) => {
        if(err) {
          console.error(err)
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        else {
          fs.readdir(uploadDirectory, (err, files) => {
            if (err) {
              console.log(err)
              return res.status(500).json({ message: 'Error reading directory' });
            }
            const fileData = files
            .filter((file) => results.some((row) => row.story_content === file))
            .map((file) => {
              const matchingRow = results.find((row) => row.story_content === file);
              
              console.log(matchingRow.story_content, file);
              
              return {
                story_id: matchingRow.story_id,
                story_content: `${file}`,
                pfp: matchingRow.pfp,
                username: matchingRow.username,
                creation: matchingRow.creation,
                likes: matchingRow.likes,
                caption: matchingRow.caption
                 // Replace with your server URL
              };
            });
  
        
            res.json({ files: fileData });
          });
  
        }
      })
    }
  })
});


module.exports = router
