import { formatCurrency, formatDate } from "../../utils/format";

const SaleDetailModal = ({ sale, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="sale-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sale-modal-header">
                    <h2>Sale {sale.saleNo}</h2>

                    <button
                        className="sale-modal-close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="sale-meta">
                    <div>
                        <span>Customer</span>
                        <strong>{sale.customerName || "Walk-in"}</strong>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>{formatDate(sale.saleDate)}</strong>
                    </div>

                    <div>
                        <span>Payment</span>
                        <strong>{sale.paymentMethod || "-"}</strong>
                    </div>
                </div>

                <div className="sale-items-table-container">
                    <table className="sale-items-table">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Line Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sale.items.map((item) => (
                                <tr key={item.itemId}>
                                    <td>{item.itemCode}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatCurrency(item.unitPrice)}</td>
                                    <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan="4">Subtotal</td>
                                <td>{formatCurrency(sale.subTotal)}</td>
                            </tr>

                            <tr>
                                <td colSpan="4">Discount</td>
                                <td>{formatCurrency(sale.discount)}</td>
                            </tr>

                            <tr>
                                <td colSpan="4">Total</td>
                                <td>{formatCurrency(sale.totalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="sale-modal-actions">
                    <button onClick={() => window.print()}>
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaleDetailModal;
