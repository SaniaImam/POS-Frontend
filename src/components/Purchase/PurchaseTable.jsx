import StatusBadge from "../Common/StatusBadge";

import { formatCurrency, formatDate } from "../../utils/format";

const PurchaseTable = ({ purchases, onView }) => {
    return (
        <div className="purchases-table-container">
            <table className="purchases-table">
                <thead>
                    <tr>
                        <th>Purchase No</th>
                        <th>Date</th>
                        <th>Supplier</th>
                        <th>Invoice No</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {purchases.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                No purchases found
                            </td>
                        </tr>
                    ) : (
                        purchases.map((purchase) => (
                            <tr key={purchase.id}>
                                <td>{purchase.purchaseNo}</td>
                                <td>{formatDate(purchase.purchaseDate)}</td>
                                <td>{purchase.supplierName}</td>
                                <td>{purchase.invoiceNo || "-"}</td>
                                <td>{purchase.itemCount}</td>
                                <td>{formatCurrency(purchase.totalAmount)}</td>
                                <td><StatusBadge status={purchase.status} /></td>

                                <td>
                                    <div className="purchase-actions">
                                        <button onClick={() => onView(purchase.id)}>
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseTable;
