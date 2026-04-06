import mongoose from 'mongoose';

export class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Fix accidental duplication like MONGODB_URI=MONGODB_URI=...
    const uri = rawUri.startsWith('MONGODB_URI=') ? rawUri.replace('MONGODB_URI=', '') : rawUri;

    try {
      const db = await mongoose.connect(uri);
      this.isConnected = db.connections[0].readyState === 1;
      console.log('MongoDB connected successfully to:', uri.split('@')[1] || 'local');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
