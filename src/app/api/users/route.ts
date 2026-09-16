// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../services/user.service';

/**
 * GET handler for /api/users
 * Fetches all users 
 */
export async function GET() {
  try {
    // TODO: The auth team will add the admin role verification here later.

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