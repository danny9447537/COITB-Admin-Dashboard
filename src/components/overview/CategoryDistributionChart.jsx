import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#EAB308"];

export default function CategoryDistributionChart({ data = [] }) {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            {/* Smaller title */}
            <h2 className="text-sm font-medium mb-2 text-gray-100">Course Sales Distribution</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            fill="#8884d8"
                            labelLine={false}
                            label={{
                                fontSize: 10,
                                fill: "#E5E7EB",
                                formatter: (value, name, props) =>
                                    `${(props.percent * 100).toFixed(0)}%`
                            }}>
                            {data.map((entry, index) => (
                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
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
                            wrapperStyle={{ fontSize: "0.75rem", color: "#E5E7EB", paddingTop: 8 }}
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
