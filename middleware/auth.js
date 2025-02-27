
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next)=> {

  
   const token = req.cookies.token;
    //console.log("cookie in auth: ", token);
    if(!token) return res.status(401).json({message:"Access denied. No token provided."});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (email) to req
        next();
    } catch (error) {
        res.status(500).json({ error: "Invalid token" });
    }

  
};

module.exports = authenticateToken;





