const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema({
  description: {
    type: String
    required: true,
  },
  due_at: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Voice", VoiceSchema);
