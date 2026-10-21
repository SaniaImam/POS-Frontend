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
        <div className="modal-overlay" onClick={onCancel}>
            <form
                className="item-form"
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{item ? "Edit Item" : "Add Item"}</h2>

                <div className="item-form-field">
                    <label>Item Name</label>
                    <input
                        type="text"
                        name="itemName"
                        placeholder="Enter item name"
                        value={formData.itemName}
                        onChange={handleChange}
                    />
                </div>

           
                <div className="item-form-field">
                  <label>Category</label>

                <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                 >
                  <option value="">
                     Select Category
                  </option>

        {categories.map((category) => (
            <option
                key={category.id}
                value={category.id}
            >
                {category.categoryName}
            </option>
        ))}
    </select>
</div>



                <div className="item-form-field">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>

                <div className="item-form-actions">
                    <button type="submit">
                        {item ? "Update" : "Save"}
                    </button>

                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;