import React from "react";
import SettingsSection from "./SettingsSection";
import { User } from "lucide-react";

const Profile = () => {
    return (
        <SettingsSection icon={User} title={"Profile"}>
            <div className="flex flex-col sm:flex-row items-center mb-6">
                <img
                    src="https://plus.unsplash.com/premium_photo-1681995453325-455f7084888d?q=80&w=2639&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="photo of business meeting"
                    className="rounded-full w-20 h-20 object-cover mr-4"
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-100 ">Apex Solutions</h3>
                <p className="text-gray-400">ApexSolutionsLLC@example.com</p>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
                Edit Profile
            </button>
        </SettingsSection>
    );
};

export default Profile;
