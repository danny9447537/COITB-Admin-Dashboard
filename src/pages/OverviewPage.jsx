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

        (async () => {
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
        })();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading dashboard…</div>;
    }

    // Stats
    const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const conversionRate = totalUsers ? ((totalOrders / totalUsers) * 100).toFixed(1) + "%" : "0%";

    // Category chart (static product.sales field)
    const categoryData = products.map((p) => ({
        name: p.name,
        value: p.sales || 0
    }));

    // Sales‑by‑course (formerly “channel”)
    const courseMap = sales.reduce((acc, s) => {
        const course = s.product || "Unknown";
        acc[course] = (acc[course] || 0) + (s.totalAmount || 0);
        return acc;
    }, {});
    const salesByCourse = Object.entries(courseMap).map(([name, value]) => ({ name, value }));

    // Monthly sales overview (fix: handle Firestore Timestamp)
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
        // convert Firestore Timestamp → JS Date
        const dt = s.saleDate?.toDate ? s.saleDate.toDate() : new Date(s.saleDate);
        const m = dt.getMonth();
        acc[m] = (acc[m] || 0) + (s.totalAmount || 0);
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
                        value={`$${totalSales.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })}`}
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
                    <SalesChannelChart data={salesByCourse} />
                </div>
            </main>
        </div>
    );
}
