import UsersClient from './users-client';
import { getAllUsers } from '@/services/user.service';

export default async function AdminUsersPage() {
    const users = await getAllUsers();
    const plainUsers = JSON.parse(JSON.stringify(users));

    return <UsersClient users={plainUsers} />;
}