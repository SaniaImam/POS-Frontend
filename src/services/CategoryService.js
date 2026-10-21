const API_URL = "https://localhost:7289/api/Category";

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/GetCategories`, {
        method: "POST"
    });

    const data = await response.json();

    return data;
};