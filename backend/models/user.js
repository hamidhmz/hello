import config from "config";
import jwt from "jsonwebtoken";
import Joi from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique:true
    },
    password: {/// we can use joi-password-complexity
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    profileImage:String,
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get("jwtPrivateKey"));
};
const User = mongoose.model('User', userSchema);

function validateUser(User) {
    console.log(User);
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required().strip()
    };

    return Joi.validate(User, schema);
}
function validate(User) {
    const schema = {
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required().strip()
    };

    return Joi.validate(User, schema);
}
export {validateUser,validate,User};