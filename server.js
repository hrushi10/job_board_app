// importing frameworks to use
const express = require('express');
const cookieParser = require("cookie-parser");
const mysql = require('mysql2');
const cors = require('cors');
//const cookieParser = require("cookie-parser");
// loads env variavble like connection port, id, pass
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// using express.json helps Express read the data sent bny JSON 
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",  
  "http://10.0.0.53:3000",  
  "http://example.com"  // Add more origins as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);  // ✅ Allow request
      } else {
          callback(new Error("Not allowed by CORS"));  // ❌ Block request
      }
  }, // Allow requests only from frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,  // Allow cookies and authentication headers

  })
);

//pp.use(cookieParser()); 

// Setting up MYSQL connection
const db =  mysql.createConnection({
    host: process.env.DB_HOST, //getting database varibales for connection from .env
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// connecting to the database MYSQL
db.connect(err =>{ 
    if(err){
        console.error('MySQL connection faile: ', err);
        return;
    }   
    console.log('MySQL connection Sucessful');
});

module.exports = { db, app };

// getting results from database
app.get('/jobs', (req, res) => { //
    db.query('SELECT * FROM jobs', (err, results) => { // running the query and storing the results in results 
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results); // sends a message from server to client "jobs that are present in db"
    });
  });
  

  app.post('/jobs', (req, res) => {
    const { title, company, location, description } = req.body; // this extracts specific properties from req.body  and stoe it in the following variables
    
    if (!title || !company || !description || !location) { // error checking as our dataabse cannot take empty fields for the following fields
      return res.status(400).json({ error: 'Title, company, location and description are required' });
    }
  
    const query = 'INSERT INTO jobs (title, company, location, description) VALUES (?, ?, ?, ?)'; // creating a query to insert the job in db
    
    db.query(query, [title, company, location, description], (err, results) => { // inserting the job by running the query just made and any inline parameters are written in [para1, para2]
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Job posted successfully', jobId: results.insertId }); // sends a message from server to client "job posted"
    });
  });

 
// const xyz = (para1, para2) => console.log() is like creating a new function where xyz is name of function, 
//(contains the parametters) and anything after => is the body of the function 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // starting server by listing on port 

app.use(cookieParser());
const authRoutes = require('./Routes/authRoutes'); // getting the authRoutes module to pass the incoming req
app.use('/auth', authRoutes); // this helpsm the server pass req starting with /auth
