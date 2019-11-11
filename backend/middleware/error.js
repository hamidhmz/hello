const winston = require("winston");

module.exports = function(err,req,res,next){
    // winston.log("error",err.message,err);
    winston.error(err.message,err/*meta data */);
    //log level:
    //error
    //warn
    //info
    //verbose
    //debug
    //silly
    res.status(500).send("something failed.");
}