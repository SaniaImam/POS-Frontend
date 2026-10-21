import { useEffect, useState } from "react";

import "../../styles/Inventory.css";

import InventoryModel from "../../models/InventoryModel.js";

import InventoryTable from "../../components/Inventory/InventoryTable";

import { getInventory } from "../../services/InventoryService";
import { formatCurrency } from "../../utils/format";

const stockStatus = (item) => {
    if (item.quantityOnHand <= 0) return "Out of Stock";
    if (item.quantityOnHand <= item.reorderLevel) return "Low Stock";
    return "In Stock";
};

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const loadInventory = async () => {
        const data = await getInventory();
        setInventory(data.map((item) => Object.assign(new InventoryModel(), item, { status: stockStatus(item) })));
    };

    const filteredInventory = inventory.filter((item) =>
        [item.itemCode, item.itemName, item.categoryName].some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        ) &&
        (!status || item.status === status)
    );

    const totalUnits = inventory.reduce((sum, item) => sum + item.quantityOnHand, 0);
    const stockValue = inventory.reduce((sum, item) => sum + item.quantityOnHand * item.averageCost, 0);
    const lowStockCount = inventory.filter((item) => item.status === "Low Stock").length;
    const outOfStockCount = inventory.filter((item) => item.status === "Out of Stock").length;

    useEffect(() => {
        loadInventory();
    }, []);

    return (
        <div className="inventory-page">

            <div className="inventory-header">
                <div>
                    <h1>Inventory</h1>
                    <p>Stock goes up with GRNs and down with sales.</p>
                </div>

                <button onClick={loadInventory}>
                    Refresh
                </button>
            </div>

            <div className="inventory-stats">
                <div className="inventory-stat">
                    <span>Items</span>
                    <strong>{inventory.length}</strong>
                </div>

                <div className="inventory-stat">
                    <span>Units on Hand</span>
                    <strong>{totalUnits}</strong>
                </div>

                <div className="inventory-stat">
                    <span>Stock Value</span>
                    <strong>{formatCurrency(stockValue)}</strong>
                </div>

                <div className="inventory-stat warning">
                    <span>Low Stock</span>
                    <strong>{lowStockCount}</strong>
                </div>

                <div className="inventory-stat danger">
                    <span>Out of Stock</span>
                    <strong>{outOfStockCount}</strong>
                </div>
            </div>

            <div className="inventory-toolbar">
                <div className="inventory-search">
                    <input
                        type="text"
                        aria-label="Search inventory"
                        placeholder="Search by item code, name or category"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    aria-label="Filter by stock status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Stock</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <span className="inventory-count">
                    {filteredInventory.length} {filteredInventory.length === 1 ? "item" : "items"}
                </span>
            </div>

            <InventoryTable inventory={filteredInventory} />

        </div>
    );
};

export default Inventory;
