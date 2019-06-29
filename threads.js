// process.env.UV_THREADPOOL_SIZE = 8;
const crypto = require("crypto");
const start = Date.now();
const http = require("http");
const url = require('url');
var shared ="hhh";
const server = http.createServer((req,res) =>{
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    if(query.f){
        shared = query.f;
    }
    if(shared) {
        res.write(shared);
    }
    
    // crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
    // console.log("1:",Date.now() - start);
    // });
    // crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
    // console.log("2:",Date.now() - start);
    // });
    // crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
    // console.log("3:",Date.now() - start);
    // });
    // crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
    // console.log("4:",Date.now() - start);
    // });
    // crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
    // console.log("5:",Date.now() - start);
    // });
    res.end();
});
server.listen(3000);

// console.log( process.env.UV_THREADPOOL_SIZE );
// crypto.pbkdf2('a','b',100000,512,'sha512',()=>{
//     console.log("6:",Date.now() - start);
// });
