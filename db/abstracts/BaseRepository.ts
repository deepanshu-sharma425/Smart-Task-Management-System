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
    // NOTE: This method is inefficient for MongoDB as it loads all records into memory.
    // Prefer findByQuery() for MongoDB-native filtering.
    await this.connect();
    const all = await this.findAll();
    return all.filter(predicate);
  }

  /**
   * Find records using a native MongoDB query object.
   * More efficient than findByFilter() for large collections.
   */
  public async findByQuery(query: Record<string, unknown>): Promise<T[]> {
    await this.connect();
    return await this.model.find(query).sort({ createdAt: -1 }).lean();
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
