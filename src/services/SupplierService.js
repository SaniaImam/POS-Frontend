const API_URL = "https://localhost:7289/api/Supplier";


export async function getSuppliers() {

    const response = await fetch(
        `${API_URL}/GetSuppliers`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get suppliers");
    }

    return await response.json();
}


export async function addSupplier(supplier) {

    const response = await fetch(
        `${API_URL}/AddSupplier`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(supplier)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add supplier");
    }

    return data;
}


export async function updateSupplier(id, supplier) {

    const response = await fetch(
        `${API_URL}/UpdateSupplier/${id}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(supplier)
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.message || "Failed to update supplier"
        );
    }

    return await response.text();
}


export async function deleteSupplier(id) {

    const response = await fetch(
        `${API_URL}/DeleteSupplier/${id}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete supplier");
    }

    return await response.text();
}
