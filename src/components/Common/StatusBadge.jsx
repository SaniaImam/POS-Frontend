import "../../styles/StatusBadge.css";

const STATUS_TONES = {
    pending: "warning",
    partial: "info",
    received: "success",
    "in stock": "success",
    "low stock": "warning",
    "out of stock": "danger"
};

const StatusBadge = ({ status }) => {
    const tone = STATUS_TONES[String(status ?? "").toLowerCase()] || "info";

    return (
        <span className={`status-badge ${tone}`}>
            {status || "-"}
        </span>
    );
};

export default StatusBadge;
