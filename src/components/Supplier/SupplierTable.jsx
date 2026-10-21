const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
    return (
        <div className="suppliers-table-container">
            <table className="suppliers-table">
                <thead>
                    <tr>
                        <th>Supplier Code</th>
                        <th>Name</th>
                        <th>Contact Person</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {suppliers.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                No suppliers found
                            </td>
                        </tr>
                    ) : (
                        suppliers.map((supplier) => (
                            <tr key={supplier.id}>
                                <td>{supplier.supplierCode}</td>
                                <td>{supplier.name}</td>
                                <td>{supplier.contactPerson || "-"}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.email || "-"}</td>
                                <td>{supplier.address || "-"}</td>

                                <td>
                                    <div className="supplier-actions">
                                        <button onClick={() => onEdit(supplier)}>
                                            Edit
                                        </button>

                                        <button onClick={() => onDelete(supplier.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierTable;
