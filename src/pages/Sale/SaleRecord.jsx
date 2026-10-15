import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../styles/Sale.css";

import SaleDetailModal from "../../components/Sale/SaleDetailModal";

import { getSales } from "../../services/SaleService";
import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, formatDate, isWithinDateRange } from "../../utils/format";

const SaleRecord = () => {
    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState("");
    const [payment, setPayment] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [viewingId, setViewingId] = useState(null);

    useEffect(() => {
        const loadSales = async () => {
            try {
                setSales(await getSales());
            } catch (error) {
                showErrorAlert(error.message);
            }
        };

        loadSales();
    }, []);

    const closeDetail = useCallback(() => setViewingId(null), []);

    const paymentMethods = [...new Set(sales.map((sale) => sale.paymentMethod).filter(Boolean))];

    const term = search.trim().toLowerCase();

    const filteredSales = sales.filter((sale) =>
        [sale.saleNo, sale.customerName]
            .some((value) => String(value ?? "").toLowerCase().includes(term)) &&
        (!payment || sale.paymentMethod === payment) &&
        isWithinDateRange(sale.saleDate, fromDate, toDate)
    );

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + Number(sale.totalAmount || 0), 0);
    const totalItems = filteredSales.reduce((sum, sale) => sum + Number(sale.itemCount || 0), 0);
    const averageSale = filteredSales.length ? totalRevenue / filteredSales.length : 0;

    return (
        <div className="module-page">

            <div className="module-header">
                <h1>Sale Record</h1>
            </div>

            <div className="module-stats">
                <div className="module-stat">
                    <span>Sales</span>
                    <strong>{filteredSales.length}</strong>
                </div>

                <div className="module-stat">
                    <span>Revenue</span>
                    <strong>{formatCurrency(totalRevenue)}</strong>
                </div>

                <div className="module-stat">
                    <span>Items Sold</span>
                    <strong>{totalItems}</strong>
                </div>

                <div className="module-stat">
                    <span>Average Sale</span>
                    <strong>{formatCurrency(averageSale)}</strong>
                </div>
            </div>

            <div className="module-toolbar">
                <div className="module-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        aria-label="Search sales"
                        placeholder="Search by sale no or customer"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select aria-label="Filter by payment method" value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <option value="">All Payments</option>

                    {paymentMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </select>

                <label className="module-filter">
                    From
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </label>

                <label className="module-filter">
                    To
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </label>
            </div>

            <div className="module-table-container">
                <table className="module-table">
                    <thead>
                        <tr>
                            <th>Sale No</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th className="num">Items</th>
                            <th className="num">Discount</th>
                            <th className="num">Total</th>
                            <th>Payment</th>
                            <th className="actions-col">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSales.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="module-empty">No sales found</td>
                            </tr>
                        ) : (
                            filteredSales.map((sale) => (
                                <tr key={sale.id}>
                                    <td className="col-code">{sale.saleNo}</td>
                                    <td>{formatDate(sale.saleDate)}</td>
                                    <td className="strong">{sale.customerName || "Walk-in"}</td>
                                    <td className="num">{sale.itemCount}</td>
                                    <td className="num">{formatCurrency(sale.discount)}</td>
                                    <td className="num strong">{formatCurrency(sale.totalAmount)}</td>
                                    <td>{sale.paymentMethod || "-"}</td>
                                    <td>
                                        <div className="module-actions">
                                            <button
                                                className="view"
                                                title="View"
                                                aria-label={`View sale ${sale.saleNo}`}
                                                onClick={() => setViewingId(sale.id)}
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {viewingId && (
                <SaleDetailModal saleId={viewingId} onClose={closeDetail} />
            )}

        </div>
    );
};

export default SaleRecord;
