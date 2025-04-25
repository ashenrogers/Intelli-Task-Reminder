const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  due_at: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  toBeReminded: {
    type: Boolean,
    required: true,
    default: false
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
  category: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
    ref: "user"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
