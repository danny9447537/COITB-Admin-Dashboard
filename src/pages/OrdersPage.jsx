import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion } from "framer-motion";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const uid = auth.currentUser?.uid;
        // if you seeded orders with userId, you can filter by where("userId","==",uid)
        getDocs(collection(db, "orders"))
            .then((snap) => {
                setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading orders…</div>;
    }

    // Stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const completedOrders = orders.filter((o) => o.status === "Delivered").length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    return (
        <div className="flex-1 relative z-10 overflow-auto">
            <Header title="Orders" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* Stat cards */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <StatCard
                        name="Total Orders"
                        icon={ShoppingBag}
                        value={totalOrders.toLocaleString()}
                        color="#6366F1"
                    />
                    <StatCard
                        name="Pending Orders"
                        icon={Clock}
                        value={pendingOrders.toLocaleString()}
                        color="#F59E0B"
                    />
                    <StatCard
                        name="Completed Orders"
                        icon={CheckCircle}
                        value={completedOrders.toLocaleString()}
                        color="#10B981"
                    />
                    <StatCard
                        name="Total Revenue"
                        icon={DollarSign}
                        value={`$${totalRevenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`}
                        color="#EF4444"
                    />
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <DailyOrders data={orders} />
                    <OrderDistribution data={orders} />
                </div>

                {/* Table */}
                <OrdersTable orders={orders} />
            </main>
        </div>
    );
}
