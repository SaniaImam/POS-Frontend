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

const sumTotal = (sales) => sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

const Dashboard = () => {
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [customers, setCustomers] = useState([]);

    const loadSales = async () => {
        const data = await getSales();
        setSales(data);
    };

    const loadInventory = async () => {
        const data = await getInventory();
        setInventory(data);
    };

    const loadPurchases = async () => {
        const data = await getPurchases();
        setPurchases(data);
    };

    const loadCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };

    useEffect(() => {
        loadSales();
        loadInventory();
        loadPurchases();
        loadCustomers();
    }, []);

    const todayKey = today();
    const monthKey = todayKey.slice(0, 7);

    const todaySales = sales.filter((sale) => dayKey(sale.saleDate) === todayKey);
    const monthSales = sales.filter((sale) => dayKey(sale.saleDate).startsWith(monthKey));

    const chartDays = lastDays(CHART_DAYS).map((day) => {
        const daySales = sales.filter((sale) => dayKey(sale.saleDate) === day.key);

        return { ...day, total: sumTotal(daySales), count: daySales.length };
    });

    const weekTotal = chartDays.reduce((sum, day) => sum + day.total, 0);

    const lowStock = inventory
        .filter((item) => item.quantityOnHand <= item.reorderLevel)
        .sort((a, b) => a.quantityOnHand - b.quantityOnHand);

    const pendingPurchases = purchases.filter((purchase) => purchase.status !== "Received");

    const recentSales = [...sales]
        .sort((a, b) => String(b.saleDate).localeCompare(String(a.saleDate)))
        .slice(0, 5);

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-stat">
                    <FontAwesomeIcon icon={faReceipt} />
                    <span>Today&apos;s Sales</span>
                    <strong>{formatCurrency(sumTotal(todaySales))}</strong>
                    <small>{todaySales.length} {todaySales.length === 1 ? "sale" : "sales"}</small>
                </div>

                <div className="dashboard-stat">
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>This Month</span>
                    <strong>{formatCurrency(sumTotal(monthSales))}</strong>
                    <small>{monthSales.length} {monthSales.length === 1 ? "sale" : "sales"}</small>
                </div>

                <div className="dashboard-stat">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                    <strong>{customers.length}</strong>
                    <small>registered</small>
                </div>

                <div className={lowStock.length ? "dashboard-stat warning" : "dashboard-stat"}>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    <span>Low Stock</span>
                    <strong>{lowStock.length}</strong>
                    <small>at or below reorder level</small>
                </div>

                <div className="dashboard-stat">
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Pending Purchases</span>
                    <strong>{pendingPurchases.length}</strong>
                    <small>awaiting GRN</small>
                </div>
            </div>

            <section className="dashboard-card">
                <div className="dashboard-card-header">
                    <div>
                        <h2>Revenue, last {CHART_DAYS} days</h2>
                        <p>Total {formatCurrency(weekTotal)}</p>
                    </div>

                    <Link to="/sales">
                        Sale Record <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                <SalesChart days={chartDays} />
            </section>

            <div className="dashboard-grid">
                <section className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2>Recent Sales</h2>

                        <Link to="/sales">
                            View all <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>

                    <div className="dashboard-sales-table-container">
                        <table className="dashboard-sales-table">
                            <thead>
                                <tr>
                                    <th>Sale No</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentSales.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                            No sales yet
                                        </td>
                                    </tr>
                                ) : (
                                    recentSales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td>{sale.saleNo}</td>
                                            <td>{formatDate(sale.saleDate)}</td>
                                            <td>{sale.customerName || "Walk-in"}</td>
                                            <td>{formatCurrency(sale.totalAmount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2>Low Stock</h2>

                        <Link to="/inventory">
                            Inventory <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>

                    <div className="dashboard-stock-table-container">
                        <table className="dashboard-stock-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>On Hand</th>
                                    <th>Reorder</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lowStock.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                            All items are stocked
                                        </td>
                                    </tr>
                                ) : (
                                    lowStock.slice(0, 5).map((item) => (
                                        <tr key={item.itemId}>
                                            <td>{item.itemName}</td>
                                            <td>{item.quantityOnHand}</td>
                                            <td>{item.reorderLevel}</td>
                                            <td>
                                                <StatusBadge status={item.quantityOnHand <= 0 ? "Out of Stock" : "Low Stock"} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2>Pending Purchases</h2>

                        <Link to="/grn">
                            Receive in GRN <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>

                    <div className="dashboard-purchases-table-container">
                        <table className="dashboard-purchases-table">
                            <thead>
                                <tr>
                                    <th>Purchase No</th>
                                    <th>Supplier</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pendingPurchases.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                            Nothing waiting to be received
                                        </td>
                                    </tr>
                                ) : (
                                    pendingPurchases.slice(0, 5).map((purchase) => (
                                        <tr key={purchase.id}>
                                            <td>{purchase.purchaseNo}</td>
                                            <td>{purchase.supplierName}</td>
                                            <td>{formatCurrency(purchase.totalAmount)}</td>
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
