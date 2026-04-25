import { BaseEntity } from '../abstracts/BaseEntity';
import { IProject } from '../interfaces/models';
import { EntityId } from '../interfaces/types';

export class Project extends BaseEntity implements IProject {
  public name: string;
  public description: string;
  public ownerId: EntityId;
  public memberIds: EntityId[];

  constructor(data: Partial<IProject>) {
    super(data._id);
    this.name = data.name || '';
    this.description = data.description || '';
    this.ownerId = data.ownerId || '';
    this.memberIds = data.memberIds || [];
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.updatedAt) this.updatedAt = data.updatedAt;
  }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this.name.trim()) errors.push('Project name is required.');
    if (!this.ownerId) errors.push('Owner ID is required.');
    return errors;
  }
}
