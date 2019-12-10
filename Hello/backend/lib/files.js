/* eslint-disable linebreak-style */
const fs = require("fs");
/**
 * function to encode file data to base64 encoded string
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	file	
 * @return	base64 for that file
 */
module.exports.base64_encode = function (file) {
    // read binary data
    let bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString("base64");
};