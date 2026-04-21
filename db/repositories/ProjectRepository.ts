import { IProject } from '../interfaces/models';
import { BaseRepository } from '../abstracts/BaseRepository';
import ProjectModel from '../models/ProjectSchema';

export class ProjectRepository extends BaseRepository<IProject> {
  private static instance: ProjectRepository;

  private constructor() {
    super(ProjectModel);
  }

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  /** Find all projects owned by a user */
  public async findByOwner(ownerId: string): Promise<IProject[]> {
    await this.connect();
    return await ProjectModel.find({ ownerId }).sort({ createdAt: -1 }).lean();
  }

  /** Find all projects where a user is a member */
  public async findByMember(userId: string): Promise<IProject[]> {
    await this.connect();
    return await ProjectModel.find({ memberIds: userId }).sort({ createdAt: -1 }).lean();
  }

  /** Add a member to a project */
  public async addMember(projectId: string, userId: string): Promise<IProject | null> {
    await this.connect();
    return await ProjectModel.findByIdAndUpdate(
      projectId,
      { $addToSet: { memberIds: userId } },
      { new: true }
    ).lean();
  }
}
