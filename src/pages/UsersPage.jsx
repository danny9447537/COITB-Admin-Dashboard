import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { db } from "../firebase/firebase"; // Import Firestore db
import { collection, getDocs } from "firebase/firestore"; // Firestore functions

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatMap from "../components/users/UserActivityHeatMap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";

const UsersPage = () => {
    // States to hold user data
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users data from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, "users");
            const snapshot = await getDocs(usersCollection); // Fetch all users
            const usersList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    // Calculate user stats dynamically
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "Active").length;
    const newUsersToday = users.filter(
        (user) => new Date(user.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const churnRate = totalUsers === 0 ? "0%" : ((totalUsers - activeUsers) / totalUsers) * 100;

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Users Page" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* STATS */}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}>
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
                )}
                <UsersTable users={users} /> {/* Pass users data to the table */}
                {/* User Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <UserGrowthChart />
                    <UserActivityHeatMap />
                    <UserDemographicsChart />
                </div>
            </main>
        </div>
    );
};

export default UsersPage;
