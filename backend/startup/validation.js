import Joi from "joi";
import joi_objectid from "joi-objectid";

export default function(){
    Joi.ObjectId = joi_objectid(Joi);
}