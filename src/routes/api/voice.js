// routes/voice.js

const express = require("express");
const router = express.Router();
const Voice = require("../models/voice");

// @route   GET /api/voice
// @desc    Fetch all voice tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Voice.find().sort({ created_at: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching voice tasks:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/voice
// @desc    Create a new voice task
router.post("/", async (req, res) => {
  const { description, due_at, time } = req.body;

  try {
    const newTask = new Voice({ description, due_at, time });
    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task created successfully!", task: savedTask });
  } catch (error) {
    console.error("Error saving voice task:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/voice/:id
// @desc    Update a voice task by ID
router.put("/:id", async (req, res) => {
  const { description, due_at, time } = req.body;

  try {
    const updatedTask = await Voice.findByIdAndUpdate(
  req.params.id,
  {
    $set: {
      description,
      due_at,
      time
    }
  },
  {
    new: true,
    runValidators: true
  }
);

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully!", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/voice/:id
// @desc    Delete a voice task by ID
// @route   DELETE /api/voice/:id
// @desc    Delete a voice task by ID
// @access  Public or Protected (adjust as needed)
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check for valid MongoDB ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid Task ID format" });
      }
  
      const deletedTask = await Voice.findByIdAndDelete(id);
  
      if (!deletedTask) {
        return res.status(404).json({ message: "No task found with the given ID" });
      }
  
      res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
      console.error("Error deleting voice task:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

module.exports = router;
