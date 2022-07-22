const express = require('express')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const service = express()
const port = 8000

// Connect to Database or Create DB in MongoDB
mongoose.connect("mongodb://localhost:27017/EmployeeDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfull Connected..!!!!!!"))
    .catch((err) => console.log(err));

//create model
const studentSchem = new mongoose.Schema({
    Stdnane: {
        type: String,
        required: true
    },
    UserID: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Class: {
        type: Number,
        required: true
    },
    Section: {
        type: String,
        required: true
    },
    AdmissionDate: {
        type: Date,
        default: Date.now
    },
    IsDelete : {
        type: Boolean,
        default: false
    }
})

//create Collection *note:- collection first latter of name shold be Capital bcz it perform like a class 
const StudentList = new mongoose.model("StudentList", studentSchem);

service.use(bodyParser.urlencoded({ extended: false }));
service.use(bodyParser.json());

service.get("/", (req, res) => {
    console.log("connected")
    res.send("Connected")
})

//Add Student Api
service.post("/addStudent",(req, res)=>{
    try{
        var insertStd = async ()=>{

        const addStudent = new StudentList({
            Stdnane: req.body.Stdnane,
            UserID: req.body.UserID,
            Password: req.body.Password,
            Class: req.body.Class,
            Section: req.body.Section
        })
    
        const result = await addStudent.save();
        console.log(result)
        res.send(result)
     }
    }
    catch(err)
    {
        console.log(err)
    }
    insertStd()
})

//Get All Student List Api
service.get("/getStudentList",(req, res)=>{
    try
    {
        var getList = async ()=> {
            const allStudent = await StudentList.find({})
            res.send(allStudent)
            console.log(allStudent)
        }
    }
    catch(err)
    {
        res.send(err)
        console.log(err)
    }
    getList()
})

//Put Edit Studet Record
service.put("/editRecord", (req,res)=>{
    let _id = req.body._id
    try
    {        
        var editList = async (_id) =>{            
          const updateFiled = await StudentList.updateOne({_id},{
            $set: {
                Stdnane: req.body.Stdnane,
                UserID: req.body.UserID,
                Password: req.body.Password,
                Class: req.body.Class,
                Section: req.body.Section
            }
        });
        res.send(updateFiled)
        console.log(updateFiled)
        }
    }
    catch(err)
    {
        res(err)
        console.log(err)
    }
    editList(_id)
})

//Soft Delete By Id
service.put("/Delete", (req,res)=>{

    let _id = req.body._id
    var softDelete = async (_id)=>{
        try
        {
            const del = await StudentList.updateOne({_id},{
                    $set: {
                        IsDelete: true
                    }
                });
                res.send(del)
                console.log(del)
        }
        catch(err)
        {
            console.log(err)
        }
    }
    softDelete(_id)
})

service.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})