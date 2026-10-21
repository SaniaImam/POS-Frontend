const API_URL = "https://localhost:7289/api/GRN";

export const getGrns = async () => {
    const response = await fetch(`${API_URL}/GetGRNs`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to get GRNs");
    }

    const data = await response.json();

    return data;
};

export const addGrn = async (grn) => {
    const response = await fetch(`${API_URL}/AddGRN`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(grn)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add GRN");
    }

    return data;
};
