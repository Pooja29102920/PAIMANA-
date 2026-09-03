import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Badge, Loader, fmtMoney } from '../components/ui';
export default function Projects() {
    const nav = useNavigate();
    const [data, setData] = useState(null);
    const [err, setErr] = useState('');
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('');
    const [level, setLevel] = useState('');
    const [sort, setSort] = useState('risk');
    const [page, setPage] = useState(1);
    const [opts, setOpts] = useState({ sectors: [] });
    const [event, setEvent] = useState('ongoing');
    useEffect(() => {
        api('/api/projects?size=1').then((r) => {
            const s = new Set();
            r.items.forEach((i) => s.add(i.sector));
            // fetch all sectors from a large page
            api('/api/projects?size=1000&sort=name').then((r2) => {
                r2.items.forEach((i) => s.add(i.sector));
                setOpts({ sectors: Array.from(s).filter(Boolean).sort() });
            });
        }).catch(() => { });
    }, []);
    useEffect(() => {
        setData(null);
        const q = new URLSearchParams({
            search, sector, level, sort, event,
            page: String(page), size: '25',
        });
        api(`/api/projects?${q}`).then(setData).catch(e => setErr(e.message));
    }, [search, sector, level, sort, page, event]);
    const pages = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1;
    return _jsxs("div", { className: "page", children: [_jsxs("div", { className: "filters", children: [_jsx("input", { placeholder: "Search name or code\u2026", value: search, onChange: e => { setSearch(e.target.value); setPage(1); }, style: { width: 240 } }), _jsxs("select", { value: sector, onChange: e => { setSector(e.target.value); setPage(1); }, children: [_jsx("option", { value: "", children: "All sectors" }), opts.sectors.map((s) => _jsx("option", { children: s }, s))] }), _jsxs("select", { value: level, onChange: e => { setLevel(e.target.value); setPage(1); }, children: [_jsx("option", { value: "", children: "All risk levels" }), ['Critical', 'High', 'Moderate', 'Low'].map(l => _jsx("option", { children: l }, l))] }), _jsxs("select", { value: event, onChange: e => { setEvent(e.target.value); setPage(1); }, children: [_jsx("option", { value: "ongoing", children: "Ongoing" }), _jsx("option", { value: "completed", children: "Completed" })] }), _jsxs("select", { value: sort, onChange: e => setSort(e.target.value), children: [_jsx("option", { value: "risk", children: "Sort: risk score" }), _jsx("option", { value: "cor", children: "Sort: cost overrun %" }), _jsx("option", { value: "tor", children: "Sort: schedule overrun" }), _jsx("option", { value: "cost", children: "Sort: original cost" }), _jsx("option", { value: "name", children: "Sort: name" })] })] }), err && _jsxs("div", { className: "error", children: ["\u26A0 ", err] }), !data && !err && _jsx(Loader, {}), data && _jsxs(_Fragment, { children: [_jsx("div", { className: "card", children: _jsxs("table", { className: "tbl", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Project" }), _jsx("th", { children: "Sector / State" }), _jsx("th", { className: "num", children: "Original \u2192 Current" }), _jsx("th", { className: "num", children: "COR %" }), _jsx("th", { className: "num", children: "Delay (mo)" }), _jsx("th", { className: "num", children: "P(overrun)" }), _jsx("th", { children: "Risk" })] }) }), _jsx("tbody", { children: data.items.map((p) => _jsxs("tr", { className: "clickable", onClick: () => nav(`/projects/${p.project_code}`), children: [_jsxs("td", { children: [_jsx("div", { className: "name", title: p.project_name, children: p.project_name }), _jsxs("div", { style: { color: 'var(--muted)', fontSize: 10.5 }, children: [p.project_code, p.anomaly_flag ? ' · ⚠ anomaly' : ''] })] }), _jsxs("td", { style: { fontSize: 11.5 }, children: [p.sector, _jsx("br", {}), _jsx("span", { style: { color: 'var(--muted)' }, children: p.state || '—' })] }), _jsxs("td", { className: "num", style: { fontSize: 11.5 }, children: [fmtMoney(p.original_cost), _jsx("br", {}), _jsxs("span", { style: { color: p.latest_cost > p.original_cost ? 'var(--critical)' : 'var(--low)' }, children: ["\u2192 ", fmtMoney(p.latest_cost)] })] }), _jsx("td", { className: "num", style: { color: p.cost_overrun_pct > 0 ? 'var(--critical)' : undefined }, children: p.cost_overrun_pct == null ? '—' : p.cost_overrun_pct.toFixed(0) }), _jsx("td", { className: "num", children: p.time_overrun_months == null ? '—' : p.time_overrun_months.toFixed(0) }), _jsx("td", { className: "num", children: p.pred_prob_monitoring == null ? '—' : `${(p.pred_prob_monitoring * 100).toFixed(0)}%` }), _jsx("td", { children: _jsx(Badge, { level: p.risk_level }) })] }, p.project_code)) })] }) }), _jsxs("div", { className: "pager", children: [_jsx("button", { disabled: page <= 1, onClick: () => setPage(page - 1), children: "\u2039 Prev" }), _jsxs("span", { children: ["Page ", page, " of ", pages, " \u00B7 ", data.total.toLocaleString(), " projects"] }), _jsx("button", { disabled: page >= pages, onClick: () => setPage(page + 1), children: "Next \u203A" })] })] })] });
}
