'use client';

import { useState } from 'react';

interface User {
    _id: string;
    name?: string;
    email: string;
    username: string;
}

interface Props {
    users: User[];
}

export default function UsersClient({ users }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            (user.name?.toLowerCase() || '').includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.username?.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handleClear = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="p-6 sm:p-8 font-sans">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-gray-900">
                        Users
                    </h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="relative w-full sm:w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or username..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3.5 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                    Name
                                </th>
                                <th className="text-left px-4 py-3.5 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                    Email
                                </th>
                                <th className="text-left px-4 py-3.5 text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                    Username
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-gray-500 text-sm">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                currentUsers.map((user) => (
                                    <tr key={user._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {user.name || "Unnamed User"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-xs text-gray-600 font-medium">
                                                {user.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-xs text-gray-600 font-medium">
                                                {user.username}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        Showing {filteredUsers.length > 0 ? startIndex + 1 : 0}–
                        {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                                    currentPage === page
                                        ? "bg-purple-800 text-white"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}