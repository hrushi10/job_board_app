
const express = require('express');
const router = express.Router();
const server = require('../server.js');
const db = server.db;
const authMiddleware = require('../middleware/auth.js');




const jwt = require('jsonwebtoken')
require('dotenv').config();

// importing bcryptjs to hash password
const encrypt = require('bcryptjs');

router.post('/signup', async (req, res) => { // using async as hashing needs time and returns promise 
    // getting parameterds from body
    const {email, name, password} = req.body;

     //
    db.query('select email from Users where email = ?', [email], async (err, results) =>{
        if(err){
            return res.status(500).json({ error: err.message }); 
        }else if(results.length >0){ // checking if the user already exist
            
            return res.status(404).json({ error: "User already Exists, Try login" });
        }else{
             // hasing the password
             // using await because it returns promise 
            const salt = await encrypt.genSalt(10);
            const haspass = await encrypt.hash(password,salt);

            const insertQuery= 'INSERT INTO users (email,name, password) values (?,?,?)';
            db.query(insertQuery, [email,name,haspass], (err,results) => {
                if(err){
                    return res.status(500).json({error: err.message});
                }
                res.json({message: 'User Created Successfully'})
            });

        }
    });


});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    db.query('select * from users where email = ?', [email], async (err, result) => {
        if(err) return res.status(500).json({error: err.messageq});
        if(result.length === 0) {
            return res.status(404).json({message:"User does not exists, try signing up!"});        
        }

        // compare the passsword as user exists
        const user = result[0];
        const check = await encrypt.compare(password,user.password); 
        
        if(check){
            // creating a token 
            const token = jwt.sign({userID: user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
           
            res.cookie('token',token, { httpOnly: true, secure: true, sameSite: 'strict' }); 
          
            
            //httpOnly hides the token from the client side cookie, secure makes it accessible only for https
            res.json({message: "Login Successful!"}); 
            
        }else{
            return res.status(400).json({error:"The Password or the Email does not match !"})
        }

    });
   
});

router.post('/logout',(req,res)=>{
    res.clearCookie('token'); // clearing cookie
    res.json({message:"Logged Out Sucessfully"}); // display message 
});

router.post('/profile',authMiddleware,(req,res)=>{

    const {email} = req.body;
    
    db.query("select * from users where email = ?",[email],(err, result) =>{
        if(err) return res.status(500).json({error: err.messageq});

        if(result.length === 0) {
            console.log("no user found in database");
            return res.status(404).json({message:"User does not exists, try signing up!"});        
        }
         
       // res.json({ message: "Welcome to your profile!", user: email });
        res.json(result[0]);

    });
    
        
    
});

router.get('/profile', authMiddleware ,(req, res) => {
    

   
    const userID = req.user.userID; // ✅ Get user ID from decoded token

    db.query("SELECT id, name, email FROM users WHERE id = ?", [userID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result[0]); // ✅ Send user details
    });
});

module.exports = router;

