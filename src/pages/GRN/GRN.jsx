import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../styles/Grn.css";

import GrnForm from "../../components/GRN/GrnForm";

import { getGrns, addGrn } from "../../services/GrnService";
import { showErrorAlert, showSuccessAlert } from "../../utils/sweetAlert";
import { formatDate, isWithinDateRange } from "../../utils/format";

const GRN = () => {
    const [grns, setGrns] = useState([]);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Bumping reloadKey re-runs the load effect
    const [reloadKey, setReloadKey] = useState(0);

    const loadGrns = () => setReloadKey((key) => key + 1);

    useEffect(() => {
        const loadData = async () => {
            try {
                setGrns(await getGrns());
            } catch (error) {
                showErrorAlert(error.message);
            }
        };

        loadData();
    }, [reloadKey]);

    const handleSubmit = async (grn) => {
        try {
            const data = await addGrn(grn);

            setShowForm(false);
            showSuccessAlert(`GRN ${data.grnNo ?? ""} saved. Inventory updated.`);

            loadGrns();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const term = search.trim().toLowerCase();

    const filteredGrns = grns.filter((grn) =>
        [grn.grnNo, grn.purchaseNo, grn.supplierName]
            .some((value) => String(value ?? "").toLowerCase().includes(term)) &&
        isWithinDateRange(grn.grnDate, fromDate, toDate)
    );

    return (
        <div className="module-page">

            <div className="module-header">
                <div>
                    <h1>GRN</h1>
                    <p>Receive goods against purchases. Received quantities are added to inventory.</p>
                </div>

                <button className="btn-module-primary" onClick={() => setShowForm(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New GRN</span>
                </button>
            </div>

            <div className="module-toolbar">
                <div className="module-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        aria-label="Search GRNs"
                        placeholder="Search by GRN no, purchase no or supplier"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <label className="module-filter">
                    From
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </label>

                <label className="module-filter">
                    To
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </label>

                <span className="module-count">
                    {filteredGrns.length} {filteredGrns.length === 1 ? "GRN" : "GRNs"}
                </span>
            </div>

            <div className="module-table-container">
                <table className="module-table">
                    <thead>
                        <tr>
                            <th>GRN No</th>
                            <th>Date</th>
                            <th>Purchase No</th>
                            <th>Supplier</th>
                            <th className="num">Items</th>
                            <th className="num">Total Qty</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredGrns.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="module-empty">No GRNs found</td>
                            </tr>
                        ) : (
                            filteredGrns.map((grn) => (
                                <tr key={grn.id}>
                                    <td className="col-code">{grn.grnNo}</td>
                                    <td>{formatDate(grn.grnDate)}</td>
                                    <td className="col-code">{grn.purchaseNo}</td>
                                    <td className="strong">{grn.supplierName}</td>
                                    <td className="num">{grn.itemCount}</td>
                                    <td className="num strong">{grn.totalQuantity}</td>
                                    <td>{grn.remarks || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <GrnForm
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}

        </div>
    );
};

export default GRN;
