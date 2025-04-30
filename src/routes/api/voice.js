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
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Voice.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
