import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faReceipt,
    faChartLine,
    faUsers,
    faTriangleExclamation,
    faCartShopping,
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/Dashboard.css";

import StatusBadge from "../../components/Common/StatusBadge";
import SalesChart from "../../components/Dashboard/SalesChart";

import { getSales } from "../../services/SaleService";
import { getInventory } from "../../services/InventoryService";
import { getPurchases } from "../../services/PurchaseService";
import { getCustomers } from "../../services/CustomerService";

import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, formatDate, today } from "../../utils/format";

const CHART_DAYS = 7;

// yyyy-MM-dd keys (local time) for the last n days, oldest first
const lastDays = (count) =>
    Array.from({ length: count }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (count - 1 - index));

        const local = new Date(date);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());

        return {
            key: local.toISOString().slice(0, 10),
            label: date.toLocaleDateString(undefined, { weekday: "short" }),
            fullLabel: date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })
        };
    });

const dayKey = (value) => String(value ?? "").slice(0, 10);

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            const results = await Promise.allSettled([
                getSales(),
                getInventory(),
                getPurchases(),
                getCustomers()
            ]);

            const [saleResult, inventoryResult, purchaseResult, customerResult] = results;

            if (saleResult.status === "fulfilled") setSales(saleResult.value);
            if (inventoryResult.status === "fulfilled") setInventory(inventoryResult.value);
            if (purchaseResult.status === "fulfilled") setPurchases(purchaseResult.value);
            if (customerResult.status === "fulfilled") setCustomers(customerResult.value);

            // One alert for the whole page instead of one per failed request
            const failed = results.filter((result) => result.status === "rejected");

            if (failed.length > 0) {
                showErrorAlert(failed.map((result) => result.reason.message).join("\n"));
            }
        };

        loadDashboard();
    }, []);

    const todayKey = today();
    const monthKey = todayKey.slice(0, 7);

    const todaySales = sales.filter((sale) => dayKey(sale.saleDate) === todayKey);
    const monthSales = sales.filter((sale) => dayKey(sale.saleDate).startsWith(monthKey));

    const sumTotal = (list) => list.reduce((sum, sale) => sum + Number(sale.totalAmount || 0), 0);

    const chartDays = lastDays(CHART_DAYS).map((day) => {
        const daySales = sales.filter((sale) => dayKey(sale.saleDate) === day.key);
        return { ...day, total: sumTotal(daySales), count: daySales.length };
    });

    const weekTotal = chartDays.reduce((sum, day) => sum + day.total, 0);

    const lowStock = inventory
        .filter((row) => row.quantityOnHand <= (row.reorderLevel ?? 0))
        .sort((a, b) => a.quantityOnHand - b.quantityOnHand);

    const pendingPurchases = purchases.filter((purchase) => purchase.status !== "Received");

    const recentSales = [...sales]
        .sort((a, b) => String(b.saleDate).localeCompare(String(a.saleDate)))
        .slice(0, 5);

    return (
        <div className="module-page">

            <div className="module-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
            </div>

            <div className="module-stats dashboard-stats">
                <div className="module-stat dashboard-stat">
                    <FontAwesomeIcon icon={faReceipt} />
                    <span>Today&apos;s Sales</span>
                    <strong>{formatCurrency(sumTotal(todaySales))}</strong>
                    <small>{todaySales.length} {todaySales.length === 1 ? "sale" : "sales"}</small>
                </div>

                <div className="module-stat dashboard-stat">
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>This Month</span>
                    <strong>{formatCurrency(sumTotal(monthSales))}</strong>
                    <small>{monthSales.length} {monthSales.length === 1 ? "sale" : "sales"}</small>
                </div>

                <div className="module-stat dashboard-stat">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                    <strong>{customers.length}</strong>
                    <small>registered</small>
                </div>

                <div className={`module-stat dashboard-stat${lowStock.length ? " warning" : ""}`}>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    <span>Low Stock</span>
                    <strong>{lowStock.length}</strong>
                    <small>at or below reorder level</small>
                </div>

                <div className="module-stat dashboard-stat">
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Pending Purchases</span>
                    <strong>{pendingPurchases.length}</strong>
                    <small>awaiting GRN</small>
                </div>
            </div>

            <section className="module-card">
                <div className="module-card-header">
                    <div>
                        <h2>Revenue, last {CHART_DAYS} days</h2>
                        <p className="dashboard-subtitle">Total {formatCurrency(weekTotal)}</p>
                    </div>

                    <Link to="/sales" className="dashboard-link">
                        Sale Record <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                <SalesChart days={chartDays} />
            </section>

            <div className="dashboard-grid">
                <section className="module-card">
                    <div className="module-card-header">
                        <h2>Recent Sales</h2>

                        <Link to="/sales" className="dashboard-link">
                            View all <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>

                    <div className="module-table-container dashboard-table">
                        <table className="module-table">
                            <thead>
                                <tr>
                                    <th>Sale No</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th className="num">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentSales.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="module-empty">No sales yet</td>
                                    </tr>
                                ) : (
                                    recentSales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td className="col-code">{sale.saleNo}</td>
                                            <td>{formatDate(sale.saleDate)}</td>
                                            <td className="strong">{sale.customerName || "Walk-in"}</td>
                                            <td className="num strong">{formatCurrency(sale.totalAmount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="module-card">
                    <div className="module-card-header">
                        <h2>Low Stock</h2>

                        <Link to="/inventory" className="dashboard-link">
                            Inventory <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>

                    <div className="module-table-container dashboard-table">
                        <table className="module-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th className="num">On Hand</th>
                                    <th className="num">Reorder</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lowStock.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="module-empty">All items are stocked</td>
                                    </tr>
                                ) : (
                                    lowStock.slice(0, 5).map((row) => (
                                        <tr key={row.itemId}>
                                            <td className="strong">{row.itemName}</td>
                                            <td className="num strong">{row.quantityOnHand}</td>
                                            <td className="num">{row.reorderLevel ?? 0}</td>
                                            <td>
                                                <StatusBadge status={row.quantityOnHand <= 0 ? "Out of Stock" : "Low Stock"} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="module-card">
                    <div className="module-card-header">
                        <h2>Pending Purchases</h2>

                        <Link to="/grn" className="dashboard-link">
                            Receive in GRN <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>

                    <div className="module-table-container dashboard-table">
                        <table className="module-table">
                            <thead>
                                <tr>
                                    <th>Purchase No</th>
                                    <th>Supplier</th>
                                    <th className="num">Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pendingPurchases.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="module-empty">Nothing waiting to be received</td>
                                    </tr>
                                ) : (
                                    pendingPurchases.slice(0, 5).map((purchase) => (
                                        <tr key={purchase.id}>
                                            <td className="col-code">{purchase.purchaseNo}</td>
                                            <td className="strong">{purchase.supplierName}</td>
                                            <td className="num">{formatCurrency(purchase.totalAmount)}</td>
                                            <td><StatusBadge status={purchase.status} /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default Dashboard;
