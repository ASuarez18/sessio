import UsersClient from './users-client';
import { getAllUsers } from '@/services/user.service';
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
    const users = await getAllUsers();
    const plainUsers = JSON.parse(JSON.stringify(users));

    return <UsersClient users={plainUsers} />;
}