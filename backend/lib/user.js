/* eslint-disable linebreak-style */

const { User } = require("../models/user");

/**
 * findUserAndReturnWithId.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	req	
 * @return	user detail from DB
 */
async function findUserAndReturnWithId(req){
    const user = await User.findById(req.user._id).select("-password");
    return user;
}

module.exports = { findUserAndReturnWithId };
