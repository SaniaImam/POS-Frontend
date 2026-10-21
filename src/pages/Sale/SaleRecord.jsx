import { useEffect, useState } from "react";

import "../../styles/Sale.css";

import SaleModel from "../../models/SaleModel.js";
import SaleItemModel from "../../models/SaleItemModel.js";

import SaleTable from "../../components/Sale/SaleTable";
import SaleDetailModal from "../../components/Sale/SaleDetailModal";

import {
    getSales,
    getSaleById
} from "../../services/SaleService";

import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, isWithinDateRange } from "../../utils/format";

const SaleRecord = () => {
    const [sales, setSales] = useState([]);
    const [viewingSale, setViewingSale] = useState(null);
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const loadSales = async () => {
        const data = await getSales();
        setSales(data.map((sale) => Object.assign(new SaleModel(), sale)));
    };

    const filteredSales = sales.filter((sale) =>
        [sale.saleNo, sale.customerName].some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        ) &&
        (!paymentMethod || sale.paymentMethod === paymentMethod) &&
        isWithinDateRange(sale.saleDate, fromDate, toDate)
    );

    const paymentMethods = [...new Set(sales.map((sale) => sale.paymentMethod).filter(Boolean))];

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.itemCount, 0);
    const averageSale = filteredSales.length ? totalRevenue / filteredSales.length : 0;

    useEffect(() => {
        loadSales();
    }, []);

    const handleView = async (id) => {
        try {
            const data = await getSaleById(id);

            setViewingSale(Object.assign(new SaleModel(), data, {
                items: data.items.map((item) => Object.assign(new SaleItemModel(), item))
            }));
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="sales-page">

            <div className="sales-header">
                <h1>Sale Record</h1>
            </div>

            <div className="sales-stats">
                <div className="sale-stat">
                    <span>Sales</span>
                    <strong>{filteredSales.length}</strong>
                </div>

                <div className="sale-stat">
                    <span>Revenue</span>
                    <strong>{formatCurrency(totalRevenue)}</strong>
                </div>

                <div className="sale-stat">
                    <span>Items Sold</span>
                    <strong>{totalItems}</strong>
                </div>

                <div className="sale-stat">
                    <span>Average Sale</span>
                    <strong>{formatCurrency(averageSale)}</strong>
                </div>
            </div>

            <div className="sales-toolbar">
                <div className="sales-search">
                    <input
                        type="text"
                        aria-label="Search sales"
                        placeholder="Search by sale no or customer"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    aria-label="Filter by payment method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">All Payments</option>

                    {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                            {method}
                        </option>
                    ))}
                </select>

                <label>
                    From
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </label>

                <label>
                    To
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </label>
            </div>

            <SaleTable
                sales={filteredSales}
                onView={handleView}
            />

            {viewingSale && (
                <SaleDetailModal
                    sale={viewingSale}
                    onClose={() => setViewingSale(null)}
                />
            )}

        </div>
    );
};

export default SaleRecord;
