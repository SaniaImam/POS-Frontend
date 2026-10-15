import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPrint } from "@fortawesome/free-solid-svg-icons";

import { getSaleById } from "../../services/SaleService";
import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, formatDate } from "../../utils/format";

const SaleDetailModal = ({ saleId, onClose }) => {
    const [sale, setSale] = useState(null);

    useEffect(() => {
        const loadSale = async () => {
            try {
                setSale(await getSaleById(saleId));
            } catch (error) {
                showErrorAlert(error.message);
                onClose();
            }
        };

        loadSale();
    }, [saleId, onClose]);

    const lines = sale?.items ?? [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="module-modal wide" onClick={(e) => e.stopPropagation()}>

                <div className="module-modal-header">
                    <h2>Sale {sale?.saleNo ?? ""}</h2>

                    <button className="module-modal-close" aria-label="Close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {!sale ? (
                    <p className="module-empty">Loading...</p>
                ) : (
                    <>
                        <div className="module-meta">
                            <div><span>Customer</span><strong>{sale.customerName || "Walk-in"}</strong></div>
                            <div><span>Date</span><strong>{formatDate(sale.saleDate)}</strong></div>
                            <div><span>Payment</span><strong>{sale.paymentMethod || "-"}</strong></div>
                        </div>

                        <div className="module-table-container">
                            <table className="module-table">
                                <thead>
                                    <tr>
                                        <th>Item Code</th>
                                        <th>Item Name</th>
                                        <th className="num">Qty</th>
                                        <th className="num">Unit Price</th>
                                        <th className="num">Line Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lines.map((line) => (
                                        <tr key={line.itemId}>
                                            <td className="col-code">{line.itemCode}</td>
                                            <td className="strong">{line.itemName}</td>
                                            <td className="num">{line.quantity}</td>
                                            <td className="num">{formatCurrency(line.unitPrice)}</td>
                                            <td className="num strong">{formatCurrency(line.quantity * line.unitPrice)}</td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="num">Subtotal</td>
                                        <td className="num">{formatCurrency(sale.subTotal)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="num">Discount</td>
                                        <td className="num">{formatCurrency(sale.discount)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="num">Total</td>
                                        <td className="num">{formatCurrency(sale.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="module-form-actions">
                            <button type="button" className="btn-module-secondary" onClick={() => window.print()}>
                                <FontAwesomeIcon icon={faPrint} />
                                <span>Print</span>
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default SaleDetailModal;
