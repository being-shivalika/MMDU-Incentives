import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import PolicyRule from '../models/PolicyRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const policyRules = [
  // Research Publications - Journal
  { category: 'research_publications', subtype: 'journal', condition: 'Q1_SCI_SCIE', conditionLabel: 'Q1 Journal (SCI/SCIE Indexed)', applicantType: 'both', incentiveAmount: 15000, currency: 'INR', scorePoints: 30, maxClaimsPerYear: 10, maxAmountPerYear: 200000, multiAuthorRule: 'divide_equally', description: 'Q1 quartile journal paper indexed in SCI/SCIE' },
  { category: 'research_publications', subtype: 'journal', condition: 'Q2_SCI_SCIE', conditionLabel: 'Q2 Journal (SCI/SCIE Indexed)', applicantType: 'both', incentiveAmount: 10000, currency: 'INR', scorePoints: 20, maxClaimsPerYear: 10, maxAmountPerYear: 200000, multiAuthorRule: 'divide_equally', description: 'Q2 quartile journal paper indexed in SCI/SCIE' },
  { category: 'research_publications', subtype: 'journal', condition: 'Q3_Q4_SCI_SCIE', conditionLabel: 'Q3/Q4 Journal (SCI/SCIE Indexed)', applicantType: 'both', incentiveAmount: 7000, currency: 'INR', scorePoints: 10, multiAuthorRule: 'divide_equally', description: 'Q3 or Q4 quartile journal paper indexed in SCI/SCIE' },
  { category: 'research_publications', subtype: 'journal', condition: 'SCOPUS_ONLY', conditionLabel: 'Scopus-Indexed Journal (Non-SCI)', applicantType: 'both', incentiveAmount: 5000, currency: 'INR', scorePoints: 10, multiAuthorRule: 'divide_equally', description: 'Scopus-indexed but not SCI/SCIE' },
  { category: 'research_publications', subtype: 'journal', condition: 'UGC_CARE', conditionLabel: 'UGC CARE Listed Journal', applicantType: 'both', incentiveAmount: 3000, currency: 'INR', scorePoints: 5, multiAuthorRule: 'divide_equally', description: 'UGC CARE listed journal' },
  
  // Research Publications - Conference
  { category: 'research_publications', subtype: 'conference', condition: 'IEEE_ACM_SCOPUS', conditionLabel: 'IEEE/ACM/Scopus-Indexed Conference', applicantType: 'both', incentiveAmount: 5000, currency: 'INR', scorePoints: 15, multiAuthorRule: 'divide_equally', description: 'IEEE, ACM, or Scopus indexed conference' },
  { category: 'research_publications', subtype: 'conference', condition: 'OTHER_INDEXED', conditionLabel: 'Other Indexed Conference', applicantType: 'both', incentiveAmount: 3000, currency: 'INR', scorePoints: 10, multiAuthorRule: 'divide_equally', description: 'Other indexed conference proceedings' },
  
  // Books & Chapters
  { category: 'books_chapters', subtype: 'book', condition: 'INTERNATIONAL_PUBLISHER', conditionLabel: 'Book by International Publisher', applicantType: 'both', incentiveAmount: 10000, currency: 'INR', scorePoints: 25, multiAuthorRule: 'divide_equally', description: 'Book published by international publisher (Springer, Elsevier, Wiley, etc.)' },
  { category: 'books_chapters', subtype: 'book', condition: 'NATIONAL_PUBLISHER', conditionLabel: 'Book by National Publisher', applicantType: 'both', incentiveAmount: 5000, currency: 'INR', scorePoints: 15, multiAuthorRule: 'divide_equally', description: 'Book published by national/regional publisher' },
  { category: 'books_chapters', subtype: 'book_chapter', condition: 'ANY', conditionLabel: 'Book Chapter', applicantType: 'both', incentiveAmount: 3000, currency: 'INR', scorePoints: 10, multiAuthorRule: 'divide_equally', description: 'Chapter in an edited book' },
  { category: 'books_chapters', subtype: 'book_chapter_vol', condition: 'ANY', conditionLabel: 'Book Chapter (Volume)', applicantType: 'both', incentiveAmount: 3000, currency: 'INR', scorePoints: 10, multiAuthorRule: 'divide_equally', description: 'Chapter in a book volume' },
  { category: 'books_chapters', subtype: 'edited_book', condition: 'ANY', conditionLabel: 'Edited Book', applicantType: 'both', incentiveAmount: 7000, currency: 'INR', scorePoints: 20, multiAuthorRule: 'divide_equally', description: 'Edited book volume' },
  
  // Intellectual Property
  { category: 'intellectual_property', subtype: 'patent_granted', condition: 'GRANTED_INDIAN', conditionLabel: 'Patent Granted (Indian)', applicantType: 'both', incentiveAmount: 15000, currency: 'INR', scorePoints: 40, multiAuthorRule: 'first_author_full', description: 'Patent granted by Indian Patent Office' },
  { category: 'intellectual_property', subtype: 'patent_granted', condition: 'GRANTED_INTERNATIONAL', conditionLabel: 'Patent Granted (International)', applicantType: 'both', incentiveAmount: 25000, currency: 'INR', scorePoints: 50, multiAuthorRule: 'first_author_full', description: 'Patent granted by international patent office (USPTO, EPO, etc.)' },
  { category: 'intellectual_property', subtype: 'patent_filed', condition: 'FILED', conditionLabel: 'Patent Filed', applicantType: 'both', incentiveAmount: 5000, currency: 'INR', scorePoints: 10, multiAuthorRule: 'first_author_full', description: 'Patent application filed' },
  { category: 'intellectual_property', subtype: 'copyright', condition: 'REGISTERED', conditionLabel: 'Copyright Registered', applicantType: 'both', incentiveAmount: 3000, currency: 'INR', scorePoints: 10, description: 'Copyright registration certificate' },
  
  // Innovation & Projects
  { category: 'innovation_projects', subtype: 'startup_registered', condition: 'REGISTERED', conditionLabel: 'Registered Startup', applicantType: 'both', incentiveAmount: 20000, currency: 'INR', scorePoints: 35, description: 'Registered startup/spin-off company' },
  { category: 'innovation_projects', subtype: 'startup_incubated', condition: 'INCUBATED', conditionLabel: 'Incubated Startup', applicantType: 'both', incentiveAmount: 15000, currency: 'INR', scorePoints: 30, description: 'Startup incubated at university incubator' },
  { category: 'innovation_projects', subtype: 'consultancy', condition: 'ANY', conditionLabel: 'Consultancy Assignment', applicantType: 'faculty', incentiveAmount: 5000, currency: 'INR', scorePoints: 15, description: 'Industry consultancy or contract research' },
  { category: 'innovation_projects', subtype: 'funded_project', condition: 'ANY', conditionLabel: 'Sponsored Research Project', applicantType: 'both', incentiveAmount: 10000, currency: 'INR', scorePoints: 25, description: 'Government or private agency funded research grant' }
];

const seedPolicies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    await PolicyRule.deleteMany({});
    console.log('Cleared existing policy rules');
    
    const created = await PolicyRule.insertMany(policyRules);
    console.log(`✅ ${created.length} policy rules seeded`);
    
    console.log('\nPolicy Rules:');
    console.log('─'.repeat(80));
    created.forEach(r => {
      console.log(`  ${r.category.padEnd(25)} | ${r.subtype.padEnd(20)} | ${r.condition.padEnd(25)} | ₹${r.incentiveAmount}`);
    });
    console.log('─'.repeat(80));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Policy seeding failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedPolicies();
