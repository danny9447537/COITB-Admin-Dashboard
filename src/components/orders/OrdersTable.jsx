// src/components/orders/OrdersTable.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search } from "lucide-react";

// Compare by customer last name, then first name
function nameComparator(a, b) {
    const partsA = (a.customer || "").trim().split(" ");
    const partsB = (b.customer || "").trim().split(" ");
    const lastA = partsA.pop().toLowerCase();
    const lastB = partsB.pop().toLowerCase();
    if (lastA < lastB) return -1;
    if (lastA > lastB) return 1;
    const firstA = partsA.join(" ").toLowerCase();
    const firstB = partsB.join(" ").toLowerCase();
    return firstA.localeCompare(firstB);
}

export default function OrdersTable({ orders = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const term = searchTerm.trim().toLowerCase();

    // Filter
    const filtered = orders.filter((o) => {
        const id = (o.orderId || o.id || "").toLowerCase();
        const customer = (o.customer || "").toLowerCase();
        return !term || id.includes(term) || customer.includes(term);
    });

    // Sort the filtered list by customer name
    const sorted = [...filtered].sort(nameComparator);

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search orders..."
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
                            {["Order ID", "Customer", "Total", "Status", "Date", "Actions"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {sorted.map((o) => {
                            const date = o.orderDate?.seconds
                                ? new Date(o.orderDate.seconds * 1000)
                                : new Date(o.orderDate);
                            return (
                                <motion.tr
                                    key={o.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                                        {o.orderId || o.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {o.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        ${Number(o.totalAmount || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                o.status === "Delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : o.status === "Processing"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : o.status === "Pending"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {date.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button className="text-indigo-400 hover:text-indigo-300">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
