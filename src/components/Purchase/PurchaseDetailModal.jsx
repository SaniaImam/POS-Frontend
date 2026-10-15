import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import StatusBadge from "../Common/StatusBadge";

import { getPurchaseById } from "../../services/PurchaseService";
import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, formatDate } from "../../utils/format";

const PurchaseDetailModal = ({ purchaseId, onClose }) => {
    const [purchase, setPurchase] = useState(null);

    useEffect(() => {
        const loadPurchase = async () => {
            try {
                setPurchase(await getPurchaseById(purchaseId));
            } catch (error) {
                showErrorAlert(error.message);
                onClose();
            }
        };

        loadPurchase();
    }, [purchaseId, onClose]);

    const lines = purchase?.items ?? [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="module-modal wide" onClick={(e) => e.stopPropagation()}>

                <div className="module-modal-header">
                    <h2>Purchase {purchase?.purchaseNo ?? ""}</h2>

                    <button className="module-modal-close" aria-label="Close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {!purchase ? (
                    <p className="module-empty">Loading...</p>
                ) : (
                    <>
                        <div className="module-meta">
                            <div><span>Supplier</span><strong>{purchase.supplierName}</strong></div>
                            <div><span>Date</span><strong>{formatDate(purchase.purchaseDate)}</strong></div>
                            <div><span>Invoice No</span><strong>{purchase.invoiceNo || "-"}</strong></div>
                            <div><span>Status</span><strong><StatusBadge status={purchase.status} /></strong></div>
                        </div>

                        {purchase.remarks && <p>{purchase.remarks}</p>}

                        <div className="module-table-container">
                            <table className="module-table">
                                <thead>
                                    <tr>
                                        <th>Item Code</th>
                                        <th>Item Name</th>
                                        <th className="num">Ordered</th>
                                        <th className="num">Received</th>
                                        <th className="num">Unit Cost</th>
                                        <th className="num">Line Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lines.map((line) => (
                                        <tr key={line.itemId}>
                                            <td className="col-code">{line.itemCode}</td>
                                            <td className="strong">{line.itemName}</td>
                                            <td className="num">{line.quantity}</td>
                                            <td className="num">{line.receivedQuantity ?? 0}</td>
                                            <td className="num">{formatCurrency(line.unitCost)}</td>
                                            <td className="num strong">{formatCurrency(line.quantity * line.unitCost)}</td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <td colSpan="5" className="num">Total</td>
                                        <td className="num">{formatCurrency(purchase.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default PurchaseDetailModal;
