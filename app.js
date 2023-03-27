require('dotenv').config()
const express = require('express');
const session = require('express-session');
const mongoose =  require('mongoose');
bodyParser = require( 'body-parser');
const upload = require('./middlewares/multer');
const path = require('path');
const MongoDbStore = require('connect-mongodb-session')(session);
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const app = express();




app.set('view engine' , 'ejs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended: false}));

const store = new MongoDbStore ({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
})

app.use(
    upload.single('image')
    );
app.use(
    session({
        secret: 'My-Secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)    
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(homeRoutes);
app.use(authRoutes);


mongoose.connect(process.env.MONGODB_URI)
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})

