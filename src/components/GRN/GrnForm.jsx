import { useEffect, useState } from "react";

import { getPurchases, getPurchaseById } from "../../services/PurchaseService";
import { showErrorAlert } from "../../utils/sweetAlert";
import { formatDate, today } from "../../utils/format";

const GrnForm = ({ onSubmit, onCancel }) => {
    const [purchases, setPurchases] = useState([]);
    const [purchaseId, setPurchaseId] = useState("");
    const [purchase, setPurchase] = useState(null);
    const [grnDate, setGrnDate] = useState(today());
    const [remarks, setRemarks] = useState("");
    const [lines, setLines] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadPurchases = async () => {
            try {
                const data = await getPurchases();

                // Only purchases with stock still to receive
                setPurchases(data.filter((item) => item.status !== "Received"));
            } catch (error) {
                showErrorAlert(error.message);
            }
        };

        loadPurchases();
    }, []);

    const handlePurchaseChange = async (e) => {
        const id = e.target.value;

        setPurchaseId(id);
        setPurchase(null);
        setLines([]);

        if (!id) {
            return;
        }

        try {
            const data = await getPurchaseById(id);

            setPurchase(data);

            setLines(
                (data.items ?? [])
                    .map((line) => {
                        const pending = line.quantity - (line.receivedQuantity ?? 0);

                        return { ...line, pending, receiving: String(pending) };
                    })
                    .filter((line) => line.pending > 0)
            );
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const handleReceivingChange = (itemId, value) => {
        setLines(lines.map((line) =>
            line.itemId === itemId ? { ...line, receiving: value } : line
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!purchaseId) {
            showErrorAlert("Please select a purchase.");
            return;
        }

        const invalid = lines.some((line) => {
            const qty = Number(line.receiving || 0);
            return qty < 0 || qty > line.pending || !Number.isInteger(qty);
        });

        if (invalid) {
            showErrorAlert("Received quantity must be a whole number between 0 and the pending quantity.");
            return;
        }

        const receivedLines = lines.filter((line) => Number(line.receiving) > 0);

        if (receivedLines.length === 0) {
            showErrorAlert("Enter a received quantity for at least one item.");
            return;
        }

        setSaving(true);

        try {
            await onSubmit({
                purchaseId: Number(purchaseId),
                grnDate,
                remarks: remarks.trim() || null,
                items: receivedLines.map((line) => ({
                    itemId: line.itemId,
                    receivedQuantity: Number(line.receiving)
                }))
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <form
                className="module-modal wide"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>New Goods Received Note</h2>

                <div className="module-grid">
                    <div className="module-field">
                        <label htmlFor="grn-purchase">Purchase</label>
                        <select id="grn-purchase" value={purchaseId} onChange={handlePurchaseChange}>
                            <option value="">Select Purchase</option>

                            {purchases.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.purchaseNo} - {item.supplierName} ({item.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="module-field">
                        <label htmlFor="grn-date">GRN Date</label>
                        <input
                            id="grn-date"
                            type="date"
                            value={grnDate}
                            onChange={(e) => setGrnDate(e.target.value)}
                        />
                    </div>
                </div>

                {purchase && (
                    <div className="module-meta">
                        <div><span>Supplier</span><strong>{purchase.supplierName}</strong></div>
                        <div><span>Purchase Date</span><strong>{formatDate(purchase.purchaseDate)}</strong></div>
                        <div><span>Invoice No</span><strong>{purchase.invoiceNo || "-"}</strong></div>
                    </div>
                )}

                {purchase && (
                    <div className="module-table-container">
                        <table className="module-table">
                            <thead>
                                <tr>
                                    <th>Item Code</th>
                                    <th>Item Name</th>
                                    <th className="num">Ordered</th>
                                    <th className="num">Already Received</th>
                                    <th className="num">Pending</th>
                                    <th className="num" style={{ width: "140px" }}>Receiving Now</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="module-empty">All items on this purchase are received</td>
                                    </tr>
                                ) : (
                                    lines.map((line) => (
                                        <tr key={line.itemId}>
                                            <td className="col-code">{line.itemCode}</td>
                                            <td className="strong">{line.itemName}</td>
                                            <td className="num">{line.quantity}</td>
                                            <td className="num">{line.receivedQuantity ?? 0}</td>
                                            <td className="num">{line.pending}</td>
                                            <td>
                                                <input
                                                    className="line-input num"
                                                    type="number"
                                                    min="0"
                                                    max={line.pending}
                                                    step="1"
                                                    aria-label={`Receiving quantity for ${line.itemName}`}
                                                    value={line.receiving}
                                                    onChange={(e) => handleReceivingChange(line.itemId, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="module-field">
                    <label htmlFor="grn-remarks">Remarks</label>
                    <textarea
                        id="grn-remarks"
                        placeholder="Optional notes (damaged goods, short delivery, etc.)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>

                <div className="module-form-actions">
                    <button type="button" className="btn-module-secondary" onClick={onCancel}>
                        Cancel
                    </button>

                    <button type="submit" className="btn-module-primary" disabled={saving || lines.length === 0}>
                        {saving ? "Saving..." : "Receive Stock"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GrnForm;
