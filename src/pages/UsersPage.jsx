import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Users as UsersIcon, UserPlus, UserCheck, UserX } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            const q = query(collection(db, "users"), where("userId", "==", uid));
            const snap = await getDocs(q);
            const list = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(list);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const todayString = new Date().toDateString();
    const newUsersToday = users.filter(
        (u) => new Date(u.createdAt).toDateString() === todayString
    ).length;
    const churnRate = totalUsers === 0 ? 0 : ((totalUsers - activeUsers) / totalUsers) * 100;

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Users" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading users…</div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <motion.div
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}>
                            <StatCard
                                name="Total Users"
                                icon={UsersIcon}
                                value={totalUsers.toLocaleString()}
                                color="#6366F1"
                            />
                            <StatCard
                                name="New Users Today"
                                icon={UserPlus}
                                value={newUsersToday}
                                color="#10B981"
                            />
                            <StatCard
                                name="Active Users"
                                icon={UserCheck}
                                value={activeUsers.toLocaleString()}
                                color="#F59E0B"
                            />
                            <StatCard
                                name="Churn Rate"
                                icon={UserX}
                                value={`${churnRate.toFixed(1)}%`}
                                color="#EF4444"
                            />
                        </motion.div>

                        {/* Users Table */}
                        <UsersTable users={users} />

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            <UserGrowthChart users={users} />
                            <UserActivityHeatmap data={users} />
                            <UserDemographicsChart data={users} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
