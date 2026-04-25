import { BaseEntity } from '../abstracts/BaseEntity';
import { INotification } from '../interfaces/models';
import { EntityId, NotificationType } from '../interfaces/types';

export class Notification extends BaseEntity implements INotification {
  public userId: EntityId;
  public type: NotificationType;
  public message: string;
  public read: boolean;
  public relatedTaskId?: EntityId;

  constructor(data: Partial<INotification>) {
    super(data._id);
    this.userId = data.userId || '';
    this.type = data.type || 'task_assigned';
    this.message = data.message || '';
    this.read = data.read || false;
    this.relatedTaskId = data.relatedTaskId;
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.updatedAt) this.updatedAt = data.updatedAt;
  }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this.userId) errors.push('User ID is required.');
    if (!this.type) errors.push('Notification type is required.');
    if (!this.message) errors.push('Message is required.');
    return errors;
  }
}
