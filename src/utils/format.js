export const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

export const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "-";

// yyyy-MM-dd in local time, for <input type="date">
export const today = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
};

// Compares a record's date against optional yyyy-MM-dd from/to filters
export const isWithinDateRange = (value, from, to) => {
    const day = String(value ?? "").slice(0, 10);

    if (from && day < from) return false;
    if (to && day > to) return false;

    return true;
};
