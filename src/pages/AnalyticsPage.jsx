import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import UserRetention from "../components/analytics/UserRetention";
import ProductPerformanceChart from "../components/analytics/ProductPerformanceChart";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";

import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AnalyticsPage() {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setLoading(false);
            return;
        }
        (async () => {
            const [uSnap, oSnap, sSnap, pSnap] = await Promise.all([
                getDocs(query(collection(db, "users"), where("userId", "==", uid))),
                getDocs(query(collection(db, "orders"), where("userId", "==", uid))),
                getDocs(query(collection(db, "sales"), where("userId", "==", uid))),
                getDocs(query(collection(db, "products"), where("userId", "==", uid)))
            ]);

            setUsers(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setOrders(oSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setSales(sSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-400">Loading analytics…</div>;
    }

    // Overview stats
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalRevenue = sales.reduce(
        (sum, s) =>
            sum + (s.quantity || 0) * (products.find((p) => p.id === s.productId)?.price || 0),
        0
    );
    const totalPageViews = totalOrders * 10; // placeholder

    // Revenue vs target by month
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
    const revByMonth = sales.reduce((acc, s) => {
        const date = s.saleDate.toDate?.() || new Date(s.saleDate);
        const m = date.getMonth();
        const price = products.find((p) => p.id === s.productId)?.price || 0;
        acc[m] = (acc[m] || 0) + price * (s.quantity || 0);
        return acc;
    }, {});
    const revenueData = months.map((m, i) => ({
        month: m,
        revenue: revByMonth[i] || 0,
        target: (revByMonth[i] || 0) * 0.9
    }));

    // Category breakdown from sales→products
    const catMap = sales.reduce((acc, s) => {
        const cat = products.find((p) => p.id === s.productId)?.category || "Other";
        const price = products.find((p) => p.id === s.productId)?.price || 0;
        acc[cat] = (acc[cat] || 0) + price * (s.quantity || 0);
        return acc;
    }, {});
    const channelData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    // Product performance
    const perf = {};
    products.forEach((p) => (perf[p.name] = { sales: 0, revenue: 0 }));
    sales.forEach((s) => {
        const prod = products.find((p) => p.id === s.productId);
        if (!prod) return;
        perf[prod.name].sales += s.quantity || 0;
        perf[prod.name].revenue += prod.price * (s.quantity || 0);
    });
    const productPerformanceData = Object.entries(perf).map(([name, vals]) => ({
        name,
        ...vals,
        profit: vals.revenue * 0.2
    }));

    // User retention (weeks 1–8)
    const first =
        sales.map((s) => s.saleDate.toDate?.() || new Date(s.saleDate)).sort((a, b) => a - b)[0] ||
        new Date();
    const weekMs = 1000 * 60 * 60 * 24 * 7;
    const ordersByWeek = {};
    orders.forEach((o) => {
        const d = o.orderDate.toDate?.() || new Date(o.orderDate);
        const w = Math.floor((d - first) / weekMs) + 1;
        ordersByWeek[w] = (ordersByWeek[w] || 0) + 1;
    });
    const retentionData = Array.from({ length: 8 }).map((_, i) => ({
        name: `Week ${i + 1}`,
        retention: Math.min(100, ((ordersByWeek[i + 1] || 0) / (totalOrders || 1)) * 100)
    }));

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-sky-1000">
            <Header title="Overall Analytics Page" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <OverviewCards
                    stats={{
                        revenue: `$${totalRevenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })}`,
                        users: totalUsers.toLocaleString(),
                        orders: totalOrders.toLocaleString(),
                        pageViews: totalPageViews.toLocaleString()
                    }}
                />
                <RevenueChart data={revenueData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ChannelPerformance data={channelData} />
                    <ProductPerformanceChart data={productPerformanceData} />
                    <UserRetention data={retentionData} />
                    <CustomerSegmentation />
                </div>
                <AIPoweredInsights />
            </main>
        </div>
    );
}
