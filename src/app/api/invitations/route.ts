import { NextResponse } from 'next/server';
import { InvitationService } from '@db/services/InvitationService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const invitationService = InvitationService.getInstance();
    
    if (memberId) {
      const invitations = await invitationService.getInvitationsForMember(memberId);
      return NextResponse.json(invitations);
    }
    
    return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Fetch invitations error:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const invitationService = InvitationService.getInstance();
    const newInvitation = await invitationService.createInvitation(data);
    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error: any) {
    console.error('Create invitation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create invitation' }, { status: 500 });
  }
}
