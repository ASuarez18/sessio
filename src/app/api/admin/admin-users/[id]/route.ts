import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, getUserById, updateUser } from '@/services/user.service';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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
    const { currentPassword, passHash, ...otherFields } = body;

    if (passHash) {
      await connectDB();
      const existingUser = await User.findById(id).select('+passHash').lean();

      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password.' },
          { status: 400 }
        );
      }

      const storedPasswordHash = (existingUser as any).passHash;
      if (!storedPasswordHash) {
        return NextResponse.json(
          { error: 'Stored password hash not found for user.' },
          { status: 500 }
        );
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password does not match.' },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      otherFields.passHash = await bcrypt.hash(passHash, salt);
    }

    const updatedUser = await updateUser(id, otherFields);

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