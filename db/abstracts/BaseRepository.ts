import { Model } from 'mongoose';
import { IEntity } from '../interfaces/models';
import { IRepository } from '../interfaces/repositories';
import dbConnect from '../mongodb';

export abstract class BaseRepository<T extends IEntity> implements IRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /** Ensure database is connected before any operation */
  protected async connect(): Promise<void> {
    await dbConnect();
  }

  // ─── IReadable<T> ────────────────────────────────────────────────

  public async findById(id: string): Promise<T | null> {
    await this.connect();
    return await this.model.findById(id).lean();
  }

  public async findAll(): Promise<T[]> {
    await this.connect();
    return await this.model.find({}).sort({ createdAt: -1 }).lean();
  }

  public async findByFilter(predicate: (item: T) => boolean): Promise<T[]> {
    // Note: predicate filtering in-memory is inefficient for MongoDB.
    // In a real system design, we would pass a MongoDB query object.
    // For this refactor, we'll fetch all and filter to maintain interface compatibility,
    // but in a real project, we'd add findByQuery(query: any).
    await this.connect();
    const all = await this.findAll();
    return all.filter(predicate);
  }

  // ─── IWritable<T> ────────────────────────────────────────────────

  public async create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    await this.connect();
    const newRecord = await this.model.create(data as any);
    return newRecord.toObject() as T;
  }

  public async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.connect();
    const updated = await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    return updated as T | null;
  }

  // ─── IDeletable ──────────────────────────────────────────────────

  public async delete(id: string): Promise<boolean> {
    await this.connect();
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
