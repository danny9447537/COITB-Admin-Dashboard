import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function InteractiveProductPerformanceChart({ data = [] }) {
    // the three metrics we want to toggle between
    const metrics = ["sales", "revenue", "profit"];
    const labels = { sales: "Sales", revenue: "Revenue", profit: "Profit" };
    const colors = { sales: "#8B5CF6", revenue: "#10B981", profit: "#F59E0B" };

    const [idx, setIdx] = useState(0);
    const metric = metrics[idx];

    const prev = () => setIdx((idx + metrics.length - 1) % metrics.length);
    const next = () => setIdx((idx + 1) % metrics.length);

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            {/* Header with arrows */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={prev}
                        className="p-1 hover:bg-gray-700 rounded"
                        aria-label="Previous metric">
                        <ChevronLeft size={20} className="text-gray-300" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-100">
                        Product Performance: {labels[metric]}
                    </h2>
                    <button
                        onClick={next}
                        className="p-1 hover:bg-gray-700 rounded"
                        aria-label="Next metric">
                        <ChevronRight size={20} className="text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Single‑series bar chart */}
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563"
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Bar dataKey={metric} fill={colors[metric]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
