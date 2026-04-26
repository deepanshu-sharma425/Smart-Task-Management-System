// ─── Service Interfaces ──────────────────────────────────────────────
// Follows Dependency Inversion Principle:
//   High-level API routes depend on these abstractions, not concrete service classes.
// Follows Single Responsibility Principle:
//   Each service interface handles exactly one domain.

import {
  ICreateProjectData,
  ICreateTaskData,
  ILoginCredentials,
  IProject,
  ISession,
  ISignupData,
  ITask,
  IUser,
  IUserPublic,
  IInvitation,
  ICreateInvitationData,
  INotification,
  ICreateNotificationData,
} from './models';
import { EntityId, Role, Status, InvitationStatus } from './types';

// ─── Auth Service ────────────────────────────────────────────────────

export interface IAuthService {
  /** Authenticate a user with email and password */
  login(credentials: ILoginCredentials): Promise<{ user: IUserPublic; session: ISession } | null>;

  /** Register a new user account */
  signup(data: ISignupData): Promise<{ user: IUserPublic; session: ISession }>;

  /** Validate an existing session token */
  validateSession(token: string): Promise<ISession | null>;

  /** Get user data from a session token */
  getUserFromToken(token: string): Promise<IUserPublic | null>;
}

// ─── Task Service ────────────────────────────────────────────────────

export interface ITaskService {
  /** Create and optionally assign a new task */
  createTask(data: ICreateTaskData): Promise<ITask>;

  /** Get all tasks (admin view) */
  getAllTasks(): Promise<ITask[]>;

  /** Get tasks assigned to a specific user */
  getTasksForUser(userId: EntityId): Promise<ITask[]>;

  /** Get tasks within a specific project */
  getTasksByProject(projectId: EntityId): Promise<ITask[]>;

  /** Update a task's status */
  updateTaskStatus(taskId: EntityId, status: Status): Promise<ITask | null>;

  /** Update any task fields */
  updateTask(taskId: EntityId, data: Partial<ITask>): Promise<ITask | null>;

  /** Delete a task */
  deleteTask(taskId: EntityId): Promise<boolean>;
}

// ─── Project Service ─────────────────────────────────────────────────

export interface IProjectService {
  /** Create a new project */
  createProject(data: ICreateProjectData): Promise<IProject>;

  /** Get all projects */
  getAllProjects(): Promise<IProject[]>;

  /** Get projects owned by a specific user */
  getProjectsByOwner(ownerId: EntityId): Promise<IProject[]>;

  /** Add a member to a project */
  addMember(projectId: EntityId, userId: EntityId): Promise<IProject | null>;

  /** Remove a member from a project */
  removeMember(projectId: EntityId, userId: EntityId): Promise<IProject | null>;
}

// ─── Invitation Service ──────────────────────────────────────────────

export interface IInvitationService {
  /** Create a new invitation */
  createInvitation(data: ICreateInvitationData): Promise<IInvitation>;

  /** Get invitations for a member */
  getInvitationsForMember(memberId: EntityId): Promise<IInvitation[]>;

  /** Update an invitation's status */
  updateInvitationStatus(invitationId: EntityId, status: InvitationStatus): Promise<IInvitation | null>;
}

// ─── Notification Service ────────────────────────────────────────────

export interface INotificationService {
  /** Create a new notification */
  createNotification(data: ICreateNotificationData): Promise<INotification>;

  /** Get all notifications for a user */
  getNotificationsForUser(userId: EntityId): Promise<INotification[]>;

  /** Get unread count for a user */
  getUnreadCount(userId: EntityId): Promise<number>;

  /** Mark all notifications as read for a user */
  markAllAsRead(userId: EntityId): Promise<void>;
}

// ─── User Service ────────────────────────────────────────────────────

export interface IUserService {
  /** Get all users */
  getAllUsers(): Promise<IUserPublic[]>;

  /** Get all team members (role = 'member') */
  getTeamMembers(): Promise<IUserPublic[]>;

  /** Get a user by ID */
  getUserById(userId: EntityId): Promise<IUserPublic | null>;

  /** Create a new user (admin-created, with password hashing) */
  createUser(data: { name: string; email: string; password: string; role: Role; isApproved?: boolean }): Promise<IUserPublic>;

  /** Update a user */
  updateUser(userId: EntityId, data: Partial<IUser>): Promise<IUserPublic | null>;

  /** Approve a pending member */
  approveUser(userId: EntityId): Promise<IUserPublic | null>;

  /** Reject (delete) a pending member */
  rejectUser(userId: EntityId): Promise<boolean>;
}
