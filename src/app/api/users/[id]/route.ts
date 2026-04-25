import { NextResponse } from 'next/server';
import { UserRepository } from '@db/repositories/UserRepository';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Using the repository directly since AuthService doesn't have an update method yet
    const userRepository = UserRepository.getInstance();
    const updatedUser = await userRepository.update(id, data);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't send password back
    const { password, ...userPublic } = updatedUser as any;
    return NextResponse.json(userPublic);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
