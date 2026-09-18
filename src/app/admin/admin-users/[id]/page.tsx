'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AdminUserFormPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const isEditMode = id !== 'create';

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        currentPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/admin/admin-users/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        const userData = data.user || data;
                        setFormData({
                            name: userData.name || '',
                            email: userData.email || '',
                            username: userData.username || '',
                            password: '',
                            currentPassword: '',
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };
            fetchUser();
        }
    }, [isEditMode, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(timeWindow => timeWindow);

        try {
            if (isEditMode) {
                if (formData.currentPassword && !formData.password) {
                    alert('New password is required when current password is provided.');
                    setLoading(false);
                    return;
                }
            }

            const url = isEditMode ? `/api/admin/admin-users/${id}` : '/api/admin/admin-users';
            const method = isEditMode ? 'PUT' : 'POST';

            const payload: any = {
                role: 'admin',
            };

            if (formData.name) payload.name = formData.name;
            if (formData.email) payload.email = formData.email;
            if (formData.username) payload.username = formData.username;

            if (!isEditMode) {
                payload.passHash = formData.password;
            } else {
                if (formData.password) {
                    if (!formData.currentPassword) {
                        alert('Current password is required to change password.');
                        setLoading(false);
                        return;
                    }
                    payload.passHash = formData.password;
                    payload.currentPassword = formData.currentPassword;
                } else if (formData.currentPassword) {
                    alert('New password is required when current password is provided.');
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(isEditMode ? 'Admin user updated successfully!' : 'Admin user created successfully!');
                router.push('/admin/admin-users');
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || (isEditMode ? 'Failed to update admin user.' : 'Failed to create admin user.'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/admin-users"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to admin users
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit admin user' : 'Create admin user'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {isEditMode ? 'Update the details of the system administrator.' : 'Add a new system administrator with custom credentials.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <div className="w-1/3 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required={!isEditMode}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-600 text-sm"
                    />
                </div>

                <div className="w-2/3 min-w-[320px]">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        required={!isEditMode}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-600 text-sm"
                    />
                </div>

                <div className="w-1/3 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        required={!isEditMode}
                        minLength={3}
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-600 text-sm"
                    />
                </div>

                {isEditMode && (
                    <div className="w-2/3 min-w-[320px]">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Confirm Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                required={Boolean(formData.password)}
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password to confirm change"
                                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-600 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-2/3 min-w-[320px]">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Password {isEditMode && <span className="text-gray-400 font-normal">(Leave blank to keep unchanged)</span>}
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required={!isEditMode || Boolean(formData.currentPassword)}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={isEditMode ? 'Enter new password if changing' : 'Enter password'}
                            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-600 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/admin-users"
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update admin' : 'Create admin')}
                    </button>
                </div>
            </form>
        </div>
    );
}