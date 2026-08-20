import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n==================================================');
    console.error('❌ MONGODB CONNECTION ERROR:');
    console.error(`   ${error.message}`);
    console.error('==================================================');
    if (error.message.includes('whitelisted') || error.message.includes('selection') || error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('👉 HOW TO FIX (MONGODB ATLAS IP WHITELIST):');
      console.error('   1. Log in to MongoDB Atlas: https://cloud.mongodb.com/');
      console.error('   2. Navigate to: Network Access (under Security in left sidebar).');
      console.error('   3. Click "Add IP Address" -> Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0).');
      console.error('   4. Save changes and wait 1-2 minutes for Atlas to apply network settings.\n');
      console.error('   OR (For Local MongoDB):');
      console.error('   Update MONGO_URI in backend/.env to: mongodb://127.0.0.1:27017/mmdu-policy-test');
      console.error('==================================================\n');
    }
    process.exit(1);
  }
};

export default connectDB;
