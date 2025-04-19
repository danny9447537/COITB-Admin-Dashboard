import React from "react";
import { auth } from "../../firebase/firebase";

export default function Header({ title }) {
    // currentUser is already there (no promise)
    const user = auth.currentUser;
    const name = user?.displayName || user?.email?.split("@")[0] || null;

    return (
        <header className="bg-sky-1000 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-100">
                    {name ? `Hello, ${name} – ${title}` : title}
                </h1>
                {/* if you want to show their avatar: */}
                {user?.photoURL && (
                    <img
                        src={user.photoURL}
                        alt="Your profile"
                        className="w-10 h-10 rounded-full"
                    />
                )}
            </div>
        </header>
    );
}
