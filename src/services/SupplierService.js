const API_URL = "https://localhost:7289/api/Supplier";

export const getSuppliers = async () => {
    const response = await fetch(`${API_URL}/GetSuppliers`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to get suppliers");
    }

    const data = await response.json();

    return data;
};


export const addSupplier = async (supplier) => {
    const response = await fetch(`${API_URL}/AddSupplier`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(supplier)
    });

    const text = await response.text();
    console.log("Supplier API response:", text);

    if (!response.ok) {
        throw new Error(text);
    }

    return text ? JSON.parse(text) : null;
};


export const updateSupplier = async (id, supplier) => {
    const response = await fetch(`${API_URL}/UpdateSupplier/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(supplier)
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to update supplier");
    }

    return await response.text();
};

export const deleteSupplier = async (id) => {
    const response = await fetch(`${API_URL}/DeleteSupplier/${id}`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to delete supplier");
    }

    return await response.text();
};
