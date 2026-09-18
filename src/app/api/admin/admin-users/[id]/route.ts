import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, getUserById, updateUser } from '@/services/user.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('API Error in GET /api/admin/admin-users/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedUser = await updateUser(id, body);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found or failed to update' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User updated successfully', updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error in PUT /api/admin/admin-users/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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