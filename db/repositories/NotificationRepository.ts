import { INotification } from '../interfaces/models';
import { BaseRepository } from '../abstracts/BaseRepository';
import NotificationModel from '../models/NotificationSchema';

export class NotificationRepository extends BaseRepository<INotification> {
  private static instance: NotificationRepository;

  private constructor() {
    super(NotificationModel);
  }

  public static getInstance(): NotificationRepository {
    if (!NotificationRepository.instance) {
      NotificationRepository.instance = new NotificationRepository();
    }
    return NotificationRepository.instance;
  }

  public async findByUser(userId: string): Promise<INotification[]> {
    await this.connect();
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  public async getUnreadCount(userId: string): Promise<number> {
    await this.connect();
    return await NotificationModel.countDocuments({ userId, read: false });
  }

  public async markAllAsRead(userId: string): Promise<void> {
    await this.connect();
    await NotificationModel.updateMany({ userId, read: false }, { read: true });
  }
}
