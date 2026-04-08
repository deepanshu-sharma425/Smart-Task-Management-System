import { NextResponse } from 'next/server';
import { Database } from '@db/database';
import TaskModel from '@db/models/TaskSchema';

export async function POST(request: Request) {
  try {
    const { title, description, priority, deadline } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const db = Database.getInstance();
    await db.connect();

    const newTask = await TaskModel.create({
      title,
      description,
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : undefined,
      status: 'pending'
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = Database.getInstance();
    await db.connect();

    const tasks = await TaskModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}