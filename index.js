const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const TodoTask = require("./model/TodoTask");

mongoose.set('strictQuery', true);
dotenv.config();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(PORT, () => console.log("Server Up and running", PORT));
});

app.set("view engine", "ejs");
//view login
app.get("/", async (req, res) => {
    res.render("login.ejs");
});
//login
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
                process.env.ACTIVE_USER = username;
                console.log(TodoTask.find({}));
                TodoTask.find({owner: username}, function(err, tasks){
                    res.render("todo.ejs", { todoTasks: tasks });
                });
            }
            else(console.log('wrong password'));
        }
        else(console.log('no user found'));
    }
 });

//json view
 app.route("/jsonView").get((req, res) => {
    var tasksJson;
    const fs = require('fs')
    TodoTask.find({}, (err, tasks) => {
        const data = JSON.stringify(tasks);
        fs.writeFile('tasks.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });
    var file = fs.readFileSync('tasks.json');
    var jsonObject = JSON.parse(file);
    res.json(jsonObject);
});

//view done only
app.route("/done").get((req, res) => {

    TodoTask.find({owner: process.env.ACTIVE_USER ,completed:true}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
        });
});

//view all
app.route("/all").get((req, res) => {

    TodoTask.find({owner: process.env.ACTIVE_USER}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
        });
});

//rewrite
app.route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content, completed: req.body.completed }, err => {
    if (err) return res.send(500, err);
    res.redirect("/all");
    });
});

//delete
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/all");
    });
}	);

//add new task
app.post('/all',async (req, res) => {
    const todoTask = new TodoTask({
    owner: process.env.ACTIVE_USER,
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/all");
    } catch (err) {
    res.redirect("/all");
    }
});

//mark as done
app.route("/update/:id").get((req,res)=>{
    TodoTask.updateOne({_id:req.params.id},{completed:!(req.body.completed)},(err)=>{
        //console.log('completed: '+req.body.completed);
        if(err) return res.send(500, err);
        res.redirect("/all");
    });
});