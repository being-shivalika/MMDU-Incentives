// seedFaculty.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const users = [
  {
    name: "Sh. R.K. Kaushik",
    email: "mmu.acs@mmumullana.org",
    password: "102236",
    role: "accounts",
    department: "Accounts",
    institute: "MMDU",
    employeeId: "102236",
    isActive: true,
  },

  {
    name: "Dr. Sumit Mittal",
    email: "registrarmmu@mmumullana.org",
    password: "150092",
    role: "registrar",
    department: "Registrar",
    institute: "MMDU",
    employeeId: "150092",
    isActive: true,
  },

  {
    name: "Dr. Adesh Saini",
    email: "sainiade@mmumullana.org",
    password: "112117",
    role: "rd_cell",
    department: "R&D",
    institute: "MMDU",
    employeeId: "112117",
    isActive: true,
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const userData of users) {
      const existingUser = await User.findOne({
        email: userData.email,
      });

      if (existingUser) {
        console.log(`⚠️ Already exists: ${userData.email}`);
        continue;
      }

      await User.create(userData);

      console.log(`✅ Created: ${userData.name}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Employee ID: ${userData.employeeId}`);
    }

    console.log("\n🎉 Seeding completed successfully!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedUsers();