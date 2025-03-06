
const express = require('express');
const router = express.Router();
const server = require('../server.js');
const db = server.db;
const authMiddleware = require('../middleware/auth.js');
const multer = require("multer");
const path = require("path");



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
        if(err) return res.status(500).json({error: err.message});
        if(result.length === 0) {
            return res.status(404).json({message:"User does not exists, try signing up!"});        
        }

        // compare the passsword as user exists
        const user = result[0];
        const check = await encrypt.compare(password,user.password); 
        
        if(check){
            // creating a token 
            const token = jwt.sign({userID: user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
            //console.log("token in login: ", token);
            res.cookie('token',token, { httpOnly: true, secure: false, sameSite: 'lax' }); 
            //res.cookie('token', token);
            
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

router.post('/edit',(req,res)=>{
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
    const profileData = { fullName: "", jobTitle: "" ,address: "", email:"", phone: "", company:"", picture:"", comAddress:""};

    db.query("SELECT id, name, email FROM users WHERE id = ?", [userID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

       
            profileData.fullName = result[0].name;
            
            profileData.email = result[0].email;
    });

    db.query("SELECT * FROM ProfileData WHERE id = ?", userID, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        profileData.address = result[0].pAddress;
        profileData.jobTitle = result[0].title;
        profileData.phone = result[0].pNumber;
        profileData.company = result[0].company;
        profileData.comAddress = result[0].comAddress;
        profileData.picture = result[0].picture;

        res.json(profileData);
});

});


router.post('/saveProfile', (req, res) => {
    const { fullName, jobTitle, address, email, phone } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [fullName, email, decoded.userID],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Now execute the second query inside the first query's callback
            db.query(
                "UPDATE profileData SET pAddress = ?, title = ?, pNumber = ? WHERE id = ?",
                [address, jobTitle, phone, decoded.userID],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Now send the response after both queries finish
                     res.json({ message: "Profile Data saved successfully" });
                }
            );
        }
    );

   
});




const storage = multer.diskStorage({
    destination: path.join("C:\\Users\\patel\\NodeJs-Worksapce\\Project Uploads\\Profile Pictures"),
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
  });
  
  const upload = multer({ storage });
  
//   router.post("/upload", upload.single("image"), (req, res) => {
//     if (!req.file) return res.status(400).send("No file uploaded.");
//     res.json({ filePath: `http://localhost:5000/${req.file.filename}` });

router.use("/uploads", express.static("C:\\Users\\patel\\NodeJs-Worksapce\\Project Uploads\\Profile Pictures"));

router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");
    
    // Correct file path
    res.json({ filePath: `http://localhost:5000/uploads/${req.file.filename}` });
  });

module.exports = router;

