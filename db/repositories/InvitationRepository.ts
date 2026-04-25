import { IInvitation } from '../interfaces/models';
import { BaseRepository } from '../abstracts/BaseRepository';
import InvitationModel from '../models/InvitationSchema';

export class InvitationRepository extends BaseRepository<IInvitation> {
  private static instance: InvitationRepository;

  private constructor() {
    super(InvitationModel);
  }

  public static getInstance(): InvitationRepository {
    if (!InvitationRepository.instance) {
      InvitationRepository.instance = new InvitationRepository();
    }
    return InvitationRepository.instance;
  }

  public async findByMember(memberId: string): Promise<IInvitation[]> {
    await this.connect();
    return await InvitationModel.find({ memberId }).sort({ createdAt: -1 }).lean();
  }

  public async findByProject(projectId: string): Promise<IInvitation[]> {
    await this.connect();
    return await InvitationModel.find({ projectId }).sort({ createdAt: -1 }).lean();
  }
}
