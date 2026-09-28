import { useEffect, useState } from "react";
import CustomerTable from "../../components/Customer/CustomerTable";
import CustomerModal from "../../modals/CustomerModal";
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

/**
 * Lightweight inline SVG icon set — no external icon package required.
 * Each icon is a small stroke-based SVG (24x24 viewBox), sized via CSS
 * (inherits font-size/color through currentColor).
 */
const Icon = ({ children, size = 18, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {children}
    </svg>
);

const IconDashboard = (props) => (
    <Icon {...props}>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
    </Icon>
);

const IconCustomers = (props) => (
    <Icon {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
);

const IconItems = (props) => (
    <Icon {...props}>
        <path d="M21 8 12 3 3 8l9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
    </Icon>
);

const IconPurchase = (props) => (
    <Icon {...props}>
        <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L22 7H6" />
        <circle cx="10" cy="21" r="1.5" />
        <circle cx="18" cy="21" r="1.5" />
    </Icon>
);

const IconSale = (props) => (
    <Icon {...props}>
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
        <circle cx="17" cy="15" r="1.5" />
    </Icon>
);

const IconInventory = (props) => (
    <Icon {...props}>
        <path d="M3 7 12 2l9 5v10l-9 5-9-5Z" />
        <path d="M3 7l9 5 9-5" />
        <path d="M12 12v10" />
    </Icon>
);

const IconUtilities = (props) => (
    <Icon {...props}>
        <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3Z" />
    </Icon>
);

const IconSecurity = (props) => (
    <Icon {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </Icon>
);

const IconHelp = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
        <line x1="12" y1="17" x2="12" y2="17" />
    </Icon>
);

const IconMenuBars = (props) => (
    <Icon {...props}>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </Icon>
);

const IconGrid = (props) => (
    <Icon {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
);

const IconList = (props) => (
    <Icon {...props}>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </Icon>
);

const IconSettings = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </Icon>
);

const IconRefresh = (props) => (
    <Icon {...props}>
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
    </Icon>
);

const IconBookmark = (props) => (
    <Icon {...props}>
        <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
    </Icon>
);

const IconProfile = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </Icon>
);

const IconPlus = (props) => (
    <Icon {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
);

const IconSearch = (props) => (
    <Icon {...props}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
);

const IconClose = (props) => (
    <Icon {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
);

const IconEdit = (props) => (
    <Icon {...props}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </Icon>
);

const IconDelete = (props) => (
    <Icon {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
);

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
                        <IconDashboard />
                        Dashboard
                    </div>

                    <div className="menu-item active">
                        <IconCustomers />
                        Customers
                    </div>

                    <div className="menu-item">
                        <IconItems />
                        Items
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <IconPurchase />
                        Purchase
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <IconSale />
                        Sale
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <IconInventory />
                        Inventory
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <IconUtilities />
                        Utilities
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <IconSecurity />
                        Security
                        <b>›</b>
                    </div>

                    <div className="menu-item">
                        <IconHelp />
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
                            <IconMenuBars />
                        </button>
                        
                        <span className="page-title">
                            Customers
                        </span>

                    </div>

                    <div className="top-icons">
                        <IconGrid title="Grid view" />
                        <IconList title="List view" />
                        <IconSettings title="Settings" />
                        <IconRefresh title="Refresh" />
                        <IconBookmark title="Bookmarks" />
                        <IconProfile title="Profile" />
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
            <IconPlus />
            New
        </button>

    </div>

</div>


                    {/* SEARCH */}

                    <div className="search-bar">

                        <IconSearch className="search-icon" />

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
                                <IconClose />
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