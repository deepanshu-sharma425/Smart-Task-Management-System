// ─── Entity Interfaces ───────────────────────────────────────────────
// Follows Interface Segregation: each interface is focused and composable.
// Follows Liskov Substitution: any IEntity subtype can be used where IEntity is expected.

import { EntityId, Priority, Role, Status, Timestamps, InvitationStatus, NotificationType } from './types';

// ─── Base Entity ─────────────────────────────────────────────────────
/** Base interface for all entities in the system */
export interface IEntity extends Timestamps {
  _id: EntityId;
}

// ─── User ────────────────────────────────────────────────────────────
/** Represents a user in the system (admin or team member) */
export interface IUser extends IEntity {
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  isApproved?: boolean;
}

/** Safe user representation without password (for API responses) */
export interface IUserPublic extends Omit<IUser, 'password'> {}

/** Credentials for login */
export interface ILoginCredentials {
  email: string;
  password: string;
}

/** Data required for signup */
export interface ISignupData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

// ─── Task ────────────────────────────────────────────────────────────
/** Represents a task that can be assigned to team members */
export interface ITask extends IEntity {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string;
  projectId?: EntityId;
  assignedTo?: EntityId;
  assignedBy?: EntityId;
}

/** Data required to create a new task */
export interface ICreateTaskData {
  title: string;
  description: string;
  priority: Priority;
  deadline: string;
  projectId?: EntityId;
  assignedTo?: EntityId;
  assignedBy?: EntityId;
}

// ─── Project ─────────────────────────────────────────────────────────
/** Represents a project that groups tasks and team members */
export interface IProject extends IEntity {
  name: string;
  description: string;
  ownerId: EntityId;
  memberIds: EntityId[];
}

/** Data required to create a new project */
export interface ICreateProjectData {
  name: string;
  description: string;
  ownerId: EntityId;
}

// ─── Session ─────────────────────────────────────────────────────────
/** Represents an authentication session */
export interface ISession {
  token: string;
  userId: EntityId;
  role: Role;
  expiresAt: string;
}

// ─── Invitation ──────────────────────────────────────────────────────
export interface IInvitation extends IEntity {
  projectId: EntityId;
  adminId: EntityId;
  memberId: EntityId;
  status: InvitationStatus;
}

export interface ICreateInvitationData {
  projectId: EntityId;
  adminId: EntityId;
  memberId: EntityId;
}

// ─── Notification ────────────────────────────────────────────────────
export interface INotification extends IEntity {
  userId: EntityId;
  type: NotificationType;
  message: string;
  read: boolean;
  relatedTaskId?: EntityId;
}

export interface ICreateNotificationData {
  userId: EntityId;
  type: NotificationType;
  message: string;
  relatedTaskId?: EntityId;
}
