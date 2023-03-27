const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 465,
    secure:'true',
    auth: {
        user : 'debkalyanmohanty@gmail.com',
        pass: 'fjhjrkbmyipyvdnl'

    }
})

exports.getSignUp = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('signup',{
        title: 'Tourev - Signup',
        errorMessage: message,
        oldInput:{
            fname: '',
            lname: '',
            email:''
        }
    })
    
}

exports.postSignUp = (req,res,next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.Password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('signup' , {
            title: 'Tourev - Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                fname: fname,
                lname: lname,
                email: email,

            }
           
        })
    }
  
    bcrypt
    .hash(password , 12)
    .then(hashedPassword => {
        const user = new User({
            fname: fname,
            lname: lname,
            email: email,
            password: hashedPassword
        })
       
        return user.save();
    })
    .then(result => {
        var mailOptions = {
            from:'debkalyanmohanty@gmail.com',
            to :email,
            subject: 'LOGGED IN SUCCESSFULLY',
            text : 'THANK U '+fname+' FOR LOGGING IN TO TOUREV  YOU WILL SOON GET MORE UPDATES'
           };
           transporter.sendMail(mailOptions , (err,info)=>{
            if(err) res.redirect('/signup');
            else  res.redirect('/login');
           })

    })


}
exports.getLogin = (req,res,next)=> {
    // let message = req.flash('error');
    // if(message.length > 0){
    //     message = message[0];
    // }
    // else{
    //     message = null;
    // }

    res.render('login', {
        title: 'Tourev - Login',
        // errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        }
    })
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.Password;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('login', {
            title: 'Tourev - Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        })
    }
    User.findOne({email: email})
    .then(user => {
        if(!user){
            return res.render('login', {
                title: 'Tourev - Login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            })
        }
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.render('index');
                })
            }
            return res.render('login', {
                
                title: 'Tourev - Login',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                  email: email,
                  password: password
                },
                validationErrors: []
              });
            })
        })
 

  
}