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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setLoading(false);
            return;
        }
        (async () => {
            const [sSnap, oSnap, pSnap] = await Promise.all([
                getDocs(query(collection(db, "sales"), where("userId", "==", uid))),
                getDocs(query(collection(db, "orders"), where("userId", "==", uid))),
                getDocs(query(collection(db, "products"), where("userId", "==", uid)))
            ]);
            setSales(sSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setOrders(oSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading sales data…</div>;
    }

    // --- Stats ---
    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const salesGrowth = (() => {
        // simple MoM: compare this month vs last
        const now = new Date();
        const thisM = now.getMonth();
        const lastM = (thisM + 11) % 12;
        const mTotals = sales.reduce((acc, s) => {
            const dt = s.saleDate?.toDate ? s.saleDate.toDate() : new Date(s.saleDate);
            const m = dt.getMonth();
            acc[m] = (acc[m] || 0) + (s.totalAmount || 0);
            return acc;
        }, {});
        const curr = mTotals[thisM] || 0;
        const prev = mTotals[lastM] || 0;
        return prev ? (((curr - prev) / prev) * 100).toFixed(1) + "%" : "0%";
    })();

    // --- Monthly overview data ---
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
        const dt = s.saleDate?.toDate ? s.saleDate.toDate() : new Date(s.saleDate);
        const m = dt.getMonth();
        acc[m] = (acc[m] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const salesOverviewData = months.map((m, i) => ({
        month: m,
        sales: monthTotals[i] || 0
    }));

    // --- Sales by category ---
    const prodById = products.reduce((map, p) => {
        map[p.id] = p.category;
        return map;
    }, {});
    const categoryMap = sales.reduce((acc, s) => {
        const cat = prodById[s.productId] || "Other";
        acc[cat] = (acc[cat] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const salesByCategory = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // --- Last 7 days data ---
    const today = new Date();
    const last7 = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - idx));
        return d;
    });
    const dailyMap = sales.reduce((acc, s) => {
        const dt = s.saleDate?.toDate ? s.saleDate.toDate() : new Date(s.saleDate);
        const key = dt.toLocaleDateString();
        acc[key] = (acc[key] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const dailySalesData = last7.map((d) => {
        const key = d.toLocaleDateString();
        return { name: key, sales: dailyMap[key] || 0 };
    });

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
                            minimumFractionDigits: 2
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
                        value={
                            totalOrders
                                ? ((totalOrders / totalOrders) * 100).toFixed(1) + "%"
                                : "0%"
                        }
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
