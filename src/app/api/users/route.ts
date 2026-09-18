import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, getAdminUsers, createAdminUser } from '@/services/user.service';
import bcrypt from 'bcryptjs';

/**
 * @GET /api/users
 * @desc Obtains a list of users, filtering by role query parameter if provided.
 * @param {NextRequest} request - The incoming request containing search parameters (e.g., role)
 * @returns {Promise<NextResponse>} JSON response with the list of users or error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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
 * @POST /api/users
 * @desc Creates a new user/admin with a securely hashed password.
 * @param {NextRequest} request - The incoming request containing the new user data
 * @returns {Promise<NextResponse>} JSON response with the created user or error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPassword = body.password || body.passHash;

    if (rawPassword) {
      const salt = await bcrypt.genSalt(10);
      body.passHash = await bcrypt.hash(rawPassword, salt);
      if (body.password) {
        delete body.password;
      }
    }

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