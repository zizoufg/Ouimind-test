// import express module 
const express = require("express");
//import spawn
const { spawn } = require('child_process');
// import mysql
const mysql = require('mysql'); 

//CORS
const cors = require('cors');
//fs
const fs = require('fs');
//import csv parser 
const csv = require('csv-parser');
//import body-parser module 
const bodyParser = require("body-parser");
//import mongoose module 
const mongoose = require("mongoose");

// create express application 
const app = express();
// Array to hold transformed data
const transformedData = [];
const MySQLConnector = require("./MySQLConnectorClass");

   
// Enable CORS
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
//configure APP with bodyparser to send response => JSON 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// const config = {
//     host: 'localhost',
//     user: 'root',
//     password: 'aZFG1111*',
//     database: 'product'
// };



// API endpoint for dynamic data transformation
app.get("/api/connect", (req, res) =>{
    const userId = req.query.userId;
    const host =req.body.host;
    const user =req.body.user;
    const password =req.body.password;
    const database =req.body.database;
    const config = {
        host: host,
        user: user,
        password: password,
        database: database
    };
    const connector = new MySQLConnector(config);
    console.log("Req");
    connector.connect()
    .then(() => {
        console.log('Connecté à la base de données MySQL');
       
         // Query the database and return result in json format
         connector.connection.query('SELECT * FROM laptop',(error, results)=>{
             if (error) throw error; 
             res.send(`<pre>${JSON.stringify(results, null, 2)}</pre>`); 
         });

    
    
});
});
app.get("/test",(req,res)=>{
    res.json({message:"hello"});
    console.log("hello");
})
  
module.exports = app;