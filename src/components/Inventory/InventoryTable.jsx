import StatusBadge from "../Common/StatusBadge";

import { formatCurrency, formatDate } from "../../utils/format";

const InventoryTable = ({ inventory }) => {
    return (
        <div className="inventory-table-container">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>On Hand</th>
                        <th>Reorder Level</th>
                        <th>Avg Cost</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>

                <tbody>
                    {inventory.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                No inventory found
                            </td>
                        </tr>
                    ) : (
                        inventory.map((item) => (
                            <tr key={item.itemId}>
                                <td>{item.itemCode}</td>
                                <td>{item.itemName}</td>
                                <td>{item.categoryName}</td>
                                <td>{item.quantityOnHand}</td>
                                <td>{item.reorderLevel}</td>
                                <td>{formatCurrency(item.averageCost)}</td>
                                <td><StatusBadge status={item.status} /></td>
                                <td>{formatDate(item.lastUpdated)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
