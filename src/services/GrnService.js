const API_URL = "https://localhost:7289/api/GRN";


export async function getGrns() {

    const response = await fetch(
        `${API_URL}/GetGRNs`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get GRNs");
    }

    return await response.json();
}


// Posting a GRN receives stock against a purchase and increases inventory
export async function addGrn(grn) {

    const response = await fetch(
        `${API_URL}/AddGRN`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(grn)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to save GRN");
    }

    return data;
}
