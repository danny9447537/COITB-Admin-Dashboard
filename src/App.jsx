// src/App.jsx

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { uploadData } from "./firebase/dataUpload";

import SignInPage from "./pages/auth/SignInPage";
import Sidebar from "./components/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            setLoading(false);
            if (!u) return;

            console.log("🪝 onAuthStateChanged - user:", u.uid);
            console.log("🪝 about to call uploadData()");
            await uploadData(u.uid);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return <div className="p-4 text-white">Loading…</div>;
    }
    if (!user) {
        return (
            <Routes>
                <Route path="*" element={<SignInPage />} />
            </Routes>
        );
    }
    return (
        <div className="flex h-screen bg-sky-800 text-gray-100 overflow-hidden">
            <Sidebar />
            <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}
