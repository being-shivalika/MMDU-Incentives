import mongoose from "mongoose";

const circularSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "ANNOUNCEMENT",
      trim: true,
    },
    audience: {
      type: String,
      default: "All Users",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdByName: {
      type: String,
      default: "Admin",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Circular = mongoose.model("Circular", circularSchema);

export default Circular;
