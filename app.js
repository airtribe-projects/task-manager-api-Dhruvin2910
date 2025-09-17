const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

const taskPath = path.join(__dirname, "task.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

// CREATE
app.post("/tasks", (req, res) => {
    try{
        const { title, description, completed } = req.body;

        if(!title || !description){
            return res.status(400).json({ success:false, message:"Incomplete data" });
        }

        const tasksData = fs.readFileSync(taskPath, "utf-8");
        const db = JSON.parse(tasksData);
        const tasks = db.tasks;
        const nextId = tasks.length > 0? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        
        const newTask = {
            id: nextId, 
            title,
            description,
            completed: completed || false
        };

        tasks.push(newTask);
        fs.writeFileSync(taskPath, JSON.stringify(db, null, 2));

        res.status(201).json(newTask);
    }catch(error){
        console.error(error);
        res.status(500).json({ success:false, message:"Internal Server Error" });
    }
});

// READ
app.get("/tasks", (req, res) => {
    try{
        const tasksData = fs.readFileSync(taskPath, "utf-8");
        const tasks = JSON.parse(tasksData).tasks;

        // Filtering by completion status
        if(req.query.completed){
            const completed = req.query.completed === "true";
            const tasks = tasks.filter(task => task.completed === completed)
        }

        // Sirting by creationAt (asceding or descending)
        if(req.query.sortBy === "createdAt"){
            const order = req.query.order === "desc"? -1:1;
            tasks.sort((a,b) => (new Date(a.createdAt) - new Date(b.createdAt)) * order);
        }

        res.status(200).json(tasks);
    }catch(error){
        console.error(error);
        res.status(500).json({ success:false, message:"Internal Server Error" });
    }
})

// READ TASK BY PRIORITY
app.get("/tasks/prority/:level", (req, res) => {
    try{
        const { level } = req.params;
        const tasksData = fs.readFileSync(taskPath, "utf-8");
        const tasks = JSON.parse(tasksData).tasks;

        const filteredTasks = tasks.filter(task => task.priority === level.toLocaleLowerCase());
    }catch(error){
        console.error("Priority error", error);
        return res.status(500).json({ success:false, message:"Internal server error" });
    }
})

// READ ONE
app.get("/tasks/:id", (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const tasksData = fs.readFileSync(taskPath, "utf-8");
        const tasks = JSON.parse(tasksData).tasks;
        const task = tasks.find(t => t.id === id);

        if(!task){
            return res.status(404).json({ success:false, message:"task not found" });
        }

        res.status(200).json(task);
    }catch(error){
        console.error(error);
        res.status(500).json({ success:false, message:"Internal Server Error" });
    }
})

// UPDATE TASKS
app.put("/tasks/:id", (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const id = parseInt(req.params.id);

        // ✅ validate required fields
        if (!title || !description  || typeof completed !== "boolean") {
            return res.status(400).json({ success: false, message: "Invalid data" });
        }

        const tasksData = fs.readFileSync(taskPath, "utf-8");
        const db = JSON.parse(tasksData);
        let tasks = db.tasks;

        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // merge update
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };

        db.tasks = tasks;
        fs.writeFileSync(taskPath, JSON.stringify(db, null, 2));

        res.status(200).json(tasks[taskIndex]);

    } catch (error) {
        console.error("Update error", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// DELETE TASKS
app.delete("/tasks/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const tasksData = fs.readFileSync(taskPath, "utf-8");
        const db = JSON.parse(tasksData);
        let tasks = db.tasks;

        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];

        db.tasks = tasks;
        fs.writeFileSync(taskPath, JSON.stringify(db, null, 2));

        res.status(200).json({ success: true, deletedTask });
    } catch (error) {
        console.error("Delete error", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



module.exports = app;