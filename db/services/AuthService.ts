import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAuthService } from '../interfaces/services';
import { ILoginCredentials, ISignupData, ISession, IUserPublic } from '../interfaces/models';
import { UserRepository } from '../repositories/UserRepository';
import { BaseService } from '../abstracts/BaseService';

const JWT_SECRET = process.env.JWT_SECRET || 'forge-your-future-with-taskforge-2026';
const JWT_EXPIRES_IN = '7d';

export class AuthService extends BaseService implements IAuthService {
  protected readonly serviceName = 'AuthService';
  private static instance: AuthService;
  private userRepository: UserRepository;

  private constructor() {
    super();
    this.userRepository = UserRepository.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: ILoginCredentials): Promise<{ user: IUserPublic; session: ISession } | null> {
    return await this.execute('login', async () => {
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) return null;

      // Check if user is approved
      if (user.role !== 'admin' && user.isApproved === false) {
        throw new Error('Account pending admin approval');
      }

      // Compare password with bcrypt
      const isMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isMatch) return null;

      const session = this.generateSession(user);
      const { password: _, ...userPublic } = user;

      return { user: userPublic as IUserPublic, session };
    });
  }

  public async signup(data: ISignupData): Promise<{ user: IUserPublic; session: ISession }> {
    return await this.execute('signup', async () => {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) {
        throw new Error('Email already registered');
      }

      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(data.password, 12);

      const newUser = await this.userRepository.create({
        ...data,
        password: hashedPassword,
        role: data.role || 'member',
      });

      const session = this.generateSession(newUser);
      const { password: _, ...userPublic } = newUser;

      return { user: userPublic as IUserPublic, session };
    });
  }

  public async validateSession(token: string): Promise<ISession | null> {
    return await this.execute('validateSession', async () => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return {
          token,
          userId: decoded.userId,
          role: decoded.role,
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
        };
      } catch {
        return null;
      }
    });
  }

  public async getUserFromToken(token: string): Promise<IUserPublic | null> {
    const session = await this.validateSession(token);
    if (!session) return null;

    const user = await this.userRepository.findById(session.userId);
    if (!user) return null;

    const { password: _, ...userPublic } = user;
    return userPublic as IUserPublic;
  }

  /** Internal helper to generate JWT session */
  private generateSession(user: any): ISession {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const decoded = jwt.decode(token) as any;

    return {
      token,
      userId: user._id,
      role: user.role,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
    };
  }
}
