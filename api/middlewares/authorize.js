const expressAsyncHandler = require("express-async-handler");
const  jwt = require("jsonwebtoken");


module.exports = {
    authorize: expressAsyncHandler(async (req, res, next) => {
        // 1) Getting token and check of it's there
       
        let token;
        if (
           (req.method === "POST" ||
            req.method === "GET" )&&
            req.headers.authorization &&
            req.headers.authorization.startsWith("Admin-")
        ) {
            
            token = req.headers.authorization.split("-")[1];
            token = token.trim()
            if(token==process.env.ADMIN_SECRET){
                next()
            }else{
                res.status(401).send("Unauthorized");
            }
        }

        if (!token) {
            res.status(401).send("Unauthorized");
        }
    }),
    preCheck:expressAsyncHandler(async(req,res)=>{
        let token;
        if (
           (req.method === "POST" ||
            req.method === "GET" )&&
            req.headers.authorization &&
            req.headers.authorization.startsWith("User-")
        ) {
            
            token = req.headers.authorization.split("-")[1];
            token = token.trim()
            if(token){
                req.user = jwt.verify(token,"sshh")
                next()
            }else{
                res.status(401).send("Unauthorized");
            }
        }

        if (!token) {
            res.status(401).send("Unauthorized");
        }
    })
}