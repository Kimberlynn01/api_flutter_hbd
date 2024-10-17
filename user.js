const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  const db = createDBConnection();

  const sql = "SELECT * FROM user";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });

  db.end();
});


router.post("/add", (req, res) => {
  const db = createDBConnection();
  const { username, name, password } = req.body;

  try{
    const hasedPassword = await bcrypt.hash(password, 10);
    
    const sql = "INSERT INTO user (username, name, password) VALUES (?, ?, ?)";
    db.query(sql, [username, name, hasedPassword], (err, results) => {
      if(err){
        return res.status(500).json({error: err.message});
      }
      return res.status(201).json({message: "User Successfulled Add!", userId: results.insertId});
    });
  }catch(error){
    return res.status(500).json({error: "Error Add User"});
  }finally{
    db.end();
  }
});
module.exports = router;
