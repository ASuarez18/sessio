import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { getUserFromSession } from '@/services/auth.service';
import { getAdminUsers } from '@/services/user.service';
import AdminUsersClient from "./admin-users-client";

export const dynamic = 'force-dynamic';

interface RawAdminUser {
    _id?: { toString(): string } | string;
    name: string;
    email: string;
    username?: string;
    role?: string;
}

export default async function AdminUsersPage() {
    let adminUsers: Array<{
        _id?: string;
        name: string;
        email: string;
        username?: string;
    }> = [];
    
    let currentUserId: string | undefined = undefined;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        if (token) {
            const currentUser = await getUserFromSession(token);
            currentUserId = currentUser?.id;
        }

        const rawUsers = (await getAdminUsers()) as RawAdminUser[];
        
        adminUsers = rawUsers.map((user) => ({
            ...user,
            _id: user._id?.toString(),
        }));
    } catch (error) {
        console.error("Failed to fetch admin users:", error);
    }

    return (
        <AdminUsersClient 
            initialUsers={adminUsers} 
            currentUserId={currentUserId} 
        />
    );
}