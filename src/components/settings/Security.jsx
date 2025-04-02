import React, { useState } from "react";
import { Lock } from "lucide-react";
import SettingsSection from "./SettingsSection";
import ToggleSwitch from "./ToggleSwitch";

const Security = () => {
    const [twoFactor, setTwoFactor] = useState(false);
    return (
        <SettingsSection icon={Lock} title={"Security"}>
            <ToggleSwitch
                Label={"Two-Factor Authentication"}
                isOn={twoFactor}
                onToggle={() => setTwoFactor(!twoFactor)}></ToggleSwitch>
            <div className="mt-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Change Password
                </button>
            </div>
        </SettingsSection>
    );
};

export default Security;
