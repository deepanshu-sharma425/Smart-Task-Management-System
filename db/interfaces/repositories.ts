// ─── Repository Interfaces ───────────────────────────────────────────
// Follows Interface Segregation Principle (ISP):
//   Instead of one bloated ICrudRepository, we split into IReadable, IWritable, IDeletable.
//   Consumers only depend on what they need.
//
// Follows Dependency Inversion Principle (DIP):
//   API routes depend on these abstractions, not concrete file-system implementations.

import { IEntity } from './models';

// ─── Segregated Interfaces ───────────────────────────────────────────

/** Read-only operations on a collection */
export interface IReadable<T extends IEntity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

/** Write operations on a collection */
export interface IWritable<T extends IEntity> {
  create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
}

/** Delete operations on a collection */
export interface IDeletable {
  delete(id: string): Promise<boolean>;
}

// ─── Composite Repository Interface ─────────────────────────────────

/** Full CRUD repository combining all segregated interfaces */
export interface IRepository<T extends IEntity>
  extends IReadable<T>,
    IWritable<T>,
    IDeletable {
  findByFilter(predicate: (item: T) => boolean): Promise<T[]>;
}
