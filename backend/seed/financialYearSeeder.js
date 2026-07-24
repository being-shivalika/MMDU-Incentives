import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import FinancialYear from '../models/FinancialYear.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const financialYears = [
  { label: '2024-25', startDate: new Date('2024-04-01'), endDate: new Date('2025-03-31'), isCurrent: false, isActive: true },
  { label: '2025-26', startDate: new Date('2025-04-01'), endDate: new Date('2026-03-31'), isCurrent: false, isActive: true },
  { label: '2026-27', startDate: new Date('2026-04-01'), endDate: new Date('2027-03-31'), isCurrent: true, isActive: true },
  { label: '2027-28', startDate: new Date('2027-04-01'), endDate: new Date('2028-03-31'), isCurrent: false, isActive: true }
];

const seedFinancialYears = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    await FinancialYear.deleteMany({});
    console.log('Cleared existing financial years');
    
    const created = await FinancialYear.insertMany(financialYears);
    console.log(`✅ ${created.length} financial years seeded`);
    created.forEach(fy => {
      console.log(`  ${fy.label} ${fy.isCurrent ? '(CURRENT)' : ''} | ${fy.startDate.toDateString()} - ${fy.endDate.toDateString()}`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Financial year seeding failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedFinancialYears();
