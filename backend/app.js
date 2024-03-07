// import express module 
const express = require("express");
//import spawn
const { spawn } = require('child_process');
// import mysql
const mysql = require('mysql'); 
const consul = require('consul'); // Import the consul library

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


let mysqlConnectorInstances =  parseInt(process.env.VARIABLE_NAME);


// Initialize Consul client
const consulClient = new consul({ host: 'consul-ui', port: 90 }); // Use the service name for Consul

// Function to register service with Consul
async function registerServiceWithConsul() {
    try {
        await consulClient.agent.service.register({
            name: `mysql-connector-${mysqlConnectorInstances}`, // Service name
            address: `mysql-connector-${mysqlConnectorInstances}-service`, // Use the service name for your microservice
            port:  80+ mysqlConnectorInstances, // Service port (the port exposed externally)
            check: {
                http: `http://mysql-connector-${mysqlConnectorInstances}-service:8${mysqlConnectorInstances}/test`, // Health check endpoint
                interval: '10s' // Check every 10 seconds
            }
        });
        console.log('Microservice registered with Consul');
    } catch (err) {
        console.error('Error registering service with Consul:', err);
    }
}

// Register service with Consul on startup
registerServiceWithConsul();


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
app.get("/test", (req, res) => {
    res.sendStatus(200); // Send HTTP 200 OK status
});
  
module.exports = app;
app.get("/",(req,res)=>{
    res.sendStatus(200);
})