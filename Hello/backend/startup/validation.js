const Joi = require("joi");
const joi_objectid = require("joi-objectid");

module.exports = function(){
    Joi.ObjectId = joi_objectid(Joi);
};