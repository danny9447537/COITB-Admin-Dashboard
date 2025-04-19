// src/components/orders/OrderDistribution.jsx
import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

export default function OrderDistribution({ data = [] }) {
    // Aggregate counts by status
    const distMap = data.reduce((acc, o) => {
        const st = o.status || "Unknown";
        acc[st] = (acc[st] || 0) + 1;
        return acc;
    }, {});
    const chartData = Object.entries(distMap).map(([name, value]) => ({ name, value }));

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Order Status Distribution</h2>
            <div className="w-full h-80">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {chartData.map((entry, idx) => (
                                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31,41,55,0.8)",
                                borderColor: "#4B5563",
                                fontSize: "0.75rem"
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend
                            iconSize={10}
                            wrapperStyle={{ fontSize: "0.75rem", color: "#E5E7EB" }}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
