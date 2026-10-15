import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../styles/Purchase.css";

import StatusBadge from "../../components/Common/StatusBadge";
import PurchaseDetailModal from "../../components/Purchase/PurchaseDetailModal";

import { getPurchases } from "../../services/PurchaseService";
import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, formatDate, isWithinDateRange } from "../../utils/format";

const PurchaseList = () => {
    const navigate = useNavigate();

    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [viewingId, setViewingId] = useState(null);

    useEffect(() => {
        const loadPurchases = async () => {
            try {
                setPurchases(await getPurchases());
            } catch (error) {
                showErrorAlert(error.message);
            }
        };

        loadPurchases();
    }, []);

    const closeDetail = useCallback(() => setViewingId(null), []);

    const term = search.trim().toLowerCase();

    const filteredPurchases = purchases.filter((purchase) =>
        [purchase.purchaseNo, purchase.supplierName, purchase.invoiceNo]
            .some((value) => String(value ?? "").toLowerCase().includes(term)) &&
        (!status || purchase.status === status) &&
        isWithinDateRange(purchase.purchaseDate, fromDate, toDate)
    );

    const filteredTotal = filteredPurchases.reduce((sum, purchase) => sum + Number(purchase.totalAmount || 0), 0);

    return (
        <div className="module-page">

            <div className="module-header">
                <h1>Purchase List</h1>

                <button className="btn-module-primary" onClick={() => navigate("/purchases/new")}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Purchase</span>
                </button>
            </div>

            <div className="module-toolbar">
                <div className="module-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        aria-label="Search purchases"
                        placeholder="Search by purchase no, supplier or invoice"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Received">Received</option>
                </select>

                <label className="module-filter">
                    From
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </label>

                <label className="module-filter">
                    To
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </label>

                <span className="module-count">
                    {filteredPurchases.length} {filteredPurchases.length === 1 ? "purchase" : "purchases"}
                    {" · "}Total {formatCurrency(filteredTotal)}
                </span>
            </div>

            <div className="module-table-container">
                <table className="module-table">
                    <thead>
                        <tr>
                            <th>Purchase No</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Invoice No</th>
                            <th className="num">Items</th>
                            <th className="num">Total</th>
                            <th>Status</th>
                            <th className="actions-col">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPurchases.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="module-empty">No purchases found</td>
                            </tr>
                        ) : (
                            filteredPurchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td className="col-code">{purchase.purchaseNo}</td>
                                    <td>{formatDate(purchase.purchaseDate)}</td>
                                    <td className="strong">{purchase.supplierName}</td>
                                    <td>{purchase.invoiceNo || "-"}</td>
                                    <td className="num">{purchase.itemCount}</td>
                                    <td className="num strong">{formatCurrency(purchase.totalAmount)}</td>
                                    <td><StatusBadge status={purchase.status} /></td>
                                    <td>
                                        <div className="module-actions">
                                            <button
                                                className="view"
                                                title="View"
                                                aria-label={`View purchase ${purchase.purchaseNo}`}
                                                onClick={() => setViewingId(purchase.id)}
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
                <PurchaseDetailModal purchaseId={viewingId} onClose={closeDetail} />
            )}

        </div>
    );
};

export default PurchaseList;
