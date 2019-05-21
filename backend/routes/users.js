import bcrypt from "bcrypt-nodejs";
import _ from "lodash";
import {User, validateUser,validate} from "../models/user";
import express from "express";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/me",auth,async(req,res)=>{
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});
//register
router.post('/register', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body,["name","email","password"]));


    bcrypt.genSalt(10, async function (err, salt){
        bcrypt.hash(req.body.password,salt,null,function(err,hash){
            user.password = hash;
        });
    });
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token",token).send(_.pick(user,["name","email"]));

    // res.send(user);
});
//login
router.post('/login', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Invalid Email or Password.");

    bcrypt.compare(req.body.password,user.password,async function (err, validPassword){
        // console.log(validPassword);
        // console.log(err);
        if(!validPassword) return res.status(400).send("Invalid Email or Password.");
        const token = user.generateAuthToken();
        res.header("x-auth-token",token).send(_.pick(user,["name","email"]));

    });
});

export default router;