import { useEffect, useState } from "react";
import { getCategories } from "../../services/CategoryService";

const ItemForm = ({ item, onSubmit, onCancel }) => {
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        itemName: item?.itemName || "",
        categoryId: item?.categoryId || "",
        price: item?.price || ""
    });

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            itemName: formData.itemName,
            categoryId: Number(formData.categoryId),
            price: Number(formData.price)
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{item ? "Edit Item" : "Add Item"}</h2>

            <input
                type="text"
                name="itemName"
                placeholder="Item Name"
                value={formData.itemName}
                onChange={handleChange}
            />

            <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
            >
                <option value="">Select Category</option>

                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.categoryName}
                    </option>
                ))}
            </select>

            <input
                type="number"
                name="price"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
            />

            <button type="submit">
                {item ? "Update" : "Save"}
            </button>

            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

export default ItemForm;