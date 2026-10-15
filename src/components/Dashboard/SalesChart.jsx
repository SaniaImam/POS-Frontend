import { useState } from "react";

import { formatCurrency } from "../../utils/format";

// Column chart of revenue per day. days = [{ key, label, total, count }]
const SalesChart = ({ days }) => {
    const [hovered, setHovered] = useState(null);

    const max = Math.max(...days.map((day) => day.total), 0);

    // Round the axis top up to a clean number so gridlines land on even values
    const magnitude = max > 0 ? 10 ** Math.floor(Math.log10(max)) : 1;
    const axisMax = max > 0 ? Math.ceil(max / magnitude) * magnitude : 1;

    const gridValues = [axisMax, axisMax / 2, 0];

    // Label only the best day and today, everything else lives in the tooltip
    const peakKey = max > 0 ? days.reduce((best, day) => (day.total > best.total ? day : best)).key : null;
    const todayKey = days[days.length - 1]?.key;

    return (
        <div
            className="sales-chart"
            role="img"
            aria-label={`Revenue for the last ${days.length} days: ${days.map((day) => `${day.label} ${formatCurrency(day.total)}`).join(", ")}`}
        >
            <div className="sales-chart-axis" aria-hidden="true">
                {gridValues.map((value) => (
                    <span key={value}>{formatCurrency(value).replace(/\.00$/, "")}</span>
                ))}
            </div>

            <div className="sales-chart-plot">
                <div className="sales-chart-grid" aria-hidden="true">
                    {gridValues.map((value) => <span key={value} />)}
                </div>

                <div className="sales-chart-columns">
                    {days.map((day) => {
                        const height = (day.total / axisMax) * 100;
                        const showLabel = day.total > 0 && (day.key === peakKey || day.key === todayKey);

                        return (
                            <div
                                key={day.key}
                                className={`sales-chart-slot${hovered === day.key ? " hovered" : ""}`}
                                onMouseEnter={() => setHovered(day.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div className="sales-chart-bar-area">
                                    {showLabel && (
                                        <span className="sales-chart-value" style={{ bottom: `calc(${height}% + 6px)` }}>
                                            {formatCurrency(day.total).replace(/\.00$/, "")}
                                        </span>
                                    )}

                                    <div className="sales-chart-bar" style={{ height: `${height}%` }} />

                                    {hovered === day.key && (
                                        <div className="sales-chart-tooltip" style={{ bottom: `calc(${height}% + 30px)` }}>
                                            <strong>{day.fullLabel}</strong>
                                            <span>Revenue <b>{formatCurrency(day.total)}</b></span>
                                            <span>Sales <b>{day.count}</b></span>
                                        </div>
                                    )}
                                </div>

                                <span className={`sales-chart-label${day.key === todayKey ? " today" : ""}`}>
                                    {day.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
