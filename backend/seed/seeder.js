import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Institute from "../models/Institute.js";
import Department from "../models/Department.js";

// Load env from backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

const seedDatabase = async () => {
  try {
    console.log("ENV PATH:", join(__dirname, "..", ".env"));
    console.log("MONGO_URI:", process.env.MONGO_URI);
    // Connect to MongoDB Atlas
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Role.deleteMany({});
    await Institute.deleteMany({});
    await Department.deleteMany({});
    console.log("✅ Existing data cleared");

    // Seed Roles
    console.log("Seeding roles...");
    const roles = await Role.insertMany([
      { name: "student", description: "Student user" },
      { name: "faculty", description: "Faculty member / Teacher" },
      { name: "hod", description: "Head of Department" },
      { name: "principal", description: "Principal" },
      { name: "director", description: "Director" },
      { name: "rd_cell", description: "R&D Cell / Research Promotion Cell" },
      { name: "accounts", description: "Accounts / Finance department" },
      { name: "admin", description: "System Administrator" },
      { name: "registrar", description: "Registrar" },
      { name: "vc", description: "Vice Chancellor" },
    ]);
    console.log(`✅ ${roles.length} roles seeded`);

    // Seed Institute
    console.log("Seeding institutes...");
    const institute = await Institute.create({
      name: "Maharishi Markandeshwar (Deemed to be University)",
      code: "MMDU",
    });
    console.log("✅ Institute seeded");

    // Seed Departments
    console.log("Seeding departments...");
    const departments = await Department.insertMany([
      {
        name: "Computer Science & Engineering",
        code: "CSE",
        institute: institute._id,
      },
      {
        name: "Electronics & Communication Engineering",
        code: "ECE",
        institute: institute._id,
      },
      { name: "Mechanical Engineering", code: "ME", institute: institute._id },
      { name: "Civil Engineering", code: "CE", institute: institute._id },
      { name: "Information Technology", code: "IT", institute: institute._id },
    ]);
    console.log(`✅ ${departments.length} departments seeded`);

    // Seed Users (passwords will be hashed by the pre-save hook)
    console.log("Seeding users...");
    const users = [
      {
        name: "Admin",
        email: "admin@mmdu.ac.in",
        password: "Admin@123",
        role: "admin",
        department: "IT Cell",
        institute: "MMDU",
      },
      {
        name: "Student",
        email: "student@mmdu.ac.in",
        password: "Student@123",
        role: "student",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },
      {
        name: "Faculty",
        email: "faculty@mmdu.ac.in",
        password: "Faculty@123",
        role: "faculty",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },
      {
        name: "HOD",
        email: "hod@mmdu.ac.in",
        password: "Hod@123",
        role: "hod",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },
      {
        name: "Principal",
        email: "principal@mmdu.ac.in",
        password: "Principal@123",
        role: "principal",
        department: "Office of Principal",
        institute: "MMDU",
      },
      {
        name: "Director",
        email: "director@mmdu.ac.in",
        password: "Director@123",
        role: "director",
        department: "Office of Director",
        institute: "MMDU",
      },
      {
        name: "RD Cell",
        email: "rd@mmdu.ac.in",
        password: "RD@123",
        role: "rd_cell",
        department: "R&D Cell",
        institute: "MMDU",
      },
      {
        name: "RPC Cell",
        email: "rpc@mmdu.ac.in",
        password: "Rpc@123",
        role: "rpc_cell",
        department: "RPC Cell",
        institute: "MMDU",
      },

      {
        name: "Accounts",
        email: "accounts@mmdu.ac.in",
        password: "Accounts@123",
        role: "accounts",
        department: "Finance & Accounts",
        institute: "MMDU",
      },
      {
        name: "Registrar",
        email: "registrar@mmdu.ac.in",
        password: "Registrar@123",
        role: "registrar",
        department: "Office of Registrar",
        institute: "MMDU",
      },
      {
        name: "VC",
        email: "vc@mmdu.ac.in",
        password: "VC@123",
        role: "vc",
        department: "Office of Vice Chancellor",
        institute: "MMDU",
      },
    ];

    // Use User.create to trigger pre-save hooks for password hashing
    for (const userData of users) {
      const user = await User.create(userData);

      console.log("CREATED:", user.email, "PASSWORD:", user.password);
    }
    console.log(`✅ ${users.length} users seeded`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nDefault login credentials:");
    console.log("─".repeat(50));
    users.forEach((u) => {
      console.log(
        `  ${u.role.padEnd(12)} | ${u.email.padEnd(25)} | ${u.password}`,
      );
    });
    console.log("─".repeat(50));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
