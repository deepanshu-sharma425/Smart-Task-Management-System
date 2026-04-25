import { BaseEntity } from '../abstracts/BaseEntity';
import { IInvitation } from '../interfaces/models';
import { EntityId, InvitationStatus } from '../interfaces/types';

export class Invitation extends BaseEntity implements IInvitation {
  public projectId: EntityId;
  public adminId: EntityId;
  public memberId: EntityId;
  public status: InvitationStatus;

  constructor(data: Partial<IInvitation>) {
    super(data._id);
    this.projectId = data.projectId || '';
    this.adminId = data.adminId || '';
    this.memberId = data.memberId || '';
    this.status = data.status || 'pending';
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.updatedAt) this.updatedAt = data.updatedAt;
  }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this.projectId) errors.push('Project ID is required.');
    if (!this.adminId) errors.push('Admin ID is required.');
    if (!this.memberId) errors.push('Member ID is required.');
    return errors;
  }
}
