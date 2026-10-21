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
