import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGauge,
    faUsers,
    faBox
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>POS</h2>
            </div>

            <nav className="sidebar-nav">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "sidebar-item active" : "sidebar-item"
                    }
                >
                    <FontAwesomeIcon icon={faGauge} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                        isActive ? "sidebar-item active" : "sidebar-item"
                    }
                >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                </NavLink>

                <NavLink
                    to="/items"
                    className={({ isActive }) =>
                        isActive ? "sidebar-item active" : "sidebar-item"
                    }
                >
                    <FontAwesomeIcon icon={faBox} />
                    <span>Items</span>
                </NavLink>

            </nav>
        </aside>
    );
};

export default Sidebar;