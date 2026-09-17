// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getAdminUsers, createAdminUser } from '../../../services/user.service';

/**
 * GET handler for /api/users
 * Returns admin users if role=admin is provided, otherwise returns all users.
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: The auth team will add the admin role verification here later.
    
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');

    let users;
    if (role === 'admin') {
      users = await getAdminUsers();
    } else {
      users = await getAllUsers();
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/users:', error);
    
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/users
 * Creates a new admin user.
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: The auth team will add the admin role verification here later.

    const body = await request.json();
    const newAdmin = await createAdminUser(body);

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/users:', error);
    
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}