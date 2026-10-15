const API_URL = "https://localhost:7289/api/Inventory";


export async function getInventory() {

    const response = await fetch(
        `${API_URL}/GetInventory`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get inventory");
    }

    return await response.json();
}
