import { ITask } from '../interfaces/models';
import { Status, Priority } from '../interfaces/types';
import { BaseRepository } from '../abstracts/BaseRepository';
import TaskModel from '../models/TaskSchema';

export class TaskRepository extends BaseRepository<ITask> {
  private static instance: TaskRepository;

  private constructor() {
    super(TaskModel);
  }

  public static getInstance(): TaskRepository {
    if (!TaskRepository.instance) {
      TaskRepository.instance = new TaskRepository();
    }
    return TaskRepository.instance;
  }

  /** Find all tasks assigned to a specific user */
  public async findByAssignee(userId: string): Promise<ITask[]> {
    await this.connect();
    return await TaskModel.find({ assignedTo: userId }).sort({ createdAt: -1 }).lean();
  }

  /** Find all tasks for a project */
  public async findByProject(projectId: string): Promise<ITask[]> {
    await this.connect();
    return await TaskModel.find({ projectId }).sort({ createdAt: -1 }).lean();
  }

  /** Find a task by project and title */
  public async findByProjectAndTitle(projectId: string, title: string): Promise<ITask | null> {
    await this.connect();
    return await TaskModel.findOne({ projectId, title }).lean();
  }

  /** Find tasks by status */
  public async findByStatus(status: Status): Promise<ITask[]> {
    await this.connect();
    return await TaskModel.find({ status }).sort({ createdAt: -1 }).lean();
  }

  /** Find tasks by priority */
  public async findByPriority(priority: Priority): Promise<ITask[]> {
    await this.connect();
    return await TaskModel.find({ priority }).sort({ createdAt: -1 }).lean();
  }

  /** Find a task by admin (assignedBy) and title — for uniqueness check */
  public async findByAdminAndTitle(assignedBy: string, title: string): Promise<ITask | null> {
    await this.connect();
    return await TaskModel.findOne({ assignedBy, title }).lean();
  }
}
