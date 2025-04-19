import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";

export default function ProductsTable({ products = [] }) {
    // Debug log props arriving in this component
    console.log("ProductsTable got props.products:", products);

    const [searchTerm, setSearchTerm] = useState("");
    const term = searchTerm.trim().toLowerCase();

    const filtered = products.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        return !term || name.includes(term) || category.includes(term);
    });

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
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
                            {["Name", "Category", "Price", "Stock", "Sales", "Actions"].map((h) => (
                                <th
                                    key={h}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filtered.map((product) => (
                            <motion.tr
                                key={product.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex items-center gap-2">
                                    <img
                                        src={product.imageUrl || "https://via.placeholder.com/40"}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.category || "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    ${product.price?.toFixed(2) || "0.00"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.stock ?? "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.sales ?? "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center">
                                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                                        <Edit size={18} />
                                    </button>
                                    <button className="text-red-400 hover:text-red-300">
                                        <Trash2 size={18} />
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
