const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@crm.com" && password === "admin123") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

module.exports = router;
