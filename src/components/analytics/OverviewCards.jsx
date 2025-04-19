import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function OverviewCards({ stats }) {
    // stats = { revenue, users, orders, pageViews }
    const cards = [
        {
            name: "Revenue",
            value: stats.revenue,
            change: stats.revenueChange,
            icon: DollarSign,
            color: "text-green-500"
        },
        {
            name: "Users",
            value: stats.users,
            change: stats.userChange,
            icon: Users,
            color: "text-blue-500"
        },
        {
            name: "Orders",
            value: stats.orders,
            change: stats.orderChange,
            icon: ShoppingBag,
            color: "text-purple-500"
        },
        {
            name: "Page Views",
            value: stats.pageViews,
            change: stats.pageViewChange,
            icon: Eye,
            color: "text-yellow-500"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {cards.map((item, idx) => (
                <motion.div
                    key={item.name}
                    className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
                    whileTap={{ scale: 0.97 }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <item.icon className={item.color} size={24} />
                            <div>
                                <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
                                <p className="mt-1 text-xl font-semibold text-gray-100">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                        {item.change != null && (
                            <div
                                className={`p-2 rounded-full bg-opacity-20 ${
                                    item.change >= 0 ? "bg-green-200" : "bg-red-200"
                                }`}>
                                {item.change >= 0 ? (
                                    <ArrowUpRight className="text-green-500" size={20} />
                                ) : (
                                    <ArrowDownRight className="text-red-500" size={20} />
                                )}
                            </div>
                        )}
                    </div>
                    {item.change != null && (
                        <div
                            className={`mt-4 flex items-center ${
                                item.change >= 0 ? "text-green-500" : "text-red-500"
                            }`}>
                            {item.change >= 0 ? (
                                <ArrowUpRight size={16} />
                            ) : (
                                <ArrowDownRight size={16} />
                            )}
                            <span className="ml-1 text-sm font-medium">
                                {Math.abs(item.change)}%
                            </span>
                            <span className="ml-2 text-sm text-gray-400">vs last period</span>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
