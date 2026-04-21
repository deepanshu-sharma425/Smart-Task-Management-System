import { NextResponse } from 'next/server';
import { UserRepository } from '@db/repositories/UserRepository';

export async function GET() {
  try {
    const userRepository = UserRepository.getInstance();
    const users = await userRepository.findAll();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userRepository = UserRepository.getInstance();
    const newUser = await userRepository.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
