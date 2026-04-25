import { BaseEntity } from '../abstracts/BaseEntity';
import { ITask } from '../interfaces/models';
import { EntityId, Status, Priority } from '../interfaces/types';

export class Task extends BaseEntity implements ITask {
  public title: string;
  public description: string;
  public status: Status;
  public priority: Priority;
  public deadline: string;
  public projectId?: EntityId;
  public assignedTo?: EntityId;
  public assignedBy?: EntityId;

  constructor(data: Partial<ITask>) {
    super(data._id);
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.deadline = data.deadline || '';
    this.projectId = data.projectId;
    this.assignedTo = data.assignedTo;
    this.assignedBy = data.assignedBy;
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.updatedAt) this.updatedAt = data.updatedAt;
  }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this.title.trim()) errors.push('Title is required.');
    if (!this.description.trim()) errors.push('Description is required.');
    return errors;
  }
}
