const express = require('express')
const ejs = require('ejs')
const path = require('path')
const db = require('./Connection/connection')
const cookieParser = require('cookie-parser')
const app = express()
const userRouter = require('./routes/user')
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + '/public'));
db.connect((err)=>
{
    if(err)
    {
        console.log("Database Connection Error");
    }else{
        console.log("Database Connection Success");
    }
})
app.use('/',userRouter)
app.listen(3000,()=>{console.log("Server Started at Port 3000")})