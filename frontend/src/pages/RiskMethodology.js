import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { api } from '../api';
import { ErrorBox, Loader } from '../components/ui';
export default function RiskMethodology() {
    const [m, setM] = useState(null);
    const [w, setW] = useState(null);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    useEffect(() => { api('/api/risk/methodology').then(setM).catch(e => setErr(e.message)); }, []);
    if (err)
        return _jsx("div", { className: "page", children: _jsx(ErrorBox, { msg: err }) });
    if (!m)
        return _jsx(Loader, {});
    const setWeight = (k, v) => setW({ ...(w || m.weights), [k]: parseFloat(v) || 0 });
    const save = async () => {
        setMsg('');
        try {
            const r = await api('/api/config/risk-weights', {
                method: 'PUT', body: JSON.stringify(w),
            });
            setMsg(`Weights updated — project levels recomputed. Sum = ${Object.values(r.weights).reduce((s, x) => s + x, 0).toFixed(2)}`);
            setW(r.weights);
        }
        catch (e) {
            setMsg(`⚠ ${e.message}`);
        }
    };
    const current = w || m.weights;
    return _jsxs("div", { className: "page", style: { maxWidth: 900 }, children: [_jsxs("div", { className: "card mb", children: [_jsx("h3", { children: "Purpose" }), _jsx("div", { className: "note", style: { fontSize: 12.5 }, children: "The PAIMANA implementation-risk score summarises, for each project at its most recent report month, how much trouble the project is in and how much trouble the model expects. It is deliberately transparent: every component is a formula over observable quantities and model outputs \u2014 no hidden model drives the score itself." }), _jsx("div", { className: "insufficient", style: { marginTop: 10 }, children: m.disclaimer })] }), _jsxs("div", { className: "card mb", children: [_jsx("h3", { children: "Component formulas" }), _jsxs("table", { className: "tbl", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Component" }), _jsx("th", { children: "Computation" })] }) }), _jsx("tbody", { children: Object.entries(m.components).map(([k, v]) => _jsxs("tr", { children: [_jsx("td", { style: { fontWeight: 600 }, children: k.replace(/_/g, ' ') }), _jsx("td", { style: { fontSize: 12 }, children: v })] }, k)) })] })] }), _jsxs("div", { className: "card mb", children: [_jsx("h3", { children: "Weights (configurable)" }), _jsx("div", { className: "note mb", children: "Total score = \u03A3 weight \u00D7 component. Levels: Low < 30, Moderate 30\u201355, High 55\u201375, Critical \u2265 75." }), _jsx("div", { className: "whatif-grid", children: Object.keys(m.components).map(k => _jsxs("div", { children: [_jsxs("label", { children: [k.replace(/_/g, ' '), " (current ", current[k], ")"] }), _jsx("input", { type: "number", step: "0.05", min: "0", max: "1", value: current[k], onChange: e => setWeight(k, e.target.value) })] }, k)) }), _jsx("button", { onClick: save, style: {
                            marginTop: 10, padding: '8px 18px', background: 'var(--navy)', color: '#fff',
                            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                        }, children: "Save & recompute project levels" }), _jsx("button", { onClick: () => setW(m.weights), style: {
                            marginTop: 10, marginLeft: 8, padding: '8px 18px', background: '#fff',
                            border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
                        }, children: "Reset form" }), msg && _jsx("div", { className: "note", style: { marginTop: 8, color: 'var(--navy)' }, children: msg }), _jsx("div", { className: "note", style: { marginTop: 8 }, children: "Default weights: cost 0.35 / schedule 0.35 / expenditure 0.20 / reporting 0.10. Weights must sum to ~1.0." })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "How the score relates to model predictions" }), _jsxs("div", { className: "note", style: { fontSize: 12.5 }, children: ["The score blends ", _jsx("b", { children: "observed" }), " indicators (reported overrun %, months past target, expenditure patterns, data gaps) with the ", _jsx("b", { children: "model's calibrated probability" }), " of cost overrun. The prediction models themselves never use post-outcome information as inputs \u2014 see the leakage policy on the Model Performance page. SHAP explanations describe influence on model predictions, not causal effects."] })] })] });
}
