import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Purchase.css";

import PurchaseModel from "../../models/PurchaseModel.js";
import PurchaseItemModel from "../../models/PurchaseItemModel.js";

import PurchaseTable from "../../components/Purchase/PurchaseTable";
import PurchaseDetailModal from "../../components/Purchase/PurchaseDetailModal";

import {
    getPurchases,
    getPurchaseById
} from "../../services/PurchaseService";

import { showErrorAlert } from "../../utils/sweetAlert";
import { isWithinDateRange } from "../../utils/format";

const PurchaseList = () => {
    const navigate = useNavigate();

    const [purchases, setPurchases] = useState([]);
    const [viewingPurchase, setViewingPurchase] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const loadPurchases = async () => {
        const data = await getPurchases();
        setPurchases(data.map((purchase) => Object.assign(new PurchaseModel(), purchase)));
    };

    const filteredPurchases = purchases.filter((purchase) =>
        [purchase.purchaseNo, purchase.supplierName, purchase.invoiceNo].some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        ) &&
        (!status || purchase.status === status) &&
        isWithinDateRange(purchase.purchaseDate, fromDate, toDate)
    );

    useEffect(() => {
        loadPurchases();
    }, []);

    const handleView = async (id) => {
        try {
            const data = await getPurchaseById(id);

            setViewingPurchase(Object.assign(new PurchaseModel(), data, {
                items: data.items.map((item) => Object.assign(new PurchaseItemModel(), item))
            }));
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="purchases-page">

            <div className="purchases-header">
                <h1>Purchase List</h1>

                <button onClick={() => navigate("/purchases/new")}>
                    New Purchase
                </button>
            </div>

            <div className="purchases-toolbar">
                <div className="purchases-search">
                    <input
                        type="text"
                        aria-label="Search purchases"
                        placeholder="Search by purchase no, supplier or invoice"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    aria-label="Filter by status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Received">Received</option>
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

                <span className="purchases-count">
                    {filteredPurchases.length} {filteredPurchases.length === 1 ? "purchase" : "purchases"}
                </span>
            </div>

            <PurchaseTable
                purchases={filteredPurchases}
                onView={handleView}
            />

            {viewingPurchase && (
                <PurchaseDetailModal
                    purchase={viewingPurchase}
                    onClose={() => setViewingPurchase(null)}
                />
            )}

        </div>
    );
};

export default PurchaseList;
