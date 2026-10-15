const STATUS_TONES = {
    pending: "warning",
    partial: "info",
    received: "success",
    completed: "success",
    paid: "success",
    "in stock": "success",
    "low stock": "warning",
    "out of stock": "danger",
    cancelled: "danger"
};

const StatusBadge = ({ status }) => {
    const tone = STATUS_TONES[String(status ?? "").toLowerCase()] || "info";

    return <span className={`badge ${tone}`}>{status || "-"}</span>;
};

export default StatusBadge;
