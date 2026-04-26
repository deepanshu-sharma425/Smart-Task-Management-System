import bcrypt from 'bcryptjs';
import { IUserService } from '../interfaces/services';
import { IUser, IUserPublic } from '../interfaces/models';
import { EntityId, Role } from '../interfaces/types';
import { UserRepository } from '../repositories/UserRepository';
import { BaseService } from '../abstracts/BaseService';

/**
 * UserService — handles all user-related business logic.
 *
 * Follows Single Responsibility: only manages user domain operations.
 * Follows Dependency Inversion: depends on IUserService abstraction.
 * Fixes the previous DIP violation where API routes called UserRepository directly.
 */
export class UserService extends BaseService implements IUserService {
  protected readonly serviceName = 'UserService';
  private static instance: UserService;
  private userRepository: UserRepository;

  private constructor() {
    super();
    this.userRepository = UserRepository.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /** Strip password from user object for safe API responses */
  private toPublic(user: IUser): IUserPublic {
    const { password: _, ...userPublic } = user;
    return userPublic as IUserPublic;
  }

  public async getAllUsers(): Promise<IUserPublic[]> {
    return await this.execute('getAllUsers', async () => {
      const users = await this.userRepository.findAll();
      return users.map((u) => this.toPublic(u));
    });
  }

  public async getTeamMembers(): Promise<IUserPublic[]> {
    return await this.execute('getTeamMembers', async () => {
      const members = await this.userRepository.getTeamMembers();
      return members.map((u) => this.toPublic(u));
    });
  }

  public async getUserById(userId: EntityId): Promise<IUserPublic | null> {
    return await this.execute('getUserById', async () => {
      const user = await this.userRepository.findById(userId);
      return user ? this.toPublic(user) : null;
    });
  }

  public async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    isApproved?: boolean;
  }): Promise<IUserPublic> {
    return await this.execute('createUser', async () => {
      const errors = this.validateRequired(data, ['name', 'email', 'password']);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Check for duplicate email
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) {
        throw new Error('Email already registered');
      }

      // Hash password before storing — fixes the bug where admin-created
      // members had plaintext passwords
      const hashedPassword = await bcrypt.hash(data.password, 12);

      const newUser = await this.userRepository.create({
        ...data,
        password: hashedPassword,
        isApproved: data.isApproved !== undefined ? data.isApproved : (data.role === 'admin'),
      });

      this.log(`User created: ${newUser.email} (${newUser.role})`);
      return this.toPublic(newUser);
    });
  }

  public async updateUser(userId: EntityId, data: Partial<IUser>): Promise<IUserPublic | null> {
    return await this.execute('updateUser', async () => {
      // Never allow password updates through this method
      // (use a dedicated changePassword flow in production)
      const { password: _, ...safeData } = data as any;

      const updated = await this.userRepository.update(userId, safeData);
      return updated ? this.toPublic(updated) : null;
    });
  }

  public async approveUser(userId: EntityId): Promise<IUserPublic | null> {
    return await this.execute('approveUser', async () => {
      const updated = await this.userRepository.update(userId, { isApproved: true } as Partial<IUser>);
      if (updated) {
        this.log(`User approved: ${updated.email}`);
      }
      return updated ? this.toPublic(updated) : null;
    });
  }

  public async rejectUser(userId: EntityId): Promise<boolean> {
    return await this.execute('rejectUser', async () => {
      const user = await this.userRepository.findById(userId);
      if (!user) return false;

      const deleted = await this.userRepository.delete(userId);
      if (deleted) {
        this.log(`User rejected/deleted: ${user.email}`);
      }
      return deleted;
    });
  }
}
