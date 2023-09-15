require("dotenv").config()
const express = require('express');
const multer = require('multer'); // Middleware for handling file uploads
const path = require('path');
const router = express.Router()
const mysql = require('../helpers/Sql_connection')
const jwt = require('jsonwebtoken')

// Set up multer to handle file uploads
let uploadedFileName
let id

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../images_videos'); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    uploadedFileName= Date.now() + path.extname(file.originalname)
    cb(null, uploadedFileName); // Generate a unique filename
  },
});

const upload = multer({ storage });

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization

  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      
      return res.status(401).json({ message: 'Invalid token' });
    }
    const {userId, username} = decoded
    id = userId
    // If verification is successful, move to the next middleware
    next();
  });
};

// Handle file upload
router.post('/upload', verifyJWT,  upload.single('file'), (req, res) => {
  const caption= req.body.caption
  const type = req.body.type
  console.log(caption)
  console.log(type)
  if (type === "stories")
   {
     mysql.query(`INSERT INTO stories(id, story_content, likes, caption) VALUES (?, ?, 0, ?) `, [id, uploadedFileName, caption], (err, result) => {
       if (err) {
         res.status(401).json({ message: 'Internal Server Error' })
       }
       
     })

   }
   else {
    mysql.query(`INSERT INTO posts(id, post_content, likes, caption, comments, shares) VALUES (?, ?, 0, ?, 0, 0) `, [id, uploadedFileName, caption], (err, result) => {
      if (err) {
        res.status(401).json({ message: 'Internal Server Error' })
      }
      
    })
   }
  res.json({ message: 'File uploaded successfully', filename: uploadedFileName });
});


module.exports =  router