const mongoose = require("mongoose");

const kioskConfigSchema = new mongoose.Schema(
  {
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "pdf"],
          required: true,
        },
        fileUrl: { type: String, required: true },
        fileName: { type: String },
        public_id: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    location: {
      type: String,
      default: "",
    },
    signupLink: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.KioskConfig || mongoose.model("KioskConfig", kioskConfigSchema);
