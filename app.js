require('dotenv').config();
var express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var helmet=require("helmet");
const config = require('./config/config')


const OutletRoutes = require('./routers/OutletRoutes')

var app = express();

app.use(helmet())
app.use(cors());
//Add middlewares to entire webApp
app.use(bodyParser.json());       // to support JSON-encoded bodies


app.use('/api/v1/outlets', OutletRoutes)

//==============================If api address not found=======================//
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err)
    res.status(err.status || 500).json(
        {message: err.message});
});



if (app.get('env') === 'dev' || app.get('env') === 'local') {
    
   console.log("SERVER IS RUNNING ON PORT: ",config.port.portNumber,"on ENV: ",process.env.NODE_ENV)
    app.listen(config.port.portNumber);
}else{
    console.log("no env selected")
}


module.exports = app;
