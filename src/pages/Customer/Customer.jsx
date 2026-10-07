import { useEffect, useState } from "react";

import "../../styles/Customer.css";

import CustomerTable from "../../components/Customer/CustomerTable";
import CustomerModal from "../../components/Customer/CustomerModal";

import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from "../../services/CustomerService";

import {
    showSuccessAlert,
    showErrorAlert,
    showConfirmAlert
} from "../../utils/sweetAlert";

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const loadCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleAdd = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
    const result = await showConfirmAlert(
        "Are you sure you want to delete this customer?"
    );

    if (!result.isConfirmed) {
        return;
    }

    await deleteCustomer(id);
    loadCustomers();
};

    const handleSubmit = () => {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
};

    const filteredCustomers = customers.filter((customer) => {
        const term = searchTerm.toLowerCase();

        return (
            customer.customerCode?.toLowerCase().includes(term) ||
            customer.name?.toLowerCase().includes(term) ||
            customer.phone?.toLowerCase().includes(term) ||
            customer.email?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="customer-content">

            <div className="customer-toolbar">
                <div className="toolbar-left">
                    <h1>Customers</h1>
                </div>

                <div className="toolbar-right">
                    <button
                        className="new-button"
                        onClick={handleAdd}
                    >
                        + New Customer
                    </button>
                </div>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="customer-list">
                <CustomerTable
                    customers={filteredCustomers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {showForm && (
               <CustomerModal
               customer={editingCustomer}
               onCustomerAdded={handleSubmit}
               onClose={() => {
               setShowForm(false);
              setEditingCustomer(null);
                }}
              />
             )}

        </div>
    );
};

export default Customer;
