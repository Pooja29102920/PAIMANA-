import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
export default function Assistant() {
    const [msgs, setMsgs] = useState([{
            role: 'bot',
            text: 'Namaste! I am the PAIMANA assistant. Ask me about MoSPI central-sector projects — risk rankings, sector/ministry/state aggregates, cost & schedule overruns, model drivers, data quality, or specific projects.\n\nExamples: "top 10 riskiest projects", "cost overrun in Railways", "tell me about project N24001451".',
        }]);
    const [q, setQ] = useState('');
    const [busy, setBusy] = useState(false);
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
    const ask = async (text) => {
        const question = (text ?? q).trim();
        if (!question || busy)
            return;
        setMsgs(m => [...m, { role: 'user', text: question }]);
        setQ('');
        setBusy(true);
        try {
            const r = await api(`/api/assistant?q=${encodeURIComponent(question)}`);
            setMsgs(m => [...m, { role: 'bot', text: r.answer }]);
        }
        catch (e) {
            setMsgs(m => [...m, { role: 'bot', text: `Sorry, an error occurred: ${e.message}` }]);
        }
        setBusy(false);
    };
    const suggestions = ['Top 10 riskiest projects', 'Cost overrun in Railways sector',
        'Projects in Maharashtra', 'What drives the model', 'Data quality and sources'];
    return _jsx("div", { className: "page", style: { maxWidth: 860 }, children: _jsxs("div", { className: "card chat", style: { minHeight: 420 }, children: [msgs.map((m, i) => _jsx("div", { className: `msg ${m.role}`, children: m.text }, i)), busy && _jsx("div", { className: "msg bot", children: "Thinking\u2026" }), _jsx("div", { ref: endRef }), _jsx("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }, children: suggestions.map(s => _jsx("button", { className: "tag-sim", style: {
                            background: '#fff', cursor: 'pointer', fontSize: 11.5,
                        }, onClick: () => ask(s), children: s }, s)) }), _jsxs("div", { className: "chat-input", children: [_jsx("input", { value: q, onChange: e => setQ(e.target.value), onKeyDown: e => e.key === 'Enter' && ask(), placeholder: "Ask about projects, sectors, overruns, risk\u2026" }), _jsx("button", { onClick: () => ask(), disabled: busy, children: "Ask" })] }), _jsx("div", { className: "note", style: { marginTop: 8 }, children: "Answers are computed live from the MoSPI panel in the PAIMANA database via SQL queries. The assistant does not state or imply official government decisions; where data is insufficient it says so explicitly." })] }) });
}
