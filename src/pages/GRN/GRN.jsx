import { useEffect, useState } from "react";

import "../../styles/Grn.css";

import GrnModel from "../../models/GrnModel.js";

import GrnTable from "../../components/GRN/GrnTable";
import GrnForm from "../../components/GRN/GrnForm";

import {
    getGrns,
    addGrn
} from "../../services/GrnService";

import {
    showSuccessAlert,
    showErrorAlert
} from "../../utils/sweetAlert";

import { isWithinDateRange } from "../../utils/format";

const GRN = () => {
    const [grns, setGrns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const loadGrns = async () => {
        const data = await getGrns();
        setGrns(data.map((grn) => Object.assign(new GrnModel(), grn)));
    };

    const filteredGrns = grns.filter((grn) =>
        [grn.grnNo, grn.purchaseNo, grn.supplierName].some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        ) &&
        isWithinDateRange(grn.grnDate, fromDate, toDate)
    );

    useEffect(() => {
        loadGrns();
    }, []);

    const handleAdd = () => {
        setShowForm(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const data = await addGrn(formData);

            await showSuccessAlert(`GRN ${data.grnNo} added successfully. Inventory updated.`);

            setShowForm(false);

            loadGrns();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="grn-page">

            <div className="grn-header">
                <div>
                    <h1>GRN</h1>
                    <p>Receive goods against purchases. Received quantities are added to inventory.</p>
                </div>

                <button onClick={handleAdd}>
                    New GRN
                </button>
            </div>

            <div className="grn-toolbar">
                <div className="grn-search">
                    <input
                        type="text"
                        aria-label="Search GRNs"
                        placeholder="Search by GRN no, purchase no or supplier"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <label>
                    From
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </label>

                <label>
                    To
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </label>

                <span className="grn-count">
                    {filteredGrns.length} {filteredGrns.length === 1 ? "GRN" : "GRNs"}
                </span>
            </div>

            <GrnTable grns={filteredGrns} />

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
