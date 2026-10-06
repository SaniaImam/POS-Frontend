const API_URL = "https://localhost:7289/api/Item";

export const getItems = async () => {
    const response = await fetch(`${API_URL}/GetItems`, {
        method: "POST"
    });

    const data = await response.json();

    return data;
};

export const addItem = async (item) => {
    const response = await fetch(`${API_URL}/AddItem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    const data = await response.json();

    return data;
};

export const updateItem = async (id, item) => {
    const response = await fetch(`${API_URL}/UpdateItem/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return response;
};

export const deleteItem = async (id) => {
    const response = await fetch(`${API_URL}/DeleteItem/${id}`, {
        method: "POST"
    });

    return response;
};