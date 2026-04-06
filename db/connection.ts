import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });


class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Using existing database connection');
      return;
    }

    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
      process.exit(1);
    }

    try {
      const db = await mongoose.connect(uri);
      this.isConnected = db.connections[0].readyState === 1;
      console.log('Successfully connected to Task Forge Database');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export default DatabaseConnection.getInstance();