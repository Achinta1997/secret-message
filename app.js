require("dotenv").config();
const express=require("express");
const bodyParser = require("body-parser");
const { default: mongoose, Schema, mongo } = require("mongoose");
const ejs = require("ejs");


const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded([true]));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://"+process.env.USER+":"+process.env.PASSWORD+"@cluster0.zsolp3e.mongodb.net/secrets");

//mongoose model and schema
const secretSchema= new mongoose.Schema({
    message : String
});

const Secret = mongoose.model("Secret",secretSchema);

//getting homepage
app.get("/",function(req,res){
    res.sendFile(__dirname+"/src/index.html");
});

//collecting secrets from users
app.post("/",function(req,res){
    const message=req.body.message;
    const secret=new Secret({
        message : message
    });
    secret.save();
    res.redirect("/secrets");
});


//sending back secrets for users view
app.get("/secrets",async (req,res)=>{

    await Secret.find({})
    .then((secret)=>{
            res.render("secrets",{message: secret});
    })
    .catch((err)=>{
        console.log(err);
    });
    
});

let port=process.env.PORT;
if(port==null || port==""){
    port=3000;
}

app.listen(port,function(req,res){
    console.log("server started at port 3000");
});