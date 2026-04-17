const express = require('express');
const router = express.Router();
const server = require('../server.js');
const db = server.db;
const authMiddleware = require('../middleware/auth.js');

router.get('/jobs', (req, res) => {

    const jobposts = { jobId: "", jobTitle: "", jobDescription: "", companyAddress: "", jobCompany: "", salary: "", postedAt: "" };

    const getPosts = 'select * from jobposts inner join jobdescription on jobposts.jobId = jobdescription.jobId;';


    db.query(getPosts, (err, results) => {
        if (err) {

            return res.status(500).json({ error: err.message });
        }

        res.json(results);

    });


});

module.exports = router;