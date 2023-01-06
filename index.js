const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;


const todo = require('./model/TodoTask');

mongoose.set('strictQuery', true);
dotenv.config();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(PORT, () => console.log("Server Up and running", PORT));
});

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    res.render("login.ejs");
});
app.post('/', function(req,res){
    const fs = require('fs');
    var username = req.body.name;
    var password = req.body.password;
    const myArr = fs.readFileSync('./users.json', 'utf8');
    const myData = JSON.parse(myArr);
    for(var i = 0; i < myData.length; i++){
        if(myData[i].name == username){
            console.log('found');
            if(myData[i].password == password){
                console.log('foundPassword');
            }
            else(console.log('wrong password'));
        }
        else(console.log('no user found'));
    }
    console.log(myData);
 });