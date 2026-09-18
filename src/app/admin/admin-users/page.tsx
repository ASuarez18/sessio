import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { getUserFromSession } from '@/services/auth.service';
import AdminUsersClient from "./admin-users-client";

export default async function AdminUsersPage() {
    let adminUsers = [];
    let currentUserId = undefined;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        if (token) {
            const currentUser = await getUserFromSession(token);
            currentUserId = currentUser?.id;
        }

        const res = await fetch('http://localhost:3000/api/users?role=admin', {
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            adminUsers = data;
        }
    } catch (error) {
        console.error("Failed to fetch admin users:", error);
    }

    return <AdminUsersClient initialUsers={adminUsers} currentUserId={currentUserId} />;
}