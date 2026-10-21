import { useEffect, useState } from "react";

import GrnModel from "../../models/GrnModel.js";
import GrnItemModel from "../../models/GrnItemModel.js";

import {
    getPurchases,
    getPurchaseById
} from "../../services/PurchaseService";

import { showErrorAlert } from "../../utils/sweetAlert";
import { formatDate, today } from "../../utils/format";

const GrnForm = ({ onSubmit, onCancel }) => {
    const [purchases, setPurchases] = useState([]);
    const [purchase, setPurchase] = useState(null);
    const [lines, setLines] = useState([]);

    const [formData, setFormData] = useState({
        ...new GrnModel(),
        grnDate: today()
    });

    useEffect(() => {
        const loadPurchases = async () => {
            const data = await getPurchases();

            // Only purchases that still have stock to receive
            setPurchases(data.filter((item) => item.status !== "Received"));
        };

        loadPurchases();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePurchaseChange = async (e) => {
        handleChange(e);

        setPurchase(null);
        setLines([]);

        if (!e.target.value) {
            return;
        }

        try {
            const data = await getPurchaseById(e.target.value);

            setPurchase(data);

            setLines(
                data.items
                    .map((item) => new GrnItemModel(
                        item.itemId,
                        item.itemCode,
                        item.itemName,
                        item.quantity,
                        item.receivedQuantity,
                        item.quantity - item.receivedQuantity,
                        String(item.quantity - item.receivedQuantity)
                    ))
                    .filter((item) => item.pendingQuantity > 0)
            );
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const handleLineChange = (itemId, value) => {
        setLines(lines.map((line) =>
            line.itemId === itemId
                ? { ...line, receivingQuantity: value }
                : line
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.purchaseId) {
            showErrorAlert("Please select a purchase.");
            return;
        }

        const invalidLine = lines.some((line) => {
            const quantity = Number(line.receivingQuantity || 0);

            return !Number.isInteger(quantity) || quantity < 0 || quantity > line.pendingQuantity;
        });

        if (invalidLine) {
            showErrorAlert("Receiving quantity must be a whole number between 0 and the pending quantity.");
            return;
        }

        const receivedLines = lines.filter((line) => Number(line.receivingQuantity) > 0);

        if (receivedLines.length === 0) {
            showErrorAlert("Enter a receiving quantity for at least one item.");
            return;
        }

        onSubmit({
            purchaseId: Number(formData.purchaseId),
            grnDate: formData.grnDate,
            remarks: formData.remarks,
            items: receivedLines.map((line) => ({
                itemId: line.itemId,
                receivedQuantity: Number(line.receivingQuantity)
            }))
        });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <form
                className="grn-form"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>New GRN</h2>

                <div className="grn-form-field">
                    <label>Purchase</label>

                    <select
                        name="purchaseId"
                        value={formData.purchaseId}
                        onChange={handlePurchaseChange}
                    >
                        <option value="">
                            Select Purchase
                        </option>

                        {purchases.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.purchaseNo} - {item.supplierName} ({item.status})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grn-form-field">
                    <label>GRN Date</label>
                    <input
                        type="date"
                        name="grnDate"
                        value={formData.grnDate}
                        onChange={handleChange}
                    />
                </div>

                {purchase && (
                    <div className="grn-meta">
                        <div>
                            <span>Supplier</span>
                            <strong>{purchase.supplierName}</strong>
                        </div>

                        <div>
                            <span>Purchase Date</span>
                            <strong>{formatDate(purchase.purchaseDate)}</strong>
                        </div>

                        <div>
                            <span>Invoice No</span>
                            <strong>{purchase.invoiceNo || "-"}</strong>
                        </div>
                    </div>
                )}

                {purchase && (
                    <div className="grn-items-table-container">
                        <table className="grn-items-table">
                            <thead>
                                <tr>
                                    <th>Item Code</th>
                                    <th>Item Name</th>
                                    <th>Ordered</th>
                                    <th>Received</th>
                                    <th>Pending</th>
                                    <th>Receiving Now</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                            All items on this purchase are received
                                        </td>
                                    </tr>
                                ) : (
                                    lines.map((line) => (
                                        <tr key={line.itemId}>
                                            <td>{line.itemCode}</td>
                                            <td>{line.itemName}</td>
                                            <td>{line.quantity}</td>
                                            <td>{line.receivedQuantity}</td>
                                            <td>{line.pendingQuantity}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    aria-label={`Receiving quantity for ${line.itemName}`}
                                                    min="0"
                                                    max={line.pendingQuantity}
                                                    step="1"
                                                    value={line.receivingQuantity}
                                                    onChange={(e) => handleLineChange(line.itemId, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="grn-form-field">
                    <label>Remarks</label>
                    <textarea
                        name="remarks"
                        placeholder="Optional notes (damaged goods, short delivery, etc.)"
                        value={formData.remarks}
                        onChange={handleChange}
                    />
                </div>

                <div className="grn-form-actions">
                    <button type="submit" disabled={lines.length === 0}>
                        Save
                    </button>

                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GrnForm;
