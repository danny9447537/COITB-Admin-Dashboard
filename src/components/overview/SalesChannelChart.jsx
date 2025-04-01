import React from "react";
import { motion } from "framer-motion";

const SALES_CHANNEL_DATA = [
    { name: "Website", value: 45000 },
    { name: "Mobile App", value: 38200 },
    { name: "Marketplace", value: 29800 },
    { name: "Social Media", value: 18700 }
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];
const SalesChannelChart = () => {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-medium mb-4 text-gray-100">Sales By Channel</h2>
        </motion.div>
    );
};

export default SalesChannelChart;
