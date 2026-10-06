import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGauge,
    faUsers,
    faBox
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>POS</h2>
            </div>

            <nav className="sidebar-nav">

                <Link to="/dashboard" className="sidebar-item">
                    <FontAwesomeIcon icon={faGauge} />
                    <span>Dashboard</span>
                </Link>

                <Link to="/customers" className="sidebar-item">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                </Link>

                <Link to="/items" className="sidebar-item">
                    <FontAwesomeIcon icon={faBox} />
                    <span>Items</span>
                </Link>

            </nav>
        </aside>
    );
};

export default Sidebar;