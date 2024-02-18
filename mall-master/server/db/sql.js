const mysql = require('mysql')
let connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'cjx',
  password: 'cjxstc12',
  database: 'shop'
})
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err)
    return
  }
  console.log('Connected to the MySQL server.')
})
module.exports = connection
