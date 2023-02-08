const authController = require('../controllers/auth');
const express = require('express');

const { check,body } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.get('/signup',authController.getSignUp);
router.get('/login',authController.getLogin);
router.post('/login',
[
check('email')
.isEmail()
.withMessage('Enter A Valid Email')
],authController.postLogin);
router.post('/signup',
[
check('email').
isEmail()
.withMessage('Enter A Valid Email')
.custom((value , {req})=>{
    return User.findOne({email:value})
    .then(userDoc => {
        if(userDoc){
        return Promise.reject('Email Exits Please Pick A Different Email.')
        }
    })
})
.normalizeEmail(),
body('Password' , 'Enter a Password With Atleast 5 Characters')
.isLength({
    min : 5
})
.trim()

],authController.postSignUp);


module.exports = router;
