const express = require( "express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const morgan = require("morgan");
const bodyParser = require( "body-parser");
const cors = require( "cors");
const userRouter = require( "./routes/user");
// const boardRouter = require ("./api/routes/boards");
// const columnRouter = require( "./routes/columns");
const cardRouter = require( "./routes/cards");
const columnRouter = require( "./routes/columns");

// require('dotenv').config();
const app = express();
app.use(helmet());
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
    message: 'Too many requests' // message to send
});
app.use('/routeName', limit); // Setting limiter on specific route
// Body Parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10
// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
// Data Sanitization against XSS attacks
app.use(xss());
// app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());
app.options('*',cors());
app.use(cors());
app.use(cors({credentials : true, origin : ['localhost:3000']}));

app.use('/api/users',userRouter);
app.use('/api/cards',cardRouter);
app.use('/api/columns',columnRouter);

app.use((req,res,next)=>{
    const error = new Error('no route found ');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res
        .status(error.status || 500)
        .json({
            error:{
                message:error.message
            }})
});


module.exports =app;




