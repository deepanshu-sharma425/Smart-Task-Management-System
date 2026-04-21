import { IProjectService } from '../interfaces/services';
import { ICreateProjectData, IProject } from '../interfaces/models';
import { EntityId } from '../interfaces/types';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { BaseService } from '../abstracts/BaseService';

export class ProjectService extends BaseService implements IProjectService {
  protected readonly serviceName = 'ProjectService';
  private static instance: ProjectService;
  private projectRepository: ProjectRepository;

  private constructor() {
    super();
    this.projectRepository = ProjectRepository.getInstance();
  }

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  public async createProject(data: ICreateProjectData): Promise<IProject> {
    return await this.execute('createProject', async () => {
      const errors = this.validateRequired(data, ['name', 'description', 'ownerId']);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      return await this.projectRepository.create({
        ...data,
        memberIds: [data.ownerId], // Owner is the first member
      });
    });
  }

  public async getAllProjects(): Promise<IProject[]> {
    return await this.execute('getAllProjects', async () => {
      return await this.projectRepository.findAll();
    });
  }

  public async getProjectsByOwner(ownerId: EntityId): Promise<IProject[]> {
    return await this.execute('getProjectsByOwner', async () => {
      return await this.projectRepository.findByOwner(ownerId);
    });
  }

  public async addMember(projectId: EntityId, userId: EntityId): Promise<IProject | null> {
    return await this.execute('addMember', async () => {
      return await this.projectRepository.addMember(projectId, userId);
    });
  }

  public async removeMember(projectId: EntityId, userId: EntityId): Promise<IProject | null> {
    return await this.execute('removeMember', async () => {
      const project = await this.projectRepository.findById(projectId);
      if (!project) return null;

      const updatedMembers = project.memberIds.filter((id) => id !== userId);
      return await this.projectRepository.update(projectId, { memberIds: updatedMembers });
    });
  }
}
