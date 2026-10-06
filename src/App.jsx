import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Customer from "./pages/Customer/Customer.jsx";
import Items from "./pages/Items/Items.jsx";

const App = () => {
    return (
        <BrowserRouter>

            <div className="app">

                <Sidebar />

                <main className="main-content">
                    <Routes>

                        <Route
                            path="/"
                            element={<Navigate to="/customers" />}
                        />

                        <Route
                            path="/customers"
                            element={<Customer />}
                        />

                        <Route
                            path="/items"
                            element={<Items />}
                        />

                    </Routes>
                </main>

            </div>

        </BrowserRouter>
    );
};

export default App;