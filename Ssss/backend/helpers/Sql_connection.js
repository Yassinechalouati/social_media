const mysql=require('mysql')
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root123',
    database:'chat',
    charset: 'utf8mb4',
})

connection.connect() 


connection.query('Select * from user', (err, rows, fields) => {
    if(err) throw err
    
    console.log('ConnectedDB')
})

module.exports = connection