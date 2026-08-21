const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    // Not globally unique: two accounts can legitimately hold the same
    // gmailId, so uniqueness is scoped to the owner by the compound index
    // declared below.
    gmailId: {
      type: String,
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

// One document per (message, owner). Sparse so documents created without a
// gmailId (e.g. the dummy-email route) don't collide on a null key.
emailSchema.index({ gmailId: 1, ownerEmail: 1 }, { unique: true, sparse: true });

module.exports =
  mongoose.model("Email", emailSchema);
