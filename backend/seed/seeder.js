import "./dns-fix.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Institute from "../models/Institute.js";
import Department from "../models/Department.js";
import Claim from "../models/Claim.js";

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
      // =========================
      // ADMIN
      // =========================
      {
        name: "Admin",
        email: "admin@mmdu.ac.in",
        password: "Admin@123",
        role: "admin",
        department: "IT Cell",
        institute: "MMDU",
      },

      // =========================
      // STUDENT
      // =========================
      {
        name: "Aman Verma",
        email: "student@mmdu.ac.in",
        password: "Student@123",
        role: "student",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },

      // =========================
      // COMPUTER SCIENCE & ENGINEERING
      // (HOD EXISTS)
      // =========================

      {
        name: "Dr. Rahul Sharma",
        email: "rahul.sharma@mmdu.ac.in",
        password: "Faculty@123",
        role: "faculty",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },

      {
        name: "Dr. Priya Mehta",
        email: "priya.mehta@mmdu.ac.in",
        password: "Faculty@123",
        role: "faculty",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },

      {
        name: "Dr. Amit Verma",
        email: "amit.verma@mmdu.ac.in",
        password: "Hod@123",
        role: "hod",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },

      // View-only principal for Engineering
      {
        name: "Dr. Neeraj Gupta",
        email: "principal.cse@mmdu.ac.in",
        password: "Principal@123",
        role: "principal",
        department: "Computer Science & Engineering",
        institute: "MMDU",
      },

      // =========================
      // PHARMACY
      // (NO HOD)
      // =========================

      {
        name: "Dr. Anjali Kapoor",
        email: "anjali.kapoor@mmdu.ac.in",
        password: "Faculty@123",
        role: "faculty",
        department: "Pharmacy",
        institute: "MMDU",
      },

      {
        name: "Dr. Vivek Sharma",
        email: "vivek.sharma@mmdu.ac.in",
        password: "Faculty@123",
        role: "faculty",
        department: "Pharmacy",
        institute: "MMDU",
      },

      // Principal becomes approver because Pharmacy has no HOD
      {
        name: "Dr. Meena Arora",
        email: "principal.pharmacy@mmdu.ac.in",
        password: "Principal@123",
        role: "principal",
        department: "Pharmacy",
        institute: "MMDU",
      },

      // =========================
      // UNIVERSITY LEVEL
      // =========================

      {
        name: "Prof. S.K. Verma",
        email: "director@mmdu.ac.in",
        password: "Director@123",
        role: "director",
        department: "Administration",
        institute: "MMDU",
      },

      {
        name: "R&D Cell Coordinator",
        email: "rd@mmdu.ac.in",
        password: "RD@123",
        role: "rd_cell",
        department: "Administration",
        institute: "MMDU",
      },

      {
        name: "RPC Cell Coordinator",
        email: "rpc@mmdu.ac.in",
        password: "Rpc@123",
        role: "rpc_cell",
        department: "Administration",
        institute: "MMDU",
      },

      {
        name: "Accounts Officer",
        email: "accounts@mmdu.ac.in",
        password: "Accounts@123",
        role: "accounts",
        department: "Administration",
        institute: "MMDU",
      },

      {
        name: "Registrar",
        email: "registrar@mmdu.ac.in",
        password: "Registrar@123",
        role: "registrar",
        department: "Administration",
        institute: "MMDU",
      },

      {
        name: "Vice Chancellor",
        email: "vc@mmdu.ac.in",
        password: "VC@123",
        role: "vc",
        department: "Administration",
        institute: "MMDU",
      },
    ];

    const createdUsers = [];
    // Use User.create to trigger pre-save hooks for password hashing
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log("CREATED:", user.email, "PASSWORD:", user.password);

      // Relink existing claims in database for this faculty member to the new user _id
      await Claim.updateMany(
        { applicantName: { $regex: new RegExp(`^${user.name.trim()}$`, 'i') } },
        { $set: { applicant: user._id, department: user.department } }
      );
    }
    console.log(`✅ ${createdUsers.length} users seeded & existing claims relinked`);

    // Seed sample claims if Claim collection is empty
    const existingClaimsCount = await Claim.countDocuments({});
    if (existingClaimsCount === 0) {
      const priyaUser = createdUsers.find((u) => u.email === "priya.mehta@mmdu.ac.in");
      if (priyaUser) {
        console.log("Seeding initial sample claims for Dr. Priya Mehta...");
        await Claim.create([
          {
            claimNumber: "RPMS-2026-0129",
            applicant: priyaUser._id,
            applicantName: priyaUser.name,
            department: priyaUser.department,
            applicantRole: priyaUser.role,
            category: "research_publications",
            subtype: "journal_publication",
            title: "Advanced Machine Learning Algorithms for Healthcare Predictive Analytics",
            metadata: {
              quartile: "Q1",
              impactFactor: "6.8",
              journalName: "IEEE Transactions on Neural Networks and Learning Systems",
              publisher: "IEEE",
              doi: "10.1109/TNNLS.2026.3150241"
            },
            status: "COMPLETED",
            currentDesk: "accounts",
            financialYear: "2026-2027",
            totalIncentive: 25000,
            individualShare: 25000,
            calculatedAmount: 25000,
            approvedAmount: 25000,
            isAccountsApproved: true,
            isPaid: true,
            paymentStatus: "PAID",
            releasedAmount: 25000,
            paidAmount: 25000
          },
          {
            claimNumber: "RPMS-2026-0130",
            applicant: priyaUser._id,
            applicantName: priyaUser.name,
            department: priyaUser.department,
            applicantRole: priyaUser.role,
            category: "research_publications",
            subtype: "journal_publication",
            title: "Scalable Distributed Systems for Cloud Intelligence",
            metadata: {
              quartile: "Q2",
              impactFactor: "4.2",
              journalName: "Journal of Systems Architecture",
              publisher: "Elsevier",
              doi: "10.1016/j.sysarc.2026.10284"
            },
            status: "COMPLETED",
            currentDesk: "accounts",
            financialYear: "2026-2027",
            totalIncentive: 20000,
            individualShare: 20000,
            calculatedAmount: 20000,
            approvedAmount: 20000,
            isAccountsApproved: true,
            isPaid: false,
            paymentStatus: "APPROVED_BY_ACCOUNTS"
          }
        ]);
        console.log("✅ Sample claims seeded for Dr. Priya Mehta");
      }
    }

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
