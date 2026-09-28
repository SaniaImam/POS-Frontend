import { useState } from "react";
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

    const [name, setName] = useState(
        customer?.name || ""
    );

    const [phone, setPhone] = useState(
        customer?.phone || ""
    );

    const [email, setEmail] = useState(
        customer?.email || ""
    );


    const handleSubmit = async (e) => {

    e.preventDefault();

    const customerData = {
        name: name,
        phone: phone,
        email: email
    };

    try {

        if (customer) {

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
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />


            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) =>
                    setPhone(e.target.value)
                }
            />


            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
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