import AdminUsersClient from "./admin-users-client";

export default async function AdminUsersPage() {
    let adminUsers = [];
    
    try {
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

    return <AdminUsersClient initialUsers={adminUsers} />;
}