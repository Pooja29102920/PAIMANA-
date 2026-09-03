import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export const Loader = () => _jsx("div", { className: "loading", children: "Loading\u2026" });
export const ErrorBox = ({ msg }) => _jsxs("div", { className: "error", children: ["\u26A0 ", msg] });
export const Insufficient = ({ children }) => (_jsxs("div", { className: "insufficient", children: ["Insufficient data available for this analysis.", children ? _jsx("div", { style: { marginTop: 6 }, children: children }) : null] }));
export const Badge = ({ level }) => _jsx("span", { className: `badge ${level}`, children: level });
export const SevBadge = ({ severity }) => _jsx("span", { className: `badge sev-${severity}`, children: severity });
export function useProjectLink() {
    const nav = useNavigate();
    return (code) => nav(`/projects/${code}`);
}
export const RiskBar = ({ components }) => {
    const colors = {
        cost_risk: 'var(--critical)', schedule_risk: 'var(--high)',
        expenditure_risk: 'var(--moderate)', reporting_risk: '#8da2bd',
    };
    const labels = {
        cost_risk: 'Cost risk', schedule_risk: 'Schedule risk',
        expenditure_risk: 'Expenditure risk', reporting_risk: 'Reporting/data risk',
    };
    return _jsx("div", { children: Object.entries(components || {}).map(([k, v]) => (_jsxs("div", { className: "component", children: [_jsxs("div", { className: "row", children: [_jsx("span", { children: labels[k] || k }), _jsx("span", { children: v?.toFixed?.(1) })] }), _jsx("div", { className: "bar", children: _jsx("div", { style: {
                            width: `${Math.min(100, Math.max(0, v))}%`, background: colors[k] || '#999',
                        } }) })] }, k))) });
};
export const fmtMoney = (v) => {
    if (v == null || Number.isNaN(v))
        return '—';
    if (v >= 100000)
        return `₹${(v / 100000).toFixed(2)} L Cr`;
    return `₹${Math.round(v).toLocaleString('en-IN')} Cr`;
};
