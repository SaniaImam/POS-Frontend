import StatusBadge from "../Common/StatusBadge";

import { formatCurrency, formatDate } from "../../utils/format";

const PurchaseDetailModal = ({ purchase, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="purchase-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="purchase-modal-header">
                    <h2>Purchase {purchase.purchaseNo}</h2>

                    <button
                        className="purchase-modal-close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="purchase-meta">
                    <div>
                        <span>Supplier</span>
                        <strong>{purchase.supplierName}</strong>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>{formatDate(purchase.purchaseDate)}</strong>
                    </div>

                    <div>
                        <span>Invoice No</span>
                        <strong>{purchase.invoiceNo || "-"}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong><StatusBadge status={purchase.status} /></strong>
                    </div>
                </div>

                {purchase.notes && <p>{purchase.notes}</p>}

                <div className="purchase-items-table-container">
                    <table className="purchase-items-table">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Ordered</th>
                                <th>Received</th>
                                <th>Unit Cost</th>
                                <th>Line Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchase.items.map((item) => (
                                <tr key={item.itemId}>
                                    <td>{item.itemCode}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.receivedQuantity}</td>
                                    <td>{formatCurrency(item.unitCost)}</td>
                                    <td>{formatCurrency(item.quantity * item.unitCost)}</td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan="5">Total</td>
                                <td>{formatCurrency(purchase.totalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDetailModal;
