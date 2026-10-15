const API_URL = "https://localhost:7289/api/Purchase";


export async function getPurchases() {

    const response = await fetch(
        `${API_URL}/GetPurchases`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get purchases");
    }

    return await response.json();
}


// Returns the purchase header plus its line items
export async function getPurchaseById(id) {

    const response = await fetch(
        `${API_URL}/GetPurchaseById/${id}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get purchase");
    }

    return await response.json();
}


export async function addPurchase(purchase) {

    const response = await fetch(
        `${API_URL}/AddPurchase`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(purchase)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to save purchase");
    }

    return data;
}
