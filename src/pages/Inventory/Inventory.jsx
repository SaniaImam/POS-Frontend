import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRotate } from "@fortawesome/free-solid-svg-icons";

import "../../styles/Inventory.css";

import StatusBadge from "../../components/Common/StatusBadge";

import { getInventory } from "../../services/InventoryService";
import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, formatDate } from "../../utils/format";

const stockStatus = (row) => {
    if (row.quantityOnHand <= 0) return "Out of Stock";
    if (row.quantityOnHand <= (row.reorderLevel ?? 0)) return "Low Stock";
    return "In Stock";
};

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Bumping reloadKey re-runs the load effect
    const [reloadKey, setReloadKey] = useState(0);

    const loadInventory = () => setReloadKey((key) => key + 1);

    useEffect(() => {
        const loadData = async () => {
            try {
                setInventory(await getInventory());
            } catch (error) {
                showErrorAlert(error.message);
            }
        };

        loadData();
    }, [reloadKey]);

    const rows = inventory.map((row) => ({ ...row, status: stockStatus(row) }));

    const term = search.trim().toLowerCase();

    const filteredRows = rows.filter((row) =>
        [row.itemCode, row.itemName, row.categoryName]
            .some((value) => String(value ?? "").toLowerCase().includes(term)) &&
        (!statusFilter || row.status === statusFilter)
    );

    const totalUnits = rows.reduce((sum, row) => sum + Number(row.quantityOnHand || 0), 0);
    const stockValue = rows.reduce((sum, row) => sum + Number(row.quantityOnHand || 0) * Number(row.averageCost || 0), 0);
    const lowStockCount = rows.filter((row) => row.status === "Low Stock").length;
    const outOfStockCount = rows.filter((row) => row.status === "Out of Stock").length;

    return (
        <div className="module-page">

            <div className="module-header">
                <div>
                    <h1>Inventory</h1>
                    <p>Current stock on hand. Stock goes up with GRNs and down with sales.</p>
                </div>

                <button className="btn-module-secondary" onClick={loadInventory}>
                    <FontAwesomeIcon icon={faRotate} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="module-stats">
                <div className="module-stat">
                    <span>Items</span>
                    <strong>{rows.length}</strong>
                </div>

                <div className="module-stat">
                    <span>Units on Hand</span>
                    <strong>{totalUnits}</strong>
                </div>

                <div className="module-stat">
                    <span>Stock Value</span>
                    <strong>{formatCurrency(stockValue)}</strong>
                </div>

                <div className="module-stat warning">
                    <span>Low Stock</span>
                    <strong>{lowStockCount}</strong>
                </div>

                <div className="module-stat danger">
                    <span>Out of Stock</span>
                    <strong>{outOfStockCount}</strong>
                </div>
            </div>

            <div className="module-toolbar">
                <div className="module-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        aria-label="Search inventory"
                        placeholder="Search by item code, name or category"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select aria-label="Filter by stock status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Stock</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <span className="module-count">
                    {filteredRows.length} {filteredRows.length === 1 ? "item" : "items"}
                </span>
            </div>

            <div className="module-table-container">
                <table className="module-table">
                    <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th className="num">On Hand</th>
                            <th className="num">Reorder Level</th>
                            <th className="num">Avg Cost</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="module-empty">No inventory found</td>
                            </tr>
                        ) : (
                            filteredRows.map((row) => (
                                <tr key={row.itemId}>
                                    <td className="col-code">{row.itemCode}</td>
                                    <td className="strong">{row.itemName}</td>
                                    <td>{row.categoryName}</td>
                                    <td className="num strong">{row.quantityOnHand}</td>
                                    <td className="num">{row.reorderLevel ?? 0}</td>
                                    <td className="num">{formatCurrency(row.averageCost)}</td>
                                    <td><StatusBadge status={row.status} /></td>
                                    <td>{formatDate(row.lastUpdated)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Inventory;
