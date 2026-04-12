import { NextResponse } from 'next/server';
import { Database } from '@db/database';
import ProjectModel from '@db/models/ProjectSchema';
import { createLocalProject, getLocalProjects } from '@db/localProjectStore';

const mongoUri = process.env.MONGODB_URI?.trim();
const useLocalStore = !mongoUri && process.env.NODE_ENV !== 'production';

type ProjectPayload = {
  name: string;
  description: string;
};

export async function POST(request: Request) {
  try {
    const { name, description } = (await request.json()) as ProjectPayload;

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    if (useLocalStore) {
      const newProject = createLocalProject({ name, description });
      return NextResponse.json(newProject, { status: 201 });
    }

    const db = Database.getInstance();
    await db.connect();

    const newProject = await ProjectModel.create({ name, description });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (useLocalStore) {
      return NextResponse.json(getLocalProjects());
    }

    const db = Database.getInstance();
    await db.connect();

    const projects = await ProjectModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
