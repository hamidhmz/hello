/* eslint-disable linebreak-style */

const { User, validateUser, validate, validateForEdit } = require("../models/user");

/* -------------------------------------------------------------------------- */
/*                            return user with _id                            */
/* -------------------------------------------------------------------------- */

async function findUserAndReturnWithId(req){
    const user = await User.findById(req.user._id).select("-password");
    return user;
}

module.exports = { findUserAndReturnWithId };
