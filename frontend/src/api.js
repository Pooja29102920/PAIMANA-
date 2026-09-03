const BASE = import.meta.env.DEV ? '' : '';
export async function api(path, options) {
    const r = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!r.ok) {
        let msg = `HTTP ${r.status}`;
        try {
            msg = (await r.json()).detail || msg;
        }
        catch { /* ignore */ }
        throw new Error(msg);
    }
    return r.json();
}
export const fmtCr = (v) => v == null ? '—' : `₹${(v / 100000).toFixed(2)} L Cr`;
export const fmtCrFull = (v) => v == null ? '—' : `₹${Math.round(v).toLocaleString('en-IN')} Cr`;
export const fmtPct = (v, digits = 0) => v == null ? '—' : `${v.toFixed(digits)}%`;
export const fmtNum = (v) => v == null ? '—' : Math.round(v).toLocaleString('en-IN');
export const fmtProb = (v) => v == null ? '—' : `${(v * 100).toFixed(0)}%`;
export const monthLabel = (ym) => {
    if (!ym)
        return '';
    const [y, m] = ym.split('-');
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${names[parseInt(m) - 1]} ${y}`;
};
export const RISK_COLORS = {
    Low: '#2e9e5b', Moderate: '#d9a406', High: '#e06b1f', Critical: '#c62828',
};
