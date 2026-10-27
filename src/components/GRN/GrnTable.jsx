import { formatDate } from "../../utils/format";

const GrnTable = ({ grns }) => {
    return (
        <div className="grn-table-container">
            <table className="grn-table">
                <thead>
                    <tr>
                        <th>GRN No</th>
                        <th>Date</th>
                        <th>Purchase No</th>
                        <th>Supplier</th>
                        <th>Items</th>
                        <th>Total Qty</th>
                        <th>Remarks</th>
                    </tr>
                </thead>

                <tbody>
                    {grns.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                No GRNs found
                            </td>
                        </tr>
                    ) : (
                        grns.map((grn) => (
                            <tr key={grn.id}>
                                <td>{grn.grnNo}</td>
                                <td>{formatDate(grn.grnDate)}</td>
                                <td>{grn.purchaseNo}</td>
                                <td>{grn.supplierName}</td>
                                <td>{grn.itemCount}</td>
                                <td>{grn.totalQuantity}</td>
                                <td>{grn.notes || "-"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GrnTable;
