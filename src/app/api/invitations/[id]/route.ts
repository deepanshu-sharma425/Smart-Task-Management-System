import { NextResponse } from 'next/server';
import { InvitationService } from '@db/services/InvitationService';
import { ProjectService } from '@db/services/ProjectService';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const invitationService = InvitationService.getInstance();
    const projectService = ProjectService.getInstance();
    
    const updatedInvitation = await invitationService.updateInvitationStatus(id, body.status);
    
    if (!updatedInvitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (body.status === 'accepted') {
      await projectService.addMember(updatedInvitation.projectId, updatedInvitation.memberId);
    }
    
    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error('Update invitation status error:', error);
    return NextResponse.json({ error: 'Failed to update invitation status' }, { status: 500 });
  }
}
