// src/components/orders/DailyOrders.jsx
import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DailyOrders({ data = [] }) {
    // Aggregate counts by weekday
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayMap = data.reduce((acc, o) => {
        const d = o.orderDate?.seconds
            ? new Date(o.orderDate.seconds * 1000)
            : new Date(o.orderDate);
        const day = days[d.getDay()];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});
    const chartData = days.map((day) => ({
        name: day,
        orders: dayMap[day] || 0
    }));

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Daily Orders</h2>
            <div className="w-full h-80">
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31,41,55,0.8)",
                                borderColor: "#4B5563",
                                fontSize: "0.75rem"
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Bar dataKey="orders" fill="#10B981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
