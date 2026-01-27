const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// CREATE lead (from website contact form)
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all leads (admin dashboard)
router.get("/", async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// UPDATE lead status
router.put("/:id/status", async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(lead);
});

// ADD follow-up note
router.post("/:id/notes", async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  lead.notes.push({ message: req.body.message });
  await lead.save();
  res.json(lead);
});

module.exports = router;

router.post("/:id/notes", async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  lead.notes.push({
    text: req.body.text,
    date: new Date()
  });
  await lead.save();
  res.json(lead);
});
