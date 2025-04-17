"use client";
import React, { useState } from "react";
import {
    BarChart2,
    DollarSign,
    Menu,
    Settings,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
    Users,
    LogOut
} from "lucide-react"; // Import LogOut icon for the button
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth"; // Import signOut from Firebase
import { auth } from "../firebase/firebase"; // Import Firebase auth instance

const SIDEBAR_ITEMS = [
    {
        name: "Overview",
        icon: BarChart2,
        color: "#6366f1",
        href: "/"
    },
    { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
    { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
    { name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
    { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
    { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" }
];

const Sidebar = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out successfully");
                // Optionally redirect the user to the login page or reset user state
            })
            .catch((error) => {
                console.error("Error logging out: ", error);
            });
    };

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSideBarOpen ? "w-64" : "w-20"
            }`}
            animate={{ width: isSideBarOpen ? 256 : 80 }}>
            <div className="h-full bg-sky-950 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSideBarOpen(!isSideBarOpen)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit">
                    <Menu size={24} />
                </motion.button>

                {/** Sidebar Nav Icon links */}
                <nav className="mt-8 flex-grow">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                                <item.icon
                                    size={20}
                                    style={{ color: item.color, minWidth: "20px" }}
                                />
                                <AnimatePresence>
                                    {isSideBarOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}>
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>

                {/** Logout Button */}
                <motion.div
                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                    onClick={handleLogout}>
                    <LogOut size={20} style={{ color: "#F59E0B", minWidth: "20px" }} />
                    <AnimatePresence>
                        {isSideBarOpen && (
                            <motion.span
                                className="ml-4 whitespace-nowrap"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2, delay: 0.3 }}>
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
