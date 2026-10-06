const ItemTable = ({ items, onEdit, onDelete }) => {
    return (
        <table>
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
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.categoryName}</td>
                        <td>{item.price}</td>

                        <td>
                            <button onClick={() => onEdit(item)}>
                                Edit
                            </button>

                            <button onClick={() => onDelete(item.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ItemTable;