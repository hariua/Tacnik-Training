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
router.get('/home', userAuthenticate, (req, res) => {
    let data = { Name: req.cookies.user }
    res.render('user/home', { user: data, title: "Home Page" })
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
        res.cookie('jwt', token, { maxAge: 9000000, httpOnly: true })
        res.cookie('user', data.Name, { maxAge: 9000000, httpOnly: true })
        res.redirect('/home')
    }).catch(() => {
        res.redirect('/login')
    })
})
router.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.clearCookie('user')
    res.redirect('/login')
})
module.exports = router