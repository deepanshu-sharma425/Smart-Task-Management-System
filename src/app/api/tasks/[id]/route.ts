import { NextResponse } from 'next/server';
import { TaskService } from '@db/services/TaskService';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'forge-your-future-with-taskforge-2026';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const taskService = TaskService.getInstance();
    const updatedTask = await taskService.updateTask(id, data);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (data.status === 'completed' && updatedTask.assignedBy) {
      const { NotificationService } = await import('@db/services/NotificationService');
      const notificationService = NotificationService.getInstance();
      await notificationService.createNotification({
        userId: updatedTask.assignedBy, // Admin who assigned the task
        type: 'task_completed',
        message: `A task has been completed: ${updatedTask.title}`,
        relatedTaskId: updatedTask._id,
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('taskforge-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;
    const userId = payload.userId as string;

    const { id } = await params;
    const taskService = TaskService.getInstance();
    
    // Admin can delete any task. Team members cannot delete tasks assigned to them.
    if (role !== 'admin') {
      const task = await taskService.getTasksForUser(userId);
      const isAssignedToUser = task.some((t: any) => String(t._id) === id);
      if (isAssignedToUser || role === 'member') {
        return NextResponse.json({ error: 'Forbidden: Team members cannot delete tasks' }, { status: 403 });
      }
    }

    const success = await taskService.deleteTask(id);

    if (!success) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
