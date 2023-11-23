const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = 3000;
const cors = require('cors');

const catsRoute = require('./routes/cats');

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'journal_db'
});

app.use('/api/v1/cats', catsRoute);

connection.connect((error) => {
    if(error==null)
    {
        console.log('Connected to MySQL database');
    }
    else
    {
        console.error('Error connecting to MySQL:', error);
    }
})

app.listen(PORT, ()=> console.log(`Running Express Server on Port ${PORT} ~`));

app.get('/', (req, res) => {
    res.send('Welcome!');
})