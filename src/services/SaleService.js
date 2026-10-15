const API_URL = "https://localhost:7289/api/Sale";


export async function getSales() {

    const response = await fetch(
        `${API_URL}/GetSales`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get sales");
    }

    return await response.json();
}


// Returns the sale header plus its line items
export async function getSaleById(id) {

    const response = await fetch(
        `${API_URL}/GetSaleById/${id}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get sale");
    }

    return await response.json();
}
