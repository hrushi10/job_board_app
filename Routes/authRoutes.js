const express = require('express');
const router = express.Router();
const server = require('../server.js');
const db = server.db;
const authMiddleware = require('../middleware/auth.js');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;



const jwt = require('jsonwebtoken')
require('dotenv').config();

// importing bcryptjs to hash password
const encrypt = require('bcryptjs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
});
  
const upload = multer({ storage });

router.post('/signup', upload.single("profilePicture"), async (req, res) => {
    const { email, fName, lName, password, userType, workStatus, phone, pAddress, companyName, jobTitle, comAddress } = req.body;
    const file = req.file;

    if (!email || !fName || !lName || !password || !userType || !workStatus) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const fname = `${fName} ${lName}`;
    const cName = companyName || "na";
    const title = jobTitle || "na";
    const cAddress = comAddress || "na";
    const paddress = pAddress || "na";

    try {
        const [existingUser] = await new Promise((resolve, reject) => {
            db.query('SELECT email FROM Users WHERE email = ?', [email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists. Try logging in." });
        }

        const salt = await encrypt.genSalt(10);
        const hashedPassword = await encrypt.hash(password, salt);

        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (email, name, password, userType, workStatus) VALUES (?, ?, ?, ?, ?)',
                [email, fname, hashedPassword, userType, workStatus],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        let pictureUrl = null;
        if (file) {
            const fileUrl = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pictures",
            });
            pictureUrl = fileUrl.url;
        }

        const [user] = await new Promise((resolve, reject) => {
            db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const Uid = user.id;

        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO profileData (id, pAddress, company, title, comAddress, pNumber, picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [Uid, paddress, cName, title, cAddress, phone, pictureUrl],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred during signup." });
    }
});

// * login route*//
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    db.query('select * from users where email = ?', [email], async (err, result) => {
        if(err) return res.status(500).json({error: err.message});
        if(result.length === 0) {
            return res.status(404).json({message:"User does not exists, try signing up!"});        
        }

        // compare the password as user exists
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
    res.json({message:"Logged Out Successfully"}); // display message 
});




// * getting the profile data to display*//
router.get('/profile', authMiddleware ,(req, res) => {
    

   
    const userID = req.user.userID; // ✅ Get user ID from decoded token
    const profileData = { fullName: "", jobTitle: "" ,address: "", email:"", phone: "", company:"", picture:"", comAddress:""};

     db.query("SELECT id, name, email FROM users WHERE id = ?", [userID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
             return res.status(404).json({ error: "User not found error in profile" });
        }

       
            profileData.fullName = result[0].name;
            
            profileData.email = result[0].email;
    });

     db.query("SELECT * FROM ProfileData WHERE id = ?", [userID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found in ProfileData" });
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

// * updating the profile data*//
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


// * uploading the profile picture*//
{
  
router.post("/upload", upload.single("image"), authMiddleware, async (req, res) => {

    const userID = req.user.userID;

    if (!req.file) return res.status(400).send("No file uploaded.");

    const fileUrl = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures"
    });
       
    db.query("UPDATE ProfileData SET picture = ? WHERE id = ?", [fileUrl.url, userID]);

    res.json({ filePath: fileUrl });
});

}




module.exports = router;

