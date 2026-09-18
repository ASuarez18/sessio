import { NextRequest, NextResponse } from 'next/server';
import { deleteUser } from '@/services/user.service';

/**
 * DELETE handler for /api/admin/admin-users/[id]
 * Deletes an admin user by ID.
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
    console.error('API Error in DELETE /api/admin/admin-users/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}