import { useState } from "react";

import { showErrorAlert } from "../../utils/sweetAlert";

const SupplierForm = ({ supplier, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: supplier?.name || "",
        contactPerson: supplier?.contactPerson || "",
        phone: supplier?.phone || "",
        email: supplier?.email || "",
        address: supplier?.address || ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim()) {
            showErrorAlert("Name and phone are required.");
            return;
        }

        onSubmit({
            name: formData.name.trim(),
            contactPerson: formData.contactPerson.trim() || null,
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            address: formData.address.trim() || null
        });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <form
                className="module-modal"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{supplier ? "Edit Supplier" : "Add Supplier"}</h2>

                <div className="module-field">
                    <label htmlFor="supplier-name">Name</label>
                    <input
                        id="supplier-name"
                        type="text"
                        name="name"
                        placeholder="Enter supplier name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="module-field">
                    <label htmlFor="supplier-contact">Contact Person</label>
                    <input
                        id="supplier-contact"
                        type="text"
                        name="contactPerson"
                        placeholder="Enter contact person"
                        value={formData.contactPerson}
                        onChange={handleChange}
                    />
                </div>

                <div className="module-field">
                    <label htmlFor="supplier-phone">Phone</label>
                    <input
                        id="supplier-phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="module-field">
                    <label htmlFor="supplier-email">Email</label>
                    <input
                        id="supplier-email"
                        type="email"
                        name="email"
                        placeholder="Enter email (optional)"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="module-field">
                    <label htmlFor="supplier-address">Address</label>
                    <textarea
                        id="supplier-address"
                        name="address"
                        placeholder="Enter address (optional)"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="module-form-actions">
                    <button type="button" className="btn-module-secondary" onClick={onCancel}>
                        Cancel
                    </button>

                    <button type="submit" className="btn-module-primary">
                        {supplier ? "Update" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupplierForm;
