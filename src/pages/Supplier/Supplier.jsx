import { useEffect, useState } from "react";

import "../../styles/Supplier.css";

import SupplierModel from "../../models/SupplierModel.js";

import SupplierTable from "../../components/Supplier/SupplierTable";
import SupplierForm from "../../components/Supplier/SupplierForm";

import {
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
} from "../../services/SupplierService";

import {
    showSuccessAlert,
    showErrorAlert,
    showConfirmAlert
} from "../../utils/sweetAlert";

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [search, setSearch] = useState("");

    const loadSuppliers = async () => {
        const data = await getSuppliers();
        setSuppliers(data.map((supplier) => Object.assign(new SupplierModel(), supplier)));
    };

    const filteredSuppliers = suppliers.filter((supplier) =>
        [supplier.supplierCode, supplier.name, supplier.contactPerson, supplier.phone, supplier.email].some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        )
    );

    useEffect(() => {
        loadSuppliers();
    }, []);

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

        await deleteSupplier(id);
        loadSuppliers();
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, formData);

                await showSuccessAlert("Supplier updated successfully.");
            } else {
                await addSupplier(formData);

                await showSuccessAlert("Supplier added successfully.");
            }

            setShowForm(false);
            setEditingSupplier(null);

            loadSuppliers();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="suppliers-page">

            <div className="suppliers-header">
                <h1>Suppliers</h1>

                <button onClick={handleAdd}>
                    New Supplier
                </button>
            </div>

            <div className="suppliers-toolbar">
                <div className="suppliers-search">
                    <input
                        type="text"
                        aria-label="Search suppliers"
                        placeholder="Search by code, name, phone or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
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
