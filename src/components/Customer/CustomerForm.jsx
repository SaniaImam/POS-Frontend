import { useState, useEffect } from "react";
import CustomerModel from "../../models/CustomerModel.js";
import {
    showSuccessAlert,
    showErrorAlert
} from "../../utils/sweetAlert";

import {
    addCustomer,
    updateCustomer
} from "../../services/CustomerService";

function CustomerForm({
    customer,
    onClose,
    onCustomerAdded
}) {
    
    const [formData, setFormData] = useState(
    customer || new CustomerModel()
);

useEffect(() => {
    if (customer) {
        setFormData(customer);
    } else {
        setFormData(new CustomerModel());
    }
}, [customer]);


    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
        showErrorAlert("Name and Phone are required.");
        return;
    }

    const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email
    };

    try {

        if (customer) //decides whether add or update, add in case of null, customer initially null
        {

            await updateCustomer(
                customer.id,
                customerData
            );

            await showSuccessAlert(
                "Customer updated successfully."
            );

        } else {

            await addCustomer(customerData);

            await showSuccessAlert(
                "Customer added successfully."
            );
        }

        onCustomerAdded();

    } catch (error) {

        showErrorAlert(error.message);

    }
};


    return (
        <form
            className="customer-form"
            onSubmit={handleSubmit}
        >

            <h2>
                {customer
                    ? "Edit Customer"
                    : "Add Customer"
                }
            </h2>


            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
              setFormData({
            ...formData,
            name: e.target.value
              })
              }
             />


            <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
              setFormData({
            ...formData,
            phone: e.target.value
              })
            }
            />


            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({
            ...formData,
            email: e.target.value
              })
                }
            />


            <button type="submit">

                {customer
                    ? "Update Customer"
                    : "Add Customer"
                }

            </button>


            <button
                type="button"
                onClick={onClose}
            >
                Cancel
            </button>

        </form>
    );
}

export default CustomerForm;