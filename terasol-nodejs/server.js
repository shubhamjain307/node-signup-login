const express = require('express')
require("dotenv").config();
const bodyParser = require('body-parser')

const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');
var cors = require('cors')

// Require Users routes
const userRoutes = require('./src/routes/user.route')


mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
    }).then(() => {
      console.log("Successfully connected to the database");
    }).catch(err => {
      console.log('Could not connect to the database.', err);
      process.exit();
    });

const app = express()

const port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json())

app.use('/api/users', userRoutes)


app.get('/',(req,res)=>{
    console.log('this is for testing')
})

app.listen(port,()=>{
    console.log(`Server started at port:${port}`)
})