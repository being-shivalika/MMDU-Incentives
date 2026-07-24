import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic Identity
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // User Role
    role: {
      type: String,
      required: true,
      enum: [
        "student",
        "faculty",
        "hod",
        "principal",
        "director",
        "rd_cell",
        "rpc_cell",
        "accounts",
        "registrar",
        "vc",
        "admin",
      ],
    },

    // Organization Details
    department: {
      type: String,
      default: null,
      trim: true,
    },

    institute: {
      type: String,
      default: "MMDU",
      trim: true,
    },

    // Identification
    employeeId: {
      type: String,
      default: null,
      trim: true,
    },

    studentId: {
      type: String,
      default: null,
      trim: true,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Additional Information
    phone: {
      type: String,
      default: null,
    },

    designation: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
