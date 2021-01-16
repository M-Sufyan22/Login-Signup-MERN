const express = require('express');
const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('../src/auth');

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).render('index');
});

router.get('/about', auth, (req, res) => {
    res.status(200).render('about');
});

router.get('/logout', auth, async(req, res) => {
    try {
        // logout user from current device
        // req.user.tokens = req.user.tokens.filter((currenttoken) => {
        //     return currenttoken.token !== req.token
        // })
        //  logout user from all devices
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save();
        res.render('login');
    } catch (err) {
        res.status(500).send(err);
    }

});

router.get('/register', (req, res) => {
    res.status(200).render('register');
});

router.post('/register', async(req, res) => {
    try {
        const password = req.body.password;
        const Cpass = req.body.confirmPassword;
        if (password === Cpass) {
            const newUser = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                uname: req.body.uname,
                email: req.body.email,
                phone: req.body.phone,
                country: req.body.country,
                gender: req.body.gender,
                password: req.body.password
            });

            const token = await newUser.getAuthToken();

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true,
                // secure: true
            });

            const registered = await newUser.save();

            res.status(200).render('login');
        } else {
            res.send('password and confirm password are not matched!');
        }

    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/login', (req, res) => {
    res.status(200).render('login');
});

router.post('/login', async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await User.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.getAuthToken();

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
            // secure: true
        });

        if (isMatch) {
            res.status(200).render('index');
        } else {
            res.send('invalid login details..')
        }

    } catch (err) {
        res.status(400).send('Invalid login details');
    }
});


module.exports = router;