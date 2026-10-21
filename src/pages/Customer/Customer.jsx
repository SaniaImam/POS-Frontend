import { useEffect, useState } from "react";

import "../../styles/Customer.css";

import CustomerTable from "../../components/Customer/CustomerTable";
import CustomerModal from "../../components/Customer/CustomerModal";

import {
    getCustomers,
    deleteCustomer
} from "../../services/CustomerService";

import { showConfirmAlert } from "../../utils/sweetAlert";

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

    const handleCustomerAdded = () => {
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

            <header className="page-header">
                <h1>Customers</h1>

                <button
                    className="btn-primary"
                    type="button"
                    onClick={handleAdd}
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>New Customer</span>
                </button>
            </header>

            <div className="toolbar">

                <div className="search-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        id="search"
                        className="search"
                        type="text"
                        aria-label="Search customers"
                        placeholder="Search by name, phone or email"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                <span className="count">
                    {filteredCustomers.length}{" "}
                    {filteredCustomers.length === 1
                        ? "customer"
                        : "customers"}
                </span>

            </div>

            <section className="card">

                <CustomerTable
                    customers={filteredCustomers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </section>

            {showForm && (
                <CustomerModal
                    customer={editingCustomer}
                    onCustomerAdded={handleCustomerAdded}
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

