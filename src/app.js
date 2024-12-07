const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/countConnect");
require("dotenv").config()
const app = express();

// init middleware
app.use(morgan('dev')); //ghi log có 5 chế độ dev, combined, common, short, tiny, 
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
//init db
require("./dbs/init.database");
checkOverload()
//init routes
app.use('/', require("./routers"))
// handle error
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404,
    next(err)
})
app.use((err, req,res, next)=>{
    const status = err.status()||500;
    return res.status().json({
        status:'error',
        code:status,
        stack:error.stack,
        message:err.message||"Internal Server Error"
    })
})

module.exports = app