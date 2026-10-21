const API_URL = "https://localhost:7289/api/Inventory";

export const getInventory = async () => {
    const response = await fetch(`${API_URL}/GetInventory`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to get inventory");
    }

    const data = await response.json();

    return data;
};
