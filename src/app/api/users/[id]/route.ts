import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/services/user.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * @PUT /api/users/[id]
 * @desc Updates an existing user by ID.
 * @param {NextRequest} request - The incoming request containing updated user data
 * @param {RouteParams} params - The route parameters containing the user ID
 * @returns {Promise<NextResponse>} JSON response with the updated user or error
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: The auth team will add the admin role verification here later.

    const { id } = await params;
    const body = await request.json();
    
    const updatedUser = await updateUser(id, body);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('API Error in PUT /api/users/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}