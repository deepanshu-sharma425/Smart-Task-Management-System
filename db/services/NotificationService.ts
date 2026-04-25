import { INotificationService } from '../interfaces/services';
import { ICreateNotificationData, INotification } from '../interfaces/models';
import { EntityId } from '../interfaces/types';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { BaseService } from '../abstracts/BaseService';

export class NotificationService extends BaseService implements INotificationService {
  protected readonly serviceName = 'NotificationService';
  private static instance: NotificationService;
  private notificationRepository: NotificationRepository;

  private constructor() {
    super();
    this.notificationRepository = NotificationRepository.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async createNotification(data: ICreateNotificationData): Promise<INotification> {
    return await this.execute('createNotification', async () => {
      const errors = this.validateRequired(data, ['userId', 'type', 'message']);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      return await this.notificationRepository.create({
        ...data,
        read: false,
      });
    });
  }

  public async getNotificationsForUser(userId: EntityId): Promise<INotification[]> {
    return await this.execute('getNotificationsForUser', async () => {
      return await this.notificationRepository.findByUser(userId);
    });
  }

  public async getUnreadCount(userId: EntityId): Promise<number> {
    return await this.execute('getUnreadCount', async () => {
      return await this.notificationRepository.getUnreadCount(userId);
    });
  }

  public async markAllAsRead(userId: EntityId): Promise<void> {
    return await this.execute('markAllAsRead', async () => {
      await this.notificationRepository.markAllAsRead(userId);
    });
  }
}
