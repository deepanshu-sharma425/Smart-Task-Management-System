import { NextResponse } from 'next/server';
import { UserService } from '@db/services/UserService';

export async function GET() {
  try {
    const userService = UserService.getInstance();
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userService = UserService.getInstance();
    const newUser = await userService.createUser(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
