import { NextResponse } from 'next/server';
import { NotificationService } from '@db/services/NotificationService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const notificationService = NotificationService.getInstance();
    
    if (userId) {
      const notifications = await notificationService.getNotificationsForUser(userId);
      return NextResponse.json(notifications);
    }
    
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const notificationService = NotificationService.getInstance();
    const newNotification = await notificationService.createNotification(data);
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error: any) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const notificationService = NotificationService.getInstance();

    if (userId) {
      await notificationService.markAllAsRead(userId);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Update notification status error:', error);
    return NextResponse.json({ error: 'Failed to update notification status' }, { status: 500 });
  }
}
