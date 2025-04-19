import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";

export default function SalesPage() {
    const [sales, setSales] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            // Fetch sales & orders for this user
            const [salesSnap, ordersSnap] = await Promise.all([
                getDocs(query(collection(db, "sales"), where("userId", "==", uid))),
                getDocs(query(collection(db, "orders"), where("userId", "==", uid)))
            ]);

            setSales(salesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setOrders(ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading sales data…</div>;
    }

    // 1) Stats calculations
    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate =
        totalOrders > 0 ? ((totalOrders / orders.length) * 100).toFixed(1) + "%" : "0%";

    // Month‑over‑month growth
    const now = new Date();
    const thisMonthIndex = now.getMonth();
    const salesByMonth = sales.reduce((acc, s) => {
        const m = new Date(s.saleDate).getMonth();
        acc[m] = (acc[m] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const revThis = salesByMonth[thisMonthIndex] || 0;
    const revLast = salesByMonth[(thisMonthIndex + 11) % 12] || 0;
    const salesGrowth =
        revLast > 0 ? (((revThis - revLast) / revLast) * 100).toFixed(1) + "%" : "0%";

    // a) Monthly sales trend (12 months)
    const monthLabels = [
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
    const salesOverviewData = monthLabels.map((m, idx) => ({
        month: m,
        sales: salesByMonth[idx] || 0
    }));

    // b) Sales by category (use sale.category or fallback)
    const categoryMap = sales.reduce((acc, s) => {
        const cat = s.category || "Other";
        acc[cat] = (acc[cat] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const salesByCategory = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // c) Daily sales trend (Mon–Sun)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyMap = sales.reduce((acc, s) => {
        const d = new Date(s.saleDate).getDay();
        const key = days[d];
        acc[key] = (acc[key] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const dailySalesData = days.map((day) => ({
        name: day,
        sales: dailyMap[day] || 0
    }));

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Vendor Sales Page" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <StatCard
                        name="Total Revenue"
                        icon={DollarSign}
                        value={`$${totalRevenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`}
                        color="#6366F1"
                    />
                    <StatCard
                        name="Avg. Order Value"
                        icon={ShoppingCart}
                        value={`$${avgOrderValue.toFixed(2)}`}
                        color="#10B981"
                    />
                    <StatCard
                        name="Conversion Rate"
                        icon={TrendingUp}
                        value={conversionRate}
                        color="#F59E0B"
                    />
                    <StatCard
                        name="Sales Growth"
                        icon={CreditCard}
                        value={salesGrowth}
                        color="#EF4444"
                    />
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <SalesOverviewChart data={salesOverviewData} />
                    <SalesByCategoryChart data={salesByCategory} />
                    <DailySalesTrend data={dailySalesData} />
                </div>
            </main>
        </div>
    );
}
