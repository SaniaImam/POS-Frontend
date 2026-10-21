import { useState } from "react";

import SupplierModel from "../../models/SupplierModel.js";

import { showErrorAlert } from "../../utils/sweetAlert";

const SupplierForm = ({ supplier, onSubmit, onCancel }) => {
    // API returns null for empty optional fields; inputs need "" instead
    const [formData, setFormData] = useState(
        supplier
            ? new SupplierModel(
                supplier.id,
                supplier.supplierCode,
                supplier.name,
                supplier.contactPerson ?? "",
                supplier.phone,
                supplier.email ?? "",
                supplier.address ?? ""
            )
            : new SupplierModel()
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim()) {
            showErrorAlert("Name and Phone are required.");
            return;
        }

        onSubmit({
            name: formData.name,
            contactPerson: formData.contactPerson,
            phone: formData.phone,
            email: formData.email,
            address: formData.address
        });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <form
                className="supplier-form"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{supplier ? "Edit Supplier" : "Add Supplier"}</h2>

                <div className="supplier-form-field">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter supplier name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="supplier-form-field">
                    <label>Contact Person</label>
                    <input
                        type="text"
                        name="contactPerson"
                        placeholder="Enter contact person"
                        value={formData.contactPerson}
                        onChange={handleChange}
                    />
                </div>

                <div className="supplier-form-field">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="supplier-form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="supplier-form-field">
                    <label>Address</label>
                    <textarea
                        name="address"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="supplier-form-actions">
                    <button type="submit">
                        {supplier ? "Update" : "Save"}
                    </button>

                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupplierForm;
