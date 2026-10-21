import { useEffect, useState } from "react";

import PurchaseModel from "../../models/PurchaseModel.js";
import PurchaseItemModel from "../../models/PurchaseItemModel.js";

import { getSuppliers } from "../../services/SupplierService";
import { getItems } from "../../services/ItemService";

import { showErrorAlert } from "../../utils/sweetAlert";
import { formatCurrency, today } from "../../utils/format";

// key is only for React's list rendering, it is not sent to the API
const emptyLine = () => ({
    ...new PurchaseItemModel(),
    key: crypto.randomUUID()
});

const PurchaseForm = ({ onSubmit, onCancel }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);

    const [formData, setFormData] = useState({
        ...new PurchaseModel(),
        purchaseDate: today()
    });

    const [lines, setLines] = useState([emptyLine()]);

    useEffect(() => {
        const loadSuppliers = async () => {
            const data = await getSuppliers();
            setSuppliers(data);
        };

        const loadItems = async () => {
            const data = await getItems();
            setItems(data);
        };

        loadSuppliers();
        loadItems();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLineChange = (key, e) => {
        setLines(lines.map((line) =>
            line.key === key
                ? { ...line, [e.target.name]: e.target.value }
                : line
        ));
    };

    const handleAddLine = () => {
        setLines([...lines, emptyLine()]);
    };

    const handleRemoveLine = (key) => {
        setLines(lines.length === 1
            ? [emptyLine()]
            : lines.filter((line) => line.key !== key)
        );
    };

    const lineTotal = (line) => Number(line.quantity || 0) * Number(line.unitCost || 0);

    const grandTotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);

    // Items already picked on another line are disabled so each item appears once
    const selectedItemIds = lines.map((line) => line.itemId).filter(Boolean);

    const handleSubmit = (e) => {
        e.preventDefault();

        const filledLines = lines.filter((line) => line.itemId);

        if (!formData.supplierId) {
            showErrorAlert("Please select a supplier.");
            return;
        }

        if (filledLines.length === 0) {
            showErrorAlert("Please add at least one item.");
            return;
        }

        if (filledLines.some((line) => Number(line.quantity) <= 0 || line.unitCost === "" || Number(line.unitCost) < 0)) {
            showErrorAlert("Every item needs a quantity above 0 and a unit cost.");
            return;
        }

        onSubmit({
            supplierId: Number(formData.supplierId),
            purchaseDate: formData.purchaseDate,
            invoiceNo: formData.invoiceNo,
            remarks: formData.remarks,
            items: filledLines.map((line) => ({
                itemId: Number(line.itemId),
                quantity: Number(line.quantity),
                unitCost: Number(line.unitCost)
            }))
        });
    };

    return (
        <form className="purchase-form" onSubmit={handleSubmit}>

            <section className="purchase-card">
                <h2>Purchase Details</h2>

                <div className="purchase-form-grid">
                    <div className="purchase-form-field">
                        <label>Supplier</label>

                        <select
                            name="supplierId"
                            value={formData.supplierId}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Supplier
                            </option>

                            {suppliers.map((supplier) => (
                                <option
                                    key={supplier.id}
                                    value={supplier.id}
                                >
                                    {supplier.supplierCode} - {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="purchase-form-field">
                        <label>Purchase Date</label>
                        <input
                            type="date"
                            name="purchaseDate"
                            value={formData.purchaseDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="purchase-form-field">
                        <label>Supplier Invoice No</label>
                        <input
                            type="text"
                            name="invoiceNo"
                            placeholder="Optional"
                            value={formData.invoiceNo}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="purchase-form-field">
                    <label>Remarks</label>
                    <textarea
                        name="remarks"
                        placeholder="Optional notes"
                        value={formData.remarks}
                        onChange={handleChange}
                    />
                </div>
            </section>

            <section className="purchase-card">
                <div className="purchase-card-header">
                    <h2>Items</h2>

                    <button type="button" onClick={handleAddLine}>
                        Add Item
                    </button>
                </div>

                <div className="purchase-lines-table-container">
                    <table className="purchase-lines-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit Cost</th>
                                <th>Line Total</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {lines.map((line) => (
                                <tr key={line.key}>
                                    <td>
                                        <select
                                            name="itemId"
                                            aria-label="Item"
                                            value={line.itemId}
                                            onChange={(e) => handleLineChange(line.key, e)}
                                        >
                                            <option value="">
                                                Select Item
                                            </option>

                                            {items.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                    disabled={String(item.id) !== line.itemId && selectedItemIds.includes(String(item.id))}
                                                >
                                                    {item.itemCode} - {item.itemName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="quantity"
                                            aria-label="Quantity"
                                            min="1"
                                            step="1"
                                            placeholder="0"
                                            value={line.quantity}
                                            onChange={(e) => handleLineChange(line.key, e)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            name="unitCost"
                                            aria-label="Unit cost"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={line.unitCost}
                                            onChange={(e) => handleLineChange(line.key, e)}
                                        />
                                    </td>

                                    <td>{formatCurrency(lineTotal(line))}</td>

                                    <td>
                                        <button type="button" onClick={() => handleRemoveLine(line.key)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="purchase-total">
                    <span>Grand Total</span>
                    <strong>{formatCurrency(grandTotal)}</strong>
                </div>
            </section>

            <div className="purchase-form-actions">
                <button type="submit">
                    Save
                </button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>

        </form>
    );
};

export default PurchaseForm;
