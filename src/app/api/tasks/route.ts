import { NextResponse } from 'next/server';
import { TaskService } from '@db/services/TaskService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignedTo = searchParams.get('assignedTo');
    const projectId = searchParams.get('projectId');

    const taskService = TaskService.getInstance();
    let tasks;

    if (assignedTo) {
      tasks = await taskService.getTasksForUser(assignedTo);
    } else if (projectId) {
      tasks = await taskService.getTasksByProject(projectId);
    } else {
      tasks = await taskService.getAllTasks();
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const taskService = TaskService.getInstance();
    const newTask = await taskService.createTask(data);
    
    // Trigger notification if assigned to someone
    if (newTask.assignedTo) {
      const { NotificationService } = await import('@db/services/NotificationService');
      const notificationService = NotificationService.getInstance();
      await notificationService.createNotification({
        userId: newTask.assignedTo,
        type: 'task_assigned',
        message: `You have been assigned a new task: ${newTask.title}`,
        relatedTaskId: newTask._id,
      });
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
