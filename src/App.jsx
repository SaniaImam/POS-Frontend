import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Customer from "./pages/Customer/Customer.jsx";
import Items from "./pages/Items/Items.jsx";
import Supplier from "./pages/Supplier/Supplier.jsx";
import NewPurchase from "./pages/Purchase/NewPurchase.jsx";
import PurchaseList from "./pages/Purchase/PurchaseList.jsx";
import GRN from "./pages/GRN/GRN.jsx";
import Inventory from "./pages/Inventory/Inventory.jsx";
import SaleRecord from "./pages/Sale/SaleRecord.jsx";
import NewSale from "./pages/Sale/NewSale";

const App = () => {
    return (
        <BrowserRouter>

            <div className="app">

                <Sidebar />

                <main className="main-content">
                    <Routes>

                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" />}
                        />

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/customers"
                            element={<Customer />}
                        />

                        <Route
                            path="/items"
                            element={<Items />}
                        />

                        <Route
                            path="/suppliers"
                            element={<Supplier />}
                        />

                        <Route
                            path="/purchases/new"
                            element={<NewPurchase />}
                        />

                        <Route
                            path="/purchases"
                            element={<PurchaseList />}
                        />

                        <Route
                            path="/grn"
                            element={<GRN />}
                        />

                        <Route
                            path="/inventory"
                            element={<Inventory />}
                        />

                        <Route
                            path="/sales/new"
                            element={<NewSale />}
                        />

                        <Route
                            path="/sales"
                            element={<SaleRecord />}
                        />

                    </Routes>
                </main>

            </div>

        </BrowserRouter>
    );
};

export default App;