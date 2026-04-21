import { NextResponse } from 'next/server';
import { ProjectService } from '@db/services/ProjectService';

export async function GET() {
  try {
    const projectService = ProjectService.getInstance();
    const projects = await projectService.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const projectService = ProjectService.getInstance();
    const newProject = await projectService.createProject(data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
