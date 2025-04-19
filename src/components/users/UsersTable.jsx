// src/components/users/UsersTable.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search } from "lucide-react";

function nameComparator(a, b) {
    // split into words
    const partsA = a.name.trim().split(" ");
    const partsB = b.name.trim().split(" ");
    // last word is last name
    const lastA = partsA.pop().toLowerCase();
    const lastB = partsB.pop().toLowerCase();
    if (lastA < lastB) return -1;
    if (lastA > lastB) return 1;
    // if last names equal, compare the remaining first names
    const firstA = partsA.join(" ").toLowerCase();
    const firstB = partsB.join(" ").toLowerCase();
    return firstA.localeCompare(firstB);
}

export default function UsersTable({ users = [] }) {
    // 1. Clone + sort by last then first name
    const sortedUsers = [...users].sort(nameComparator);

    const [searchTerm, setSearchTerm] = useState("");
    const term = searchTerm.trim().toLowerCase();

    // 2. Filter on the sorted list
    const filtered = sortedUsers.filter((user) => {
        const name = user.name.toLowerCase();
        const email = user.email.toLowerCase();
        return !term || name.includes(term) || email.includes(term);
    });

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Users</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                                <th
                                    key={h}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filtered.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {user.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === "Active"
                                                ? "bg-green-800 text-green-100"
                                                : "bg-red-800 text-red-100"
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <button className="text-indigo-400 hover:text-indigo-300">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
