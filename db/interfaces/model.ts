export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in_progress' | 'completed';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}