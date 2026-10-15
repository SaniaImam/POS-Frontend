import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../../styles/Supplier.css";

import SupplierTable from "../../components/Supplier/SupplierTable";
import SupplierForm from "../../components/Supplier/SupplierForm";

import {
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
} from "../../services/SupplierService";

import {
    showConfirmAlert,
    showErrorAlert,
    showSuccessAlert
} from "../../utils/sweetAlert";

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    // Bumping reloadKey re-runs the load effect
    const [reloadKey, setReloadKey] = useState(0);

    const loadSuppliers = () => setReloadKey((key) => key + 1);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getSuppliers();
                setSuppliers(data);
            } catch (error) {
                showErrorAlert(error.message);
            }
        };

        loadData();
    }, [reloadKey]);

    const handleAdd = () => {
        setEditingSupplier(null);
        setShowForm(true);
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await showConfirmAlert(
            "Are you sure you want to delete this supplier?"
        );

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteSupplier(id);
            loadSuppliers();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, formData);
                showSuccessAlert("Supplier updated successfully.");
            } else {
                const data = await addSupplier(formData);
                showSuccessAlert(`Supplier ${data.supplierCode ?? ""} added successfully.`);
            }

            setShowForm(false);
            setEditingSupplier(null);

            loadSuppliers();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const term = search.trim().toLowerCase();

    const filteredSuppliers = suppliers.filter((supplier) =>
        [supplier.supplierCode, supplier.name, supplier.contactPerson, supplier.phone, supplier.email]
            .some((value) => String(value ?? "").toLowerCase().includes(term))
    );

    return (
        <div className="module-page">

            <div className="module-header">
                <h1>Suppliers</h1>

                <button className="btn-module-primary" onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Supplier</span>
                </button>
            </div>

            <div className="module-toolbar">
                <div className="module-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        aria-label="Search suppliers"
                        placeholder="Search by code, name, phone or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <span className="module-count">
                    {filteredSuppliers.length}{" "}
                    {filteredSuppliers.length === 1 ? "supplier" : "suppliers"}
                </span>
            </div>

            <SupplierTable
                suppliers={filteredSuppliers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {showForm && (
                <SupplierForm
                    supplier={editingSupplier}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingSupplier(null);
                    }}
                />
            )}

        </div>
    );
};

export default Supplier;
