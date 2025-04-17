import React from "react";
import { useState } from "react";
import { Bell } from "lucide-react";
import SettingsSection from "./SettingsSection";
import ToggleSwitch from "./ToggleSwitch";

const Notifications = () => {
    const [notifications, setNotifications] = useState({
        push: true,
        email: true,
        sms: true
    });

    return (
        <SettingsSection icon={Bell} title={"Notifications"}>
            <ToggleSwitch
                Label={"Push Notifications"}
                isOn={notifications.push}
                onToggle={() => setNotifications({ ...notifications, push: !notifications.push })}
            />
            <ToggleSwitch
                Label={"Email Notifications"}
                isOn={notifications.email}
                onToggle={() => setNotifications({ ...notifications, email: !notifications.email })}
            />
            <ToggleSwitch
                Label={"SMS Notifications"}
                isOn={notifications.sms}
                onToggle={() => setNotifications({ ...notifications, sms: !notifications.sms })}
            />
        </SettingsSection>
    );
};

export default Notifications;
