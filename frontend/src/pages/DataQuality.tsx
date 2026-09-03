import { useEffect, useState } from 'react'
import { api, monthLabel } from '../api'
import { ErrorBox, Loader } from '../components/ui'

export default function DataQuality() {
  const [d, setD] = useState<any>(null)
  const [err, setErr] = useState('')
  useEffect(() => { api('/api/data-quality').then(setD).catch(e => setErr(e.message)) }, [])
  if (err) return <div className="page"><ErrorBox msg={err} /></div>
  if (!d) return <Loader />
  const m = d.manifest

  return <div className="page">
    <div className="grid g2 mb">
      <div className="card">
        <h3>Source reports (all public MoSPI data)</h3>
        <table className="tbl">
          <thead><tr><th>Report month</th><th>Report</th></tr></thead>
          <tbody>
            {Object.entries(m.sources || {}).map(([month, s]: any) => <tr key={month}>
              <td>{monthLabel(month)}</td>
              <td>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>{s.report}</a>
                <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{s.url}</div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Parse validation (computed vs printed in PDFs)</h3>
        <table className="tbl">
          <tbody>
            <tr><td>Cost-overrun % matched within 1pp</td>
              <td className="num" style={{ fontWeight: 700, color: 'var(--low)' }}>
                {m.validations?.computed_vs_reported_cost_overrun?.match_within_1pp_pct}% (n = {m.validations?.computed_vs_reported_cost_overrun?.n?.toLocaleString()})</td></tr>
            <tr><td>Time-overrun matched within 1 month</td>
              <td className="num" style={{ fontWeight: 700, color: 'var(--low)' }}>
                {m.validations?.computed_vs_reported_time_overrun?.match_within_1m_pct}% (n = {m.validations?.computed_vs_reported_time_overrun?.n?.toLocaleString()})</td></tr>
            <tr><td>Original cost consistent across months</td>
              <td className="num" style={{ fontWeight: 700 }}>
                {d.original_cost_consistency_pct?.toFixed(1)}% of projects</td></tr>
          </tbody>
        </table>
        <div className="note mt">Residual inconsistencies reflect genuine restatements in MoSPI source reports.</div>
        <h3 style={{ marginTop: 14 }}>Field coverage (share missing)</h3>
        <table className="tbl">
          <tbody>
            {Object.entries(d.null_share_pct || {}).map(([k, v]: any) => <tr key={k}>
              <td>{k.replace(/_/g, ' ')}</td>
              <td className="num" style={{ color: v > 30 ? 'var(--high)' : v > 10 ? 'var(--moderate)' : 'var(--low)' }}>
                {v.toFixed(1)}%</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>

    <div className="card mb">
      <h3>Records per report month</h3>
      <table className="tbl">
        <thead><tr>
          <th>Month</th><th className="num">Ongoing census</th><th className="num">Completed</th>
          <th className="num">Closed unfinished</th><th className="num">Total</th>
        </tr></thead>
        <tbody>
          {d.per_month?.map((r: any) => <tr key={r.report_month}>
            <td>{monthLabel(r.report_month)}</td>
            <td className="num">{(r.ongoing_report || 0).toLocaleString()}</td>
            <td className="num">{(r.completed || 0).toLocaleString()}</td>
            <td className="num">{(r.closed_unfinished || 0).toLocaleString()}</td>
            <td className="num" style={{ fontWeight: 700 }}>
              {((r.ongoing_report || 0) + (r.completed || 0) + (r.closed_unfinished || 0)).toLocaleString()}</td>
          </tr>)}
        </tbody>
      </table>
    </div>

    <div className="grid g2">
      <div className="card">
        <h3>Known limitations (documented honestly)</h3>
        <ul style={{ fontSize: 12.5, margin: 0, paddingLeft: 18 }}>
          {d.known_limitations?.map((l: string, i: number) => <li key={i} style={{ marginBottom: 6 }}>{l}</li>)}
        </ul>
      </div>
      <div className="card">
        <h3>Derived-field definitions (manifest)</h3>
        <table className="tbl">
          <tbody>
            {Object.entries(m.formulas || {}).map(([k, v]: any) => <tr key={k}>
              <td style={{ width: 180 }}>{k}</td><td style={{ fontSize: 11.5, color: 'var(--muted)' }}>{v}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </div>
}
