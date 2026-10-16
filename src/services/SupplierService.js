
const API_URL = "https://localhost:7289/api/Supplier";

const handleResponse = async (response) => {
    const text = await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        const message =
            typeof data === "string"
                ? data
                : data?.message ||
                  data?.title ||
                  `Request failed (${response.status})`;

        throw new Error(message);
    }

    return data;
};

// Get all suppliers
export const getSuppliers = async () => {
    const response = await fetch(`${API_URL}/GetSuppliers`, {
        method: "POST"
    });

    return handleResponse(response);
};

// Add a supplier
export const addSupplier = async (supplier) => {
    const response = await fetch(`${API_URL}/AddSupplier`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(supplier)
    });

    return handleResponse(response);
};

// Update a supplier
export const updateSupplier = async (id, supplier) => {
    const response = await fetch(`${API_URL}/UpdateSupplier/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(supplier)
    });

    return handleResponse(response);
};

// Delete a supplier
export const deleteSupplier = async (id) => {
    const response = await fetch(`${API_URL}/DeleteSupplier/${id}`, {
        method: "POST"
    });

    return handleResponse(response);
};
