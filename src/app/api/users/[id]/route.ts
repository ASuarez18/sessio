import { NextRequest, NextResponse } from 'next/server';
import { updateUser, deleteUser } from '@/services/user.service';

/**
 * PUT handler for /api/users/[id]
 * Updates an existing user by ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

/**
 * DELETE handler for /api/users/[id]
 * Deletes a user by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: The auth team will add the admin role verification here later.

    const { id } = await params;

    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully', deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error in DELETE /api/users/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}