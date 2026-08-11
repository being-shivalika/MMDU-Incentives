// seedFaculty.js

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const users = [
  {
    name: "Neelam Oberoi",
    email: "neelamoberoi1030@mmumullana.org",
    password: "112305",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "112305",
    isActive: true,
  },

  {
    name: "Dr. Prachi Garg",
    email: "prachigarg@mmumullana.org",
    password: "112003",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "112003",
    isActive: true,
  },

  {
    name: "Dr. Shaweta Sachdeva",
    email: "shaweta.sachdeva@mmumullana.org",
    password: "150142",
    role: "faculty",
    department: "MCA",
    institute: "MMDU",
    employeeId: "150142",
    isActive: true,
  },

  {
    name: "Dr. Poonam Singh",
    email: "poonam.singh@mmumullana.org",
    password: "112602",
    role: "faculty",
    department: "MCA",
    institute: "MMDU",
    employeeId: "112602",
    isActive: true,
  },

  {
    name: "Dr. Priyanka Tuli",
    email: "priyanka.tuli@mmumullana.org",
    password: "112625",
    role: "faculty",
    department: "MCA",
    institute: "MMDU",
    employeeId: "112625",
    isActive: true,
  },

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
    name: "Dr. Tejbir Singh",
    email: "tejbir.singh@mmumullana.org",
    password: "150102",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "150102",
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

  {
    name: "Dr. Vishal Gupta",
    email: "vishal.gupta@mmumullana.org",
    password: "112235",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "112235",
    isActive: true,
  },

  {
    name: "Dr. Mani Goyal",
    email: "dr.mani.goyal@mmumullana.org",
    password: "112473",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "112473",
    isActive: true,
  },

  {
    name: "Dr. Sandip Kumar Goel",
    email: "skgmmec@mmumullana.org",
    password: "112175",
    role: "faculty",
    department: "Computer Science & Engineering",
    institute: "MMDU",
    employeeId: "112175",
    isActive: true,
  },

  {
    name: "Test Faculty User",
    email: "test@gmail.com",
    password: "test3456",
    role: "faculty",
    department: "MCA",
    institute: "MMDU",
    employeeId: "112305-test",
    isActive: true,
  },

  {
    name: "Dr. Tejinder Kaur",
    email: "tejinder.kaur@mmumullana.org",
    password: "112540",
    role: "faculty",
    department: "MCA",
    institute: "MMDU",
    employeeId: "112540",
    isActive: true,
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const userData of users) {
      const normalizedEmail = userData.email.toLowerCase().trim();
      userData.email = normalizedEmail;

      let existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        existingUser.name = userData.name;
        existingUser.email = normalizedEmail;
        existingUser.password = userData.password;
        existingUser.role = userData.role;
        existingUser.department = userData.department;
        existingUser.institute = userData.institute;
        existingUser.employeeId = userData.employeeId;
        existingUser.isActive = userData.isActive;
        await existingUser.save();
        console.log(`🔄 Updated credentials & email for: ${normalizedEmail}`);
      } else {
        await User.create(userData);
        console.log(`✅ Created: ${userData.name}`);
        console.log(`   Email: ${normalizedEmail}`);
        console.log(`   Employee ID: ${userData.employeeId}`);
      }
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