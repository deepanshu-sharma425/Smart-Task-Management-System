import { BaseEntity } from '../abstracts/BaseEntity';
import { IUser } from '../interfaces/models';
import { Role } from '../interfaces/types';

export class User extends BaseEntity implements IUser {
  public name: string;
  public email: string;
  public password: string;
  public role: Role;
  public avatar?: string;
  public isApproved?: boolean;

  constructor(data: Partial<IUser>) {
    super(data._id);
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || 'member';
    this.avatar = data.avatar;
    this.isApproved = data.isApproved !== undefined ? data.isApproved : (this.role === 'admin');
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.updatedAt) this.updatedAt = data.updatedAt;
  }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this.name.trim()) errors.push('Name is required.');
    if (!this.email.trim()) errors.push('Email is required.');
    if (!this.password) errors.push('Password is required.');
    return errors;
  }
}
