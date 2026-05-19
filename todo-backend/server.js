//Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//creating an instance of express
const app = express();
app.use(express.json())
app.use(cors());

//sample in memory storage for todo items
// let todos = [];

//mongodb connecting

mongoose.connect("mongodb://localhost:27017/mern-app").then(()=>{
    console.log("Mongodb connected successfully");
}).catch((err)=>{
    console.log("Error"+": "+err)
})

//creating schema

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
})


//creating model
const todoModel = mongoose.model("Todo",todoSchema)

//define a route
//create todo
app.post("/todos",async(req,res)=>{
//   const newTodo = {
//     id:todos.length + 1,
//     title,
//     description
//   }
//   todos.push(newTodo);
//   console.log(todos);
  try {
    const {title,description} = req.body;
    const newTodo = new todoModel({title,description})
    await newTodo.save();
    res.status(201).json(newTodo)
  } catch (error) {
    console.log("Error :"+ error);
    res.status(500).json({
        message:error.message
    })
  }
})

//get all todos
app.get("/todos",async(req,res)=>{
    try {
        const todos = await todoModel.find()
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json({
            messsage:error.message
        })
    }
})

//update todo
app.put("/todos/:id",async(req,res)=>{
    try {
        const {title,description} = req.body;
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(id,{title,description},{returnDocument:"after"})
        if(!updatedTodo){
            res.status(404).json({
                message:"Todo Not Found"
            })
        }
        else{
            res.status(200).json(updatedTodo)
        }

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }    
})

//Delete a todo
app.delete("/todos/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        if(!deletedTodo){
            return res.status(403).json({
                message:"todo not found"
            })
        }

        res.status(200).end();
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})

//Start the Server
const PORT = 8000;
app.listen(PORT,()=>{
    console.log("server running to port"+PORT);
})