import { NextResponse } from 'next/server';
import { Database } from '@db/database';
import TaskModel from '@db/models/TaskSchema';
import { createLocalTask, getLocalTasks } from '@db/localTaskStore';

const mongoUri = process.env.MONGODB_URI?.trim();
const useLocalStore = !mongoUri && process.env.NODE_ENV !== 'production';

type TaskPayload = {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
  projectId?: string;
};

export async function POST(request: Request) {
  try {
    const { title, description, priority, deadline, projectId } = (await request.json()) as TaskPayload;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    if (useLocalStore) {
      const newTask = createLocalTask({ title, description, priority, deadline, projectId });
      return NextResponse.json(newTask, { status: 201 });
    }

    const db = Database.getInstance();
    await db.connect();

    const newTask = await TaskModel.create({
      title,
      description,
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : undefined,
      status: 'pending',
      projectId: projectId || undefined,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId') || undefined;

    if (useLocalStore) {
      const tasks = getLocalTasks();
      return NextResponse.json(
        projectId ? tasks.filter((task) => task.projectId === projectId) : tasks
      );
    }

    const db = Database.getInstance();
    await db.connect();

    const query = projectId ? { projectId } : {};
    const tasks = await TaskModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
