require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require ('express-session')
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const userRoutes = require('./routes/users/users');
const postRoutes = require('./routes/posts/posts');
const commentsRoutes = require('./routes/comments/comments');
const globalErrHandler = require('./middlewares/globalHandler');
const Post = require('./models/post/Post');
const { truncatePost } = require('./utils/helpers');
require("./config/dbConnect");

const app = express();

//helpers
app.locals.truncatePost = truncatePost

//middlewares
//------
//configure ejs
app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'views'));
//serve static path
app.use(express.static(path.join(__dirname, 'views')));

//pass data
app.use(express.json())//pass incoming data
app.use(express.urlencoded({extended:true}))//pass form data

//method override
app.use(methodOverride("_method"));
let store = new MongoStore({
        mongoUrl:process.env.MONGO_URL,
        ttl:24*60*60, //1 day
        collection: "sessions"
    })

//session config
app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store: store
}))
//save the login user into locals
app.use((req,res,next)=>{
    if(req.session.userAuth){
        res.locals.userAuth = req.session.userAuth

    }else{
        res.locals.userAuth = null;
    }
    next()
})
//routes
//------
//render home
app.get('/',async (req,res)=>{
    try {
        const posts = await Post.find().populate("user")
        res.render('index',{posts})
    } catch (error) {
        res.render('index',{error : error.message})
    }
})

app.get('/hello',async (req,res)=>{
    try {
        const posts = await Post.find().populate("user")
        res.send('Hello World!')
    } catch (error) {
        res.send(error)
    }
})

//------
//users route
app.use('/api/v1/users/',userRoutes)
//------

//------
//posts route
app.use('/api/v1/posts',postRoutes)
//------

//------
//comments route
app.use('/api/v1/comments',commentsRoutes)
//------

//Error handler middlewares
app.use(globalErrHandler)

//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
