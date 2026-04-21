// ─── BaseService ─────────────────────────────────────────────────────
// Abstract base class for all service layers.
// Provides common error handling and validation patterns.
//
// Follows Single Responsibility: only handles cross-cutting service concerns.
// Follows Open/Closed: subclasses extend with domain-specific logic.

export abstract class BaseService {
  /** Service identifier for logging */
  protected abstract readonly serviceName: string;

  /**
   * Wrap an operation with error handling and logging.
   * Template Method for consistent error handling across all services.
   */
  protected async execute<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      console.error(`[${this.serviceName}] ${operation} failed:`, error);
      throw error;
    }
  }

  /**
   * Validate that required fields are present.
   * @returns Array of error messages (empty if valid)
   */
  protected validateRequired(data: any, fields: string[]): string[] {
    const errors: string[] = [];
    for (const field of fields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`${field} is required`);
      }
    }
    return errors;
  }

  /** Log an informational message */
  protected log(message: string): void {
    console.log(`[${this.serviceName}] ${message}`);
  }
}
