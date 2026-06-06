const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    gmailId: {
      type: String,
      unique: true,
    },

    ownerEmail: {
      type: String,
      index: true,
    },
    
    threadId: String,

    snippet: String,
    body: String,
    sender: String,
    senderEmail: String,
    subject: String,
    date: Date,

    summary: String,

    priority: String,

    action: String,

    reply: String,
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Email", emailSchema);
