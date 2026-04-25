import { IInvitationService } from '../interfaces/services';
import { ICreateInvitationData, IInvitation } from '../interfaces/models';
import { EntityId, InvitationStatus } from '../interfaces/types';
import { InvitationRepository } from '../repositories/InvitationRepository';
import { BaseService } from '../abstracts/BaseService';

export class InvitationService extends BaseService implements IInvitationService {
  protected readonly serviceName = 'InvitationService';
  private static instance: InvitationService;
  private invitationRepository: InvitationRepository;

  private constructor() {
    super();
    this.invitationRepository = InvitationRepository.getInstance();
  }

  public static getInstance(): InvitationService {
    if (!InvitationService.instance) {
      InvitationService.instance = new InvitationService();
    }
    return InvitationService.instance;
  }

  public async createInvitation(data: ICreateInvitationData): Promise<IInvitation> {
    return await this.execute('createInvitation', async () => {
      const errors = this.validateRequired(data, ['projectId', 'adminId', 'memberId']);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Check if invitation already exists and is pending
      const existing = await this.invitationRepository.findByProject(data.projectId);
      const pendingExists = existing.some((inv) => inv.memberId === data.memberId && inv.status === 'pending');
      
      if (pendingExists) {
        throw new Error('An invitation is already pending for this member.');
      }

      return await this.invitationRepository.create({
        ...data,
        status: 'pending',
      });
    });
  }

  public async getInvitationsForMember(memberId: EntityId): Promise<IInvitation[]> {
    return await this.execute('getInvitationsForMember', async () => {
      return await this.invitationRepository.findByMember(memberId);
    });
  }

  public async updateInvitationStatus(invitationId: EntityId, status: InvitationStatus): Promise<IInvitation | null> {
    return await this.execute('updateInvitationStatus', async () => {
      return await this.invitationRepository.update(invitationId, { status });
    });
  }
}
