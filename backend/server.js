const dotenv=require('dotenv')
dotenv.config()
const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
const cors= require("cors")
const userRoutes= require("./routes/user")
const mongoose=require("mongoose")

app.use(cors())
app.use(express.json())
//routes
app.use('/',userRoutes)


//database
mongoose.connect(process.env.DATABASE)  
.then(()=>{
    console.log("database connected")
})
.catch(err=>{
    console.log(err)
})
app.get('/',(req,res)=>{
    res.send("jai shreee ram  kya bagfdsaggftau kya hai jadu")
})
app.listen(port,(err)=>{
    
    if(!err){
        
        console.log("running the server",port); 
    }
    
})