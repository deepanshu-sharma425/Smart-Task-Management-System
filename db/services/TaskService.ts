import { ITaskService } from '../interfaces/services';
import { ICreateTaskData, ITask } from '../interfaces/models';
import { EntityId, Status } from '../interfaces/types';
import { TaskRepository } from '../repositories/TaskRepository';
import { BaseService } from '../abstracts/BaseService';

export class TaskService extends BaseService implements ITaskService {
  protected readonly serviceName = 'TaskService';
  private static instance: TaskService;
  private taskRepository: TaskRepository;

  private constructor() {
    super();
    this.taskRepository = TaskRepository.getInstance();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public async createTask(data: ICreateTaskData): Promise<ITask> {
    return await this.execute('createTask', async () => {
      const errors = this.validateRequired(data, ['title', 'description']);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Enforce task title uniqueness per admin user
      if (data.assignedBy) {
        const existingByAdmin = await this.taskRepository.findByAdminAndTitle(data.assignedBy, data.title);
        if (existingByAdmin) {
          throw new Error('A task with this title already exists for this admin');
        }
      }

      // Also enforce uniqueness within a project (existing behavior)
      if (data.projectId) {
        const existingInProject = await this.taskRepository.findByProjectAndTitle(data.projectId, data.title);
        if (existingInProject) {
          throw new Error('Task title must be unique within the project');
        }
      }

      return await this.taskRepository.create({
        ...data,
        status: 'pending',
      });
    });
  }

  public async getAllTasks(): Promise<ITask[]> {
    return await this.execute('getAllTasks', async () => {
      return await this.taskRepository.findAll();
    });
  }

  public async getTasksForUser(userId: EntityId): Promise<ITask[]> {
    return await this.execute('getTasksForUser', async () => {
      return await this.taskRepository.findByAssignee(userId);
    });
  }

  public async getTasksByProject(projectId: EntityId): Promise<ITask[]> {
    return await this.execute('getTasksByProject', async () => {
      return await this.taskRepository.findByProject(projectId);
    });
  }

  public async updateTaskStatus(taskId: EntityId, status: Status): Promise<ITask | null> {
    return await this.execute('updateTaskStatus', async () => {
      return await this.taskRepository.update(taskId, { status });
    });
  }

  public async updateTask(taskId: EntityId, data: Partial<ITask>): Promise<ITask | null> {
    return await this.execute('updateTask', async () => {
      return await this.taskRepository.update(taskId, data);
    });
  }

  public async deleteTask(taskId: EntityId): Promise<boolean> {
    return await this.execute('deleteTask', async () => {
      return await this.taskRepository.delete(taskId);
    });
  }
}
