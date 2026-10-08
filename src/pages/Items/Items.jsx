import { useEffect, useState } from "react";

import "../../styles/Items.css";

import ItemTable from "../../components/Items/ItemTable";
import ItemForm from "../../components/Items/ItemForm";

import {
    getItems,
    addItem,
    updateItem,
    deleteItem
} from "../../services/ItemService";

const Items = () => {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [search, setSearch] = useState("");

    const loadItems = async () => {
        const data = await getItems();
        setItems(data);
    };

    const filteredItems = items.filter((item) =>
    [item.itemCode, item.itemName, item.categoryName].some((value) =>
        String(value ?? "")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    )
);

    useEffect(() => {
        loadItems();
    }, []);

    const handleAdd = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        await deleteItem(id);
        loadItems();
    };

    const handleSubmit = async (formData) => {
        if (editingItem) {
            await updateItem(editingItem.id, formData);
        } else {
            await addItem(formData);
        }

        setShowForm(false);
        setEditingItem(null);

        loadItems();
    };
    

    return (
        <div className="items-page">

            <div className="items-header">
                <h1>Items</h1>

                <button onClick={handleAdd}>
                    New Item
                </button>
            </div>

            <div className="items-search">
                <input
                    type="text"
                    aria-label="Search items"
                    placeholder="Search by name, code or category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <ItemTable
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {showForm && (
                <ItemForm
                    item={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingItem(null);
                    }}
                />
            )}

        </div>
    );
};

export default Items;
