const API_URL = "https://localhost:7289/api/Item";

export const getItems = async () => {
    const response = await fetch(`${API_URL}/GetItems`, {
        method: "POST"
    });

    const data = await response.json();

    return data;
};