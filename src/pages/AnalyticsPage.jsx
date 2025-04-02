import React from "react";
import Header from "../components/common/Header"; // Adjust the path as needed
import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import UserRetention from "../components/analytics/UserRetention";
import ProductPerformanceChart from "../components/analytics/ProductPerformancechart";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";

const AnalyticsPage = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10 bg-sky-1000">
            <Header title={"Overall Analytics Page"} />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <OverviewCards />
                <RevenueChart />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ChannelPerformance />
                    <ProductPerformanceChart />
                    <UserRetention />
                    <CustomerSegmentation />
                </div>
                <AIPoweredInsights />
            </main>
        </div>
    );
};

export default AnalyticsPage;
