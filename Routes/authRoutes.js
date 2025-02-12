
const express = require('express');
const router = express.Router();
const server = require('../server.js');

const db = server.db;

router.post('/signup', (req, res) => {

    const {email, name, password} = req.body;

    db.query('select email from Users where email = ?', [email], (err, results) =>{
        if(err){
            return res.status(500).json({ error: err.message }); 
        }else if(results.length >0){
            return res.status(404).json({ error: "User already Exists, Try login" });
        }else{

            const insertQuery= 'INSERT INTO users (email,name, password) values (?,?,?)';
            db.query(insertQuery, [email,name,password], (err,results) => {
                if(err){
                    return res.status(500).json({error: err.message});
                }
                res.json({message: 'User Created successfully'})
            });

        }
    });


});

module.exports = router;

