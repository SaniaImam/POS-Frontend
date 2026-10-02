import { useEffect, useState } from "react";
import CustomerTable from "../../components/Customer/CustomerTable";
import CustomerModal from "../../components/Customer/CustomerModal";

import {
    getCustomers,
    deleteCustomer
} from "../../services/CustomerService";

import "../../styles/Customer/Customer.css";

import {
    showConfirmAlert,
    showSuccessAlert,
    showErrorAlert
} from "../../utils/sweetAlert";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faGauge,
    faUsers,
    faBox,
    faCartShopping,
    faCashRegister,
    faBoxesStacked,
    faScrewdriverWrench,
    faShieldHalved,
    faCircleQuestion,
    faBars,
    faTableCells,
    faList,
    faGear,
    faRotate,
    faBookmark,
    faUser,
    faPlus,
    faMagnifyingGlass,
    faXmark
} from "@fortawesome/free-solid-svg-icons";


function Customer() {

    const [showForm, setShowForm] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error(error);
        }
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

    const handleCustomerAdded = () => {
        setShowForm(false);
        setEditingCustomer(null);
        loadCustomers();
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleDelete = async (id) => {

        const result = await showConfirmAlert(
            "Do you want to delete this customer?"
        );

        if (!result.isConfirmed) {
            return;
        }

        try {

            await deleteCustomer(id);

            await showSuccessAlert(
                "Customer deleted successfully."
            );

            loadCustomers();

        } catch (error) {

            showErrorAlert(error.message);

        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCustomer(null);
    };

    return (
        <div className="customer-layout">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <span className="logo-main">POS</span>
                    <span className="logo-sub">SYSTEM</span>
                </div>

                <nav className="sidebar-menu">

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faGauge} />
                        Dashboard
                    </div>

                    <div className="menu-item active">
                        <FontAwesomeIcon icon={faUsers} />
                        Customers
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faBox} />
                        Items
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faCartShopping} />
                        Purchase
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faCashRegister} />
                        Sale
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faBoxesStacked} />
                        Inventory
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faScrewdriverWrench} />
                        Utilities
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faShieldHalved} />
                        Security
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <FontAwesomeIcon icon={faCircleQuestion} />
                        Help
                        <b>›</b>
                    </div>

                </nav>

                <div className="sidebar-footer">
                    <span>Version: 1.0.0</span>
                    <small>Updated: 22 Sep, 2026</small>
                </div>

            </aside>


            {/* MAIN AREA */}

            <main className="main-content">

                {/* TOP BAR */}

                <header className="top-bar">

                    <div className="top-left">

                        <button className="menu-button">
                            <FontAwesomeIcon icon={faBars} />
                        </button>

                        <span className="page-title">
                            Customers
                        </span>

                    </div>

                    <div className="top-icons">

                        <FontAwesomeIcon
                            icon={faTableCells}
                            title="Grid view"
                        />

                        <FontAwesomeIcon
                            icon={faList}
                            title="List view"
                        />

                        <FontAwesomeIcon
                            icon={faGear}
                            title="Settings"
                        />

                        <FontAwesomeIcon
                            icon={faRotate}
                            title="Refresh"
                        />

                        <FontAwesomeIcon
                            icon={faBookmark}
                            title="Bookmarks"
                        />

                        <FontAwesomeIcon
                            icon={faUser}
                            title="Profile"
                        />

                    </div>

                </header>


                {/* PAGE CONTENT */}

                <section className="customer-content">

                    {/* TABS */}

                    <div className="customer-tabs">

                        <button className="tab active">
                            Records
                        </button>

                    </div>


                    {/* TOOLBAR */}

                    <div className="customer-toolbar">

                        <div className="toolbar-left">

                            <button
                                className="new-button"
                                onClick={() => {
                                    setEditingCustomer(null);
                                    setShowForm(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                New
                            </button>

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div className="search-bar">

                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="search-icon"
                        />

                        <input
                            type="text"
                            placeholder="Search by name, phone or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {searchTerm && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchTerm("")}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}

                    </div>


                    {/* FORM */}

                    {showForm && (
                        <CustomerModal
                            customer={editingCustomer}
                            onClose={handleCloseForm}
                            onCustomerAdded={handleCustomerAdded}
                        />
                    )}


                    {/* CUSTOMER LIST */}

                    <div className="customer-list">

                        <div className="customer-list-title">

                            <strong>
                                Customers List
                            </strong>

                        </div>

                        <CustomerTable
                            customers={filteredCustomers}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Customer;