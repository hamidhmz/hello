import express from "express";
import authView from "../middleware/authView";
import {User} from "../models/user";
import multer from "multer";
import path from "path";
import fs from "fs";
const imageArray = ["https://dummyimage.com/100x100/7a6bed/7a6bed.png"];

const router = express.Router();
const upload = multer({
    dest: "./uploads"
});
router.get("/profile-image/:email",async function(req,res){

    const image = path.join(__dirname+"/../uploads/default.png");
    // const image = "https://dummyimage.com/100x100/7a6bed/7a6bed.png";
    let previousImage;
    const thisUser = await User.find({email: req.params.email}).select({ profileImage:1 });
    if (thisUser[0].profileImage) {
        previousImage = thisUser[0].profileImage;
    }else{
        previousImage = image;
    }

    // res.sendFile(base64str);
    res.sendFile(previousImage);
});
router.get("/profile-image",authView,async function(req,res){
    let previousImage ;
    try{

        const image = path.join(__dirname+"/../uploads/default.png");
        const thisUser = await User.find({_id: req.user._id}).select({ profileImage:1 });
        if (thisUser[0].profileImage) {
            previousImage = thisUser[0].profileImage;
        }else{
            previousImage = image;
        }
        const base64str = base64_encode(previousImage);
        // res.sendFile(base64str);
        res.send(base64str);
    }catch (e) {
        console.log(e);

        const image = path.join(__dirname+"/../uploads/default.png");
        previousImage = image;
        const base64str = base64_encode(previousImage);
        // res.sendFile(base64str);
        res.send(base64str);
    }

});
router.post("/upload",authView,upload.single("filepond" /* name attribute of <file> element in your form */),async function(req, res) {
        try {
            const tempPath = path.join(__dirname,"../"+req.file.path);
            const targetPath = path.join(__dirname, "../"+req.file.path+(path.extname(req.file.originalname).toLowerCase()));
            // console.log(tempPath.replace(/\\/g, '/'));
            // console.log(targetPath.replace(/\\/g, '/'));
            console.log(path+(path.extname(req.file.originalname).toLowerCase()));
            if (path.extname(req.file.originalname).toLowerCase() === ".png" ||path.extname(req.file.originalname).toLowerCase() === ".jpg"||path.extname(req.file.originalname).toLowerCase() === ".gif"||path.extname(req.file.originalname).toLowerCase() === ".gif") {
                let previousImage = false;
                try {
                    const thisUser = await User.find({_id: req.user._id}).select({ profileImage:1 });
                    previousImage = thisUser[0].profileImage;

                }catch (e) {
                    console.log(e);
                }

                // const previousImage =false ;

                User.update({ _id: req.user._id },{
                    // mongodb update operators: https://docs.mongodb.com/manual/reference/operator/update/
                    $set:{
                        profileImage:targetPath,
                    }
                },async function () {
                    if (previousImage){
                        fs.unlink(previousImage, err => {
                            if (err) return console.log(err);

                            fs.rename(tempPath, targetPath, err => {
                                // if (err) return console.log(err,1);

                                res
                                    .status(200)
                                    .contentType("text/plain")
                                    .end("File uploaded!");
                            });
                        });
                    }else {
                        fs.exists(tempPath, (exists) => {
                            fs.rename(tempPath, targetPath, err => {
                                // if (err) return console.log(err,1);

                                res
                                    .status(200)
                                    .contentType("text/plain")
                                    .end("File uploaded!");
                            });
                        });
                    }

                });
            } else {
                fs.unlink(tempPath, err => {
                    if (err) return console.log(err);

                    res
                        .status(403)
                        .contentType("text/plain")
                        .end("Only .png files are allowed!");
                });
            }
        }catch (e) {
            console.log(e);
        }
    }
);

router.get("/",authView,async function (req,res) {
    // console.log(req.cookies["token"]);
    // res.render('index', { title: 'Hey', message: 'Hello there!' });
    res.render('index',{page:"index"});
});

router.get("/login",async function (req,res) {
    res.render('login',{page:"login"});
});

router.get("/messages",authView,async function (req,res) {
    res.render('messages',{page:"messages"});
});

router.get("/settings",authView,async function (req,res) {
    res.render('settings',{page:"settings"});
});


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    let bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
export default router;