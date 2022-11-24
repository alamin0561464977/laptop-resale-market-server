const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.POST || 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Laptop Resale Market is Running');
});


app.listen(port, () => {
    console.log('Laptop Resale Market is Running on Port', port)
})