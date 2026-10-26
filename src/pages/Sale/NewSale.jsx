
import { useEffect, useMemo, useState } from "react";
import "../../styles/Sale.css";
import { getItems } from "../../services/ItemService";
import { addSale } from "../../services/SaleService";
import { showErrorAlert } from "../../utils/sweetAlert";
import Swal from "sweetalert2";


const NewSale = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [customerType, setCustomerType] = useState("walkin");
    const [customerId, setCustomerId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    useEffect(() => {
        const loadItems = async () => {
            try {
                const response = await getItems();
                setItems(Array.isArray(response) ? response : []);
            } catch (err) {
                console.error(err);
                setError("Unable to load items. Please check the backend.");
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return items;

        return items.filter((item) =>
            [item.itemName, item.itemCode, item.categoryName]
                .some((value) =>
                    String(value ?? "").toLowerCase().includes(term)
                )
        );
    }, [items, search]);

    const addToCart = (item) => {
        setCart((current) => {
            const existing = current.find(
                (row) => row.itemId === item.id
            );

            if (existing) {
                return current.map((row) =>
                    row.itemId === item.id
                        ? { ...row, quantity: row.quantity + 1 }
                        : row
                );
            }

            return [
                ...current,
                {
                    itemId: item.id,
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    price: Number(item.price),
                    quantity: 1,
                },
            ];
        });
    };

    const updateQuantity = (itemId, quantity) => {
        const parsedQuantity = Number(quantity);

        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            return;
        }

        setCart((current) =>
            current.map((row) =>
                row.itemId === itemId
                    ? { ...row, quantity: parsedQuantity }
                    : row
            )
        );
    };

    const removeFromCart = (itemId) => {
        setCart((current) =>
            current.filter((row) => row.itemId !== itemId)
        );
    };

    const subtotal = cart.reduce(
        (sum, row) => sum + row.price * row.quantity,
        0
    );

    const safeDiscount = Math.min(
        subtotal,
        Math.max(0, Number(discount) || 0)
    );

    const total = subtotal - safeDiscount;

    const formatPrice = (amount) =>
        `Rs. ${amount.toLocaleString("en-PK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const [submitting, setSubmitting] = useState(false);

const handleCheckout = async () => {
    if (cart.length === 0) {
        showErrorAlert("Please add at least one item to the cart.");
        return;
    }

    if (customerType === "existing" && !customerId) {
        showErrorAlert("Please enter a customer ID.");
        return;
    }

    const saleData = {
        customerId: customerType === "existing"
            ? Number(customerId)
            : null,
        discount: safeDiscount,
        paymentMethod,
        items: cart.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.price
        }))
    };

    try {
        setSubmitting(true);

        await addSale(saleData);

        await Swal.fire({
         icon: "success",
         title: "Sale Completed!",
         text: "The sale has been saved successfully.",
         confirmButtonText: "OK"
     });

        setCart([]);
        setDiscount(0);
        setCustomerId("");
        setCustomerType("walkin");
    } catch (error) {
        console.error("Sale error:", error);
        showErrorAlert(error.message || "Unable to complete sale.");
    } finally {
        setSubmitting(false);
    }
};

    return (
        <div className="new-sale-page">
            <div className="new-sale-header">
                <div>
                    <h1>New Sale</h1>
                    <p>Create a sales transaction</p>
                </div>

                <button
                    className="sale-clear-btn"
                    onClick={() => {
                        setCart([]);
                        setDiscount(0);
                    }}
                >
                    Clear Sale
                </button>
            </div>

            <div className="new-sale-layout">
                <section className="sale-products-panel">
                    <div className="sale-section-heading">
                        <h2>Products</h2>
                        <span>{filteredItems.length} items</span>
                    </div>

                    <input
                        className="sale-search-input"
                        type="text"
                        placeholder="Search by name, code or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {loading ? (
                        <p className="sale-message">Loading items...</p>
                    ) : error ? (
                        <p className="sale-error">{error}</p>
                    ) : filteredItems.length === 0 ? (
                        <p className="sale-message">No items found.</p>
                    ) : (
                        <div className="sale-product-list">
                            {filteredItems.map((item) => (
                                <button
                                    key={item.id}
                                    className="sale-product-card"
                                    onClick={() => addToCart(item)}
                                >
                                    <span className="sale-product-code">
                                        {item.itemCode}
                                    </span>

                                    <strong>{item.itemName}</strong>

                                    <span className="sale-product-category">
                                        {item.categoryName || "Uncategorized"}
                                    </span>

                                    <span className="sale-product-price">
                                        {formatPrice(Number(item.price) || 0)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                <section className="sale-cart-panel">
                    <div className="sale-section-heading">
                        <h2>Current Sale</h2>
                        <span>
                            {cart.reduce(
                                (sum, row) => sum + row.quantity,
                                0
                            )}{" "}
                            units
                        </span>
                    </div>

                    <div className="sale-customer-fields">
                        <label>
                            Customer Type
                            <select
                                value={customerType}
                                onChange={(e) => {
                                    setCustomerType(e.target.value);
                                    setCustomerId("");
                                }}
                            >
                                <option value="walkin">Walk-in Customer</option>
                                <option value="existing">Existing Customer</option>
                                <option value="new">New Customer</option>
                            </select>
                        </label>

                        {customerType === "existing" && (
                            <label>
                                Customer ID
                                <input
                                    type="number"
                                    min="1"
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(e.target.value)
                                    }
                                    placeholder="Enter customer ID"
                                />
                            </label>
                        )}

                        {customerType === "new" && (
                            <>
                                <label>
                                    Customer Name
                                    <input
                                        type="text"
                                        placeholder="Enter customer name"
                                    />
                                </label>

                                <label>
                                    Mobile Number
                                    <input
                                        type="tel"
                                        placeholder="Enter mobile number"
                                    />
                                </label>
                            </>
                        )}
                    </div>

                    <div className="sale-cart-table-wrapper">
                        <table className="sale-cart-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {cart.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="sale-empty-cart"
                                        >
                                            Add products to start a sale
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((row) => (
                                        <tr key={row.itemId}>
                                            <td>
                                                <strong>{row.itemName}</strong>
                                                <small>{row.itemCode}</small>
                                            </td>

                                            <td>
                                                <input
                                                    className="sale-quantity-input"
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={row.quantity}
                                                    onChange={(e) =>
                                                        updateQuantity(
                                                            row.itemId,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td>{formatPrice(row.price)}</td>

                                            <td>
                                                {formatPrice(
                                                    row.price * row.quantity
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    className="sale-remove-btn"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            row.itemId
                                                        )
                                                    }
                                                    aria-label={`Remove ${row.itemName}`}
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="sale-payment-fields">
                        <label>
                            Payment Method
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                            >
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>
                            </select>
                        </label>

                        <label>
                            Discount (Rs.)
                            <input
                                type="number"
                                min="0"
                                max={subtotal}
                                value={discount}
                                onChange={(e) =>
                                    setDiscount(e.target.value)
                                }
                            />
                        </label>
                    </div>

                    <div className="sale-summary">
                        <div>
                            <span>Subtotal</span>
                            <strong>{formatPrice(subtotal)}</strong>
                        </div>

                        <div>
                            <span>Discount</span>
                            <strong>- {formatPrice(safeDiscount)}</strong>
                        </div>

                        <div className="sale-grand-total">
                            <span>Grand Total</span>
                            <strong>{formatPrice(total)}</strong>
                        </div>
                    </div>

                   <button
                        className="sale-checkout-btn"
                        onClick={handleCheckout}
                        disabled={submitting}
                    >
                      {submitting ? "Processing..." : "Complete Sale"}
                   </button>
                </section>
            </div>
        </div>
    );
};

export default NewSale;
