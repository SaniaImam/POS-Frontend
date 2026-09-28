const API_URL = "https://localhost:7289/api/Customer";


export async function getCustomers() {

    const response = await fetch(
        `${API_URL}/GetCustomers`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get customers");
    }

    return await response.json();
}


export async function addCustomer(customer) {

    const response = await fetch(
        `${API_URL}/AddCustomer`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(customer)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}


export async function updateCustomer(id, customer) {

    const response = await fetch(
        `${API_URL}/UpdateCustomer/${id}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(customer)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update customer");
    }

    return await response.text();
}


export async function deleteCustomer(id) {

    const response = await fetch(
        `${API_URL}/DeleteCustomer/${id}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete customer");
    }

    return await response.text();
}