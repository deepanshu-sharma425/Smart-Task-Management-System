// ─── BaseEntity ──────────────────────────────────────────────────────
// Abstract class implementing IEntity.
// Follows Open/Closed Principle: subclasses extend behavior via validate(),
//   but the ID/timestamp generation logic is closed for modification.

import { IEntity } from '../interfaces/models';
import { EntityId } from '../interfaces/types';

export abstract class BaseEntity implements IEntity {
  public _id: EntityId;
  public createdAt: string;
  public updatedAt: string;

  constructor(id?: EntityId) {
    this._id = id || BaseEntity.generateId();
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  /** Generate a unique ID using timestamp + random suffix */
  public static generateId(): EntityId {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  /** Update the updatedAt timestamp */
  public touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Validate the entity's data integrity.
   * Subclasses MUST implement this to enforce their own constraints.
   * Follows Template Method pattern.
   */
  public abstract validate(): string[];
}
