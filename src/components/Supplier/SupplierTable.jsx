import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
    return (
        <div className="module-table-container">
            <table className="module-table">
                <thead>
                    <tr>
                        <th>Supplier Code</th>
                        <th>Name</th>
                        <th>Contact Person</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th className="actions-col">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {suppliers.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="module-empty">
                                No suppliers found
                            </td>
                        </tr>
                    ) : (
                        suppliers.map((supplier) => (
                            <tr key={supplier.id}>
                                <td className="col-code">{supplier.supplierCode}</td>
                                <td className="strong">{supplier.name}</td>
                                <td>{supplier.contactPerson || "-"}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.email || "-"}</td>
                                <td>{supplier.address || "-"}</td>

                                <td>
                                    <div className="module-actions">
                                        <button
                                            className="edit"
                                            title="Edit"
                                            aria-label={`Edit ${supplier.name}`}
                                            onClick={() => onEdit(supplier)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>

                                        <button
                                            className="delete"
                                            title="Delete"
                                            aria-label={`Delete ${supplier.name}`}
                                            onClick={() => onDelete(supplier.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
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
