const Icon = ({ children, size = 18, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {children}
    </svg>
);

const IconEdit = (props) => (
    <Icon {...props}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </Icon>
);

const IconDelete = (props) => (
    <Icon {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
);

function CustomerTable({
    customers,
    onEdit,
    onDelete
}) {

    return (
        <div className="customer-table-container">

            <table className="customer-table">

                <thead>
                    <tr>
                        <th>Customer Code</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {customers.length === 0 ? (

                        <tr>
                            <td colSpan="5" className="empty-message">
                                No customers found
                            </td>
                        </tr>

                    ) : (

                        customers.map((customer) => (

                            <tr key={customer.id}>

                                <td>
                                    {customer.customerCode}
                                </td>

                                <td>
                                    {customer.name}
                                </td>

                                <td>
                                    {customer.phone}
                                </td>

                                <td>
                                    {customer.email || "-"}
                                </td>

                                <td>

                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => onEdit(customer)}
                                    >
                                        <IconEdit size={16} />
                                    </button>

                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => onDelete(customer.id)}
                                    >
                                        <IconDelete size={16} />
                                    </button>

                                </td>

                            </tr>

                        ))
                    )}

                </tbody>

            </table>

        </div>
    );
}

export default CustomerTable;