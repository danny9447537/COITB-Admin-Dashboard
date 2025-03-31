import { Route, Routes } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import OverviewPage from "./pages/OverviewPage";
import Sidebar from "./components/Sidebar";

function App({ name }) {
    console.log(name);
    return (
        <div className="flex h-screen bg-sky-500 text-gray-100 overflow-hidden">
            {/* BG */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
                <div className="absolute inset-0 backdrop-blur-sm"></div>
            </div>

            {/* SideBar */}
            <Sidebar />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/products" element={<ProductsPage />} />
            </Routes>
        </div>
    );
}

export default App;
