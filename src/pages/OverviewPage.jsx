// src/pages/OverviewPage.jsx

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { motion } from "framer-motion";
import { BarChart2, Users, Zap, ShoppingBag } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

export default function OverviewPage() {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const fetchAll = async () => {
            // Fetch all four collections in parallel
            const [pSnap, sSnap, uSnap, oSnap] = await Promise.all([
                getDocs(query(collection(db, "products"), where("userId", "==", uid))),
                getDocs(query(collection(db, "sales"), where("userId", "==", uid))),
                getDocs(query(collection(db, "users"), where("userId", "==", uid))),
                getDocs(query(collection(db, "orders"), where("userId", "==", uid)))
            ]);

            setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setSales(sSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setUsers(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setOrders(oSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

            setLoading(false);
        };

        fetchAll();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading dashboard…</div>;
    }

    // Compute stats
    const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const conversionRate =
        totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) + "%" : "0%";

    // Prepare chart data
    const categoryData = products.map((p) => ({
        name: p.name,
        value: p.sales || 0
    }));

    const channelMap = sales.reduce((acc, s) => {
        const ch = s.channel || "Other";
        acc[ch] = (acc[ch] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const salesByChannel = Object.entries(channelMap).map(([name, value]) => ({ name, value }));

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const monthTotals = sales.reduce((acc, s) => {
        const idx = new Date(s.saleDate).getMonth();
        acc[idx] = (acc[idx] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const salesOverviewData = months.map((m, i) => ({
        month: m,
        sales: monthTotals[i] || 0
    }));

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Vendor Dashboard" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <StatCard
                        name="Total Sales"
                        icon={Zap}
                        value={`$${totalSales.toLocaleString()}`}
                        color="#6366F1"
                    />
                    <StatCard
                        name="New Users"
                        icon={Users}
                        value={totalUsers.toLocaleString()}
                        color="#8B5CF6"
                    />
                    <StatCard
                        name="Total Products"
                        icon={ShoppingBag}
                        value={totalProducts}
                        color="#EC4899"
                    />
                    <StatCard
                        name="Conversion Rate"
                        icon={BarChart2}
                        value={conversionRate}
                        color="#10B981"
                    />
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SalesOverviewChart data={salesOverviewData} />
                    <CategoryDistributionChart data={categoryData} />
                    <SalesChannelChart data={salesByChannel} />
                </div>
            </main>
        </div>
    );
}
