const express = require('express')
const ejs = require('ejs')
const path = require('path')
const session = require('express-session')
const socketio = require('socket.io')
const expressLayout = require('express-ejs-layouts')
const db = require('./Connection/connection')
const cookieParser = require('cookie-parser')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const userRouter = require('./routes/user')
app.use(expressLayout)
app.set('views',path.join(__dirname,'views'))
app.set('layout',path.join(__dirname,'/views/Layouts/userLayout.ejs'))
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
io.on('connection',socket=>
{
    socket.on('just',data=>
    {
        console.log("Socket Connection New");
    })
})
app.use(session({
    key:'user',
    secret:"random321",
    resave:false,
    saveUninitialized:false,
    cookie:{  expires:9000000  }
})); 

app.use('/',userRouter)
server.listen(3000,()=>{console.log("Server Started at Port 3000")})