
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next)=> {
    const token = req.header('Authorization');

    if(!token) return res.status(401).json({error:"Access denied. No token provided."});

    try{
        const verify = jwt.verify(token.replace("Bearer ",""),process.env.JWT_SECRET);
        req.user = verify;
        next();
    }catch(err){
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticateToken;