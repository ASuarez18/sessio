import { NextRequest, NextResponse } from 'next/server';
import { createAdminUser, getAdminUsers } from '@/services/user.service';
import bcrypt from 'bcryptjs';


/**
 * @GET /api/admin/admin-users
 * @desc Obtain the list of all admin users.
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} JSON response with the list of admin users or error
 */
export async function GET(request: NextRequest) {
  try {
    const users = await getAdminUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/admin/admin-users:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve admin users' },
      { status: 500 }
    );
  }
}

/**
 * @POST /api/admin/admin-users
 * @desc Creates a new admin user with a securely hashed password.
 * @param {NextRequest} request - The incoming request containing the new admin user data
 * @returns {Promise<NextResponse>} JSON response with the created admin user or error
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
    console.error('API Error in POST /api/admin/admin-users:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}