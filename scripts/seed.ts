import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables before anything else
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../db/models/UserSchema';
import dbConnect from '../db/mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await dbConnect();
    console.log('🌱 Seeding database...');

    // Clear existing users
    await User.deleteMany({ email: 'admin@taskforge.io' });

    const hashedPassword = await bcrypt.hash('admin123', 12);

    await User.create({
      name: 'Admin User',
      email: 'admin@taskforge.io',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created: admin@taskforge.io / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
