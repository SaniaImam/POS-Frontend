import { formatCurrency, formatDate } from "../../utils/format";

const SaleTable = ({ sales, onView }) => {
    return (
        <div className="sales-table-container">
            <table className="sales-table">
                <thead>
                    <tr>
                        <th>Sale No</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                No sales found
                            </td>
                        </tr>
                    ) : (
                        sales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.saleNo}</td>
                                <td>{formatDate(sale.saleDate)}</td>
                                <td>{sale.customerName || "Walk-in"}</td>
                                <td>{sale.itemCount}</td>
                                <td>{formatCurrency(sale.discount)}</td>
                                <td>{formatCurrency(sale.totalAmount)}</td>
                                <td>{sale.paymentMethod || "-"}</td>

                                <td>
                                    <div className="sale-actions">
                                        <button onClick={() => onView(sale.id)}>
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

export default SaleTable;
