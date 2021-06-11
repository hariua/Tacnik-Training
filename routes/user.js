const express = require('express')
const router = express.Router()
const userHelper = require('../Controller/userHelper')
let jwt = require('jsonwebtoken')
const userAuthenticate = (req, res, next) => {
    let token = req.cookies.jwt
    if (token == null) {
        console.log("token null");
        res.redirect('/login')
    } else {
        jwt.verify(token, 'SECRET123', (err, data) => {
            if (err) {
                console.log("Token Corrupted");
                res.redirect('/login')
            } else {
                console.log("User Authenticated");
                next()
            }
        })
    }
}
router.get('/', (req, res) => {
    res.render('user/LandingPage', { title: "Landing Page" })
})
router.get('/register', (req, res) => {
    res.render('user/Register', { title: "Register Page" })
})
router.get('/login', (req, res) => {
    res.render('user/Login', { title: "Login Page" })
})
router.get('/home', userAuthenticate, async(req, res) => {
    let data = req.session.user
    let status = await userHelper.getUserStatus(req.session.user.Id)
    res.render('user/home', { layout:'../views/Layouts/homeLayout.ejs',user: data, title: "Home Page",status:status })
})
router.post('/register', (req, res) => {
    userHelper.registerUser(req.body).then(async (response) => {
        res.redirect('/login')
    }).catch(() => {
        res.redirect('/register')
    })
})
router.post('/login', (req, res) => {
    userHelper.loginUser(req.body).then(async (data) => {
        let token = await jwt.sign(data, 'SECRET123')
        req.session.user= {Name:data.Name,Id:data._id,Email:data.Email}
        await userHelper.statusChange("Active",req.session.user.Id)
        res.cookie('jwt', token, { maxAge: 9000000, httpOnly: true })
        res.redirect('/home')
    }).catch(() => {
        res.redirect('/login')
    })
})
router.get('/logout', async(req, res) => {
    await userHelper.statusChange("Inactive",req.session.user.Id)
    res.clearCookie('jwt')
    req.session.user=null
    res.redirect('/login')
})
router.post('/statusChange',userAuthenticate,async(req,res)=>
{
    await userHelper.statusChange(req.body.Status,req.session.user.Id)
    res.json({status:req.body.Status})
})
module.exports = router