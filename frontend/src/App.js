import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ModelPerformance from './pages/ModelPerformance';
import DataQuality from './pages/DataQuality';
import Trends from './pages/Trends';
import Assistant from './pages/Assistant';
import RiskMethodology from './pages/RiskMethodology';
import { api, monthLabel } from './api';
import { useEffect, useState } from 'react';
const NAV = [
    { to: '/', icon: '📊', label: 'Dashboard', end: true },
    { to: '/projects', icon: '🏗️', label: 'Projects' },
    { to: '/risk-methodology', icon: '⚖️', label: 'Risk Methodology' },
    { to: '/model-performance', icon: '🤖', label: 'Model Performance' },
    { to: '/trends', icon: '📈', label: 'Trends & Forecast' },
    { to: '/data-quality', icon: '🗂️', label: 'Data & Sources' },
    { to: '/assistant', icon: '💬', label: 'Assistant' },
];
function Shell() {
    const loc = useLocation();
    const [meta, setMeta] = useState(null);
    useEffect(() => {
        api('/api/meta').then(setMeta).catch(() => setMeta(null));
    }, []);
    const title = NAV.find(n => n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to))?.label || 'PAIMANA';
    return (_jsxs("div", { className: "app", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "brand", children: [_jsx("h1", { children: "PAIMANA" }), _jsx("div", { className: "sub", children: "Pro-active Analytics for Infrastructure Monitoring & Assessment (National Analytics)" }), _jsx("div", { className: "dev", children: "SMART INDIA HACKATHON 2026 \u00B7 SIH26103" })] }), _jsx("nav", { className: "nav", children: NAV.map(n => (_jsxs(NavLink, { to: n.to, end: n.end, className: ({ isActive }) => isActive ? 'active' : '', children: [_jsx("span", { className: "icon", children: n.icon }), _jsx("span", { children: n.label })] }, n.to))) }), _jsxs("div", { className: "foot", children: ["Built on public MoSPI QPISR & Flash Report data.", meta ? _jsxs(_Fragment, { children: [_jsx("br", {}), "Latest report: ", monthLabel(meta.dataset?.report_months?.slice(-1)[0]), _jsx("br", {}), meta.dataset?.unique_projects?.toLocaleString(), " projects \u00B7 ", meta.dataset?.report_months?.length, " months"] }) : null] })] }), _jsxs("div", { className: "main", children: [_jsxs("div", { className: "topbar", children: [_jsx("h2", { children: title }), _jsx("div", { className: "meta", children: meta ? `MoSPI Central Sector Projects · ${meta.dataset?.panel_rows?.toLocaleString()} project-month records` : '' })] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/projects", element: _jsx(Projects, {}) }), _jsx(Route, { path: "/projects/:code", element: _jsx(ProjectDetail, {}) }), _jsx(Route, { path: "/model-performance", element: _jsx(ModelPerformance, {}) }), _jsx(Route, { path: "/data-quality", element: _jsx(DataQuality, {}) }), _jsx(Route, { path: "/trends", element: _jsx(Trends, {}) }), _jsx(Route, { path: "/assistant", element: _jsx(Assistant, {}) }), _jsx(Route, { path: "/risk-methodology", element: _jsx(RiskMethodology, {}) })] })] })] }));
}
export default function App() {
    return _jsx(BrowserRouter, { children: _jsx(Shell, {}) });
}
