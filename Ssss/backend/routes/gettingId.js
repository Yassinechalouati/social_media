const express = require("express")
const router = express.Router()
const mysql = require('../helpers/Sql_connection')

router.post('/getId', (req, res) => {
    const username = req.body.username
    mysql.query('SELECT id from user where username = ?', [username], (err, result)=> {
        if (err) {
            console.log(err)
            res.status(500).json({message:"Internal Server Error "})
        }
        else {
            res.json({message: result[0].id})
        }
    })
})


module.exports = router