import { NextResponse } from 'next/server';
import { Database } from '@db/database';
import TaskModel from '@db/models/TaskSchema';
import { updateLocalTaskStatus } from '@db/localTaskStore';

const mongoUri = process.env.MONGODB_URI?.trim();
const useLocalStore = !mongoUri && process.env.NODE_ENV !== 'production';

type PatchPayload = {
  status: 'pending' | 'in_progress' | 'completed';
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = (await request.json()) as PatchPayload;

    if (useLocalStore) {
      const updatedTask = updateLocalTaskStatus(id, status);
      if (!updatedTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      return NextResponse.json(updatedTask);
    }

    const db = Database.getInstance();
    await db.connect();

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
