const ItemTable = ({ items, onEdit, onDelete }) => {
    return (
        <div className="items-table-container">
            <table className="items-table">
                <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "48px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                                No items found
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.itemCode}</td>
                                <td>{item.itemName}</td>
                                <td>{item.categoryName}</td>
                                <td>{item.price}</td>

                                <td>
                                    <div className="item-actions">
                                        <button onClick={() => onEdit(item)}>
                                            Edit
                                        </button>

                                        <button onClick={() => onDelete(item.id)}>
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

export default ItemTable;