// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../services/user.service';
import { getCurrentUser } from '../../../lib/auth';

/**
 * GET handler for /api/users
 * Fetches all users 
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const users = await getAllUsers();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/users:', error);
    
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}