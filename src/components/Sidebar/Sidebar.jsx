import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGauge,
    faUsers,
    faBox,
    faTruck,
    faCartShopping,
    faChevronDown,
    faClipboardCheck,
    faWarehouse,
    faReceipt
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/Sidebar.css";

const navClass = ({ isActive }) =>
    isActive ? "sidebar-item active" : "sidebar-item";

const subNavClass = ({ isActive }) =>
    isActive ? "sidebar-subitem active" : "sidebar-subitem";

const Sidebar = () => {
    const location = useLocation();

    const isPurchaseRoute = location.pathname.startsWith("/purchases");

    const [purchaseOpen, setPurchaseOpen] = useState(isPurchaseRoute);

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>POS</h2>
            </div>

            <nav className="sidebar-nav">

                <NavLink to="/dashboard" className={navClass}>
                    <FontAwesomeIcon icon={faGauge} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/customers" className={navClass}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                </NavLink>

                <NavLink to="/items" className={navClass}>
                    <FontAwesomeIcon icon={faBox} />
                    <span>Items</span>
                </NavLink>

                <NavLink to="/suppliers" className={navClass}>
                    <FontAwesomeIcon icon={faTruck} />
                    <span>Suppliers</span>
                </NavLink>

                <button
                    type="button"
                    className={`sidebar-item sidebar-group-toggle${isPurchaseRoute ? " group-active" : ""}`}
                    aria-expanded={purchaseOpen || isPurchaseRoute}
                    onClick={() => setPurchaseOpen(!purchaseOpen)}
                >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Purchase</span>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`sidebar-chevron${purchaseOpen || isPurchaseRoute ? " open" : ""}`}
                    />
                </button>

                {(purchaseOpen || isPurchaseRoute) && (
                    <div className="sidebar-submenu">
                        <NavLink to="/purchases/new" className={subNavClass}>
                            New Purchase
                        </NavLink>

                        <NavLink to="/purchases" end className={subNavClass}>
                            Purchase List
                        </NavLink>
                    </div>
                )}

                <NavLink to="/grn" className={navClass}>
                    <FontAwesomeIcon icon={faClipboardCheck} />
                    <span>GRN</span>
                </NavLink>

                <NavLink to="/inventory" className={navClass}>
                    <FontAwesomeIcon icon={faWarehouse} />
                    <span>Inventory</span>
                </NavLink>

                <NavLink to="/sales" className={navClass}>
                    <FontAwesomeIcon icon={faReceipt} />
                    <span>Sale Record</span>
                </NavLink>

            </nav>
        </aside>
    );
};

export default Sidebar;
