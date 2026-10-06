import { useEffect, useState } from "react";

import CustomerTable from "../../components/Customer/CustomerTable";
import CustomerModal from "../../components/Customer/CustomerModal";git status

import {
    getCustomers,
    deleteCustomer
} from "../../services/CustomerService";

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
        await deleteCustomer(id);
        loadCustomers();
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.customerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="customer-page">

            <div className="customer-header">
                <h1>Customers</h1>

                <button onClick={handleAdd}>
                    New Customer
                </button>
            </div>

            <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <CustomerTable
                customers={filteredCustomers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {showForm && (
                <CustomerModal
                    customer={editingCustomer}
                    onClose={() => {
                        setShowForm(false);
                        setEditingCustomer(null);
                    }}
                    onCustomerAdded={() => {
                        setShowForm(false);
                        setEditingCustomer(null);
                        loadCustomers();
                    }}
                />
            )}

        </div>
    );
};

export default Customer;