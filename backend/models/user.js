const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true
    },
    password: {/// we can use joi-password-complexity
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    profileImage: String,
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    // return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get("jwtPrivateKey"));
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.adminPanel_jwt);
};
const User = mongoose.model('User', userSchema);

function validateUser(User) {
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
module.exports = { validateUser, validate, User };