
const API_URL = "https://localhost:7289/api/Purchase";

export const getPurchases = async () => {
    const response = await fetch(`${API_URL}/GetPurchases`, {
        method: "POST"
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("GetPurchases error:", text);
        throw new Error("Failed to get purchases");
    }

    return await response.json();
};

export const getPurchaseById = async (id) => {
    const response = await fetch(`${API_URL}/GetPurchaseById/${id}`, {
        method: "POST"
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("GetPurchaseById error:", text);
        throw new Error("Failed to get purchase");
    }

    return await response.json();
};

export const addPurchase = async (purchase) => {
    const response = await fetch(`${API_URL}/AddPurchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(purchase)
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("AddPurchase error:", text);

        let message = "Failed to add purchase";

        try {
            const data = JSON.parse(text);
            message = data.message || message;
        } catch {
            message = text || message;
        }

        throw new Error(message);
    }

    return await response.json();
};
