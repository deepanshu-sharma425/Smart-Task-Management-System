import { IUser } from '../interfaces/models';
import { Role } from '../interfaces/types';
import { BaseRepository } from '../abstracts/BaseRepository';
import UserModel from '../models/UserSchema';

export class UserRepository extends BaseRepository<IUser> {
  private static instance: UserRepository;

  private constructor() {
    super(UserModel);
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  /** Find a user by email address (for login) */
  public async findByEmail(email: string): Promise<IUser | null> {
    await this.connect();
    return await UserModel.findOne({ email: email.toLowerCase() }).lean();
  }

  /** Find all users with a specific role */
  public async findByRole(role: Role): Promise<IUser[]> {
    await this.connect();
    return await UserModel.find({ role }).sort({ createdAt: -1 }).lean();
  }

  /** Get all team members (non-admin users) */
  public async getTeamMembers(): Promise<IUser[]> {
    return await this.findByRole('member');
  }
}
