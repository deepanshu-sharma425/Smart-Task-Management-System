// ─── Core Type Definitions ───────────────────────────────────────────
// Single source of truth for all enums and union types used across the system.

export type Role = 'admin' | 'member';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Status = 'pending' | 'in_progress' | 'completed' | 'archived';

export type ThemeMode = 'light' | 'dark';

// ─── Utility Types ───────────────────────────────────────────────────

/** Makes all properties of T optional except for the specified keys K */
export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/** Extracts the _id field type pattern used across all entities */
export type EntityId = string;

/** Timestamp fields shared by all entities */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

/** Filter criteria for repository queries */
export interface FilterCriteria<T> {
  field: keyof T;
  value: T[keyof T];
}
