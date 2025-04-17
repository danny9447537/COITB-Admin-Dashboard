import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import OverviewPage from "./pages/OverviewPage";
import Sidebar from "./components/Sidebar";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import SignInPage from "./pages/auth/SignInPage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { uploadData } from "./firebase/dataUpload";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Triggering mock data upload
    useEffect(() => {
        // Checking local storage to ensure it only runs once
        const uploaded = localStorage.getItem("mockDataUploaded");

        if (!uploaded) {
            console.log("Uploading mock data..."); // Log to check if it's triggered
            uploadData(); // calling function to upload mock data
            localStorage.setItem("mockDataUploaded", "true"); // store flag to prevent re-uploading
        }
    }, []);

    if (loading) {
        return <div className="text-white p-4">Loading...</div>;
    }

    // If not logged in
    if (!user) {
        return (
            <Routes>
                <Route path="*" element={<SignInPage />} />
            </Routes>
        );
    }

    return (
        <div className="flex h-screen bg-sky-500 text-gray-100 overflow-hidden">
            {/* Background Layer */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
                <div className="absolute inset-0 backdrop-blur-sm"></div>
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Protected Dashboard Routes */}
            <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Fallback: redirect any unknown route to dashboard */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
