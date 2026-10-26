const API_URL = "https://localhost:7289/api/Sale";

export const getSales = async () => {
    const response = await fetch(`${API_URL}/GetSales`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to get sales");
    }

    const data = await response.json();

    return data;
};

export const getSaleById = async (id) => {
    const response = await fetch(`${API_URL}/GetSaleById/${id}`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to get sale");
    }

    const data = await response.json();

    return data;
};

export const addSale = async (saleData) => {
    const response = await fetch(`${API_URL}/AddSale`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(saleData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to complete sale");
    }

    return data;
};
