import "./dns-fix.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

const usersToUpsert = [
  {
    name: "Dr. Vishal Bharti",
    email: "principalmmec@mmulullana.org",
    password: "112423",
    role: "principal",
    department: "Principal",
    institute: "MMEC",
    employeeId: "112423",
    isActive: true,
    isFirstLogin: false
  },
  {
    name: "Dr. Vishal Bharti",
    email: "vishal.bharti@mmumullana.org",
    password: "112423",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "112423",
    isActive: true,
    isFirstLogin: false
  },
  {
    name: "Dr. Vishal Bharti",
    email: "principalmmictbm@mmumullana.org",
    password: "150092",
    role: "principal",
    department: "Principal",
    institute: "MMICTBM",
    employeeId: "150092",
    isActive: true,
    isFirstLogin: false
  }
];

const seedTargetUsers = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    for (const u of usersToUpsert) {
      const email = u.email.toLowerCase().trim();
      let existing = await User.findOne({ email });

      if (existing) {
        console.log(`Updating existing user: ${email}`);
        existing.name = u.name;
        existing.password = u.password;
        existing.role = u.role;
        existing.department = u.department;
        existing.institute = u.institute;
        existing.employeeId = u.employeeId;
        existing.isActive = true;
        existing.isFirstLogin = false;
        await existing.save();
        console.log(`✅ Updated ${email}`);
      } else {
        console.log(`Creating new user: ${email}`);
        await User.create(u);
        console.log(`✅ Created ${email}`);
      }
    }

    console.log("\n🎉 Target users created/updated successfully in MongoDB!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedTargetUsers();
