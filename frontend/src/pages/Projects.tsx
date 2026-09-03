import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Badge, Loader, fmtMoney } from '../components/ui'

export default function Projects() {
  const nav = useNavigate()
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [level, setLevel] = useState('')
  const [sort, setSort] = useState('risk')
  const [page, setPage] = useState(1)
  const [opts, setOpts] = useState<any>({ sectors: [] })
  const [event, setEvent] = useState('ongoing')

  useEffect(() => {
    api('/api/projects?size=1').then((r: any) => {
      const s = new Set<string>()
      r.items.forEach((i: any) => s.add(i.sector))
      // fetch all sectors from a large page
      api('/api/projects?size=1000&sort=name').then((r2: any) => {
        r2.items.forEach((i: any) => s.add(i.sector))
        setOpts({ sectors: Array.from(s).filter(Boolean).sort() })
      })
    }).catch(() => { })
  }, [])

  useEffect(() => {
    setData(null)
    const q = new URLSearchParams({
      search, sector, level, sort, event,
      page: String(page), size: '25',
    })
    api(`/api/projects?${q}`).then(setData).catch(e => setErr(e.message))
  }, [search, sector, level, sort, page, event])

  const pages = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1

  return <div className="page">
    <div className="filters">
      <input placeholder="Search name or code…" value={search}
        onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ width: 240 }} />
      <select value={sector} onChange={e => { setSector(e.target.value); setPage(1) }}>
        <option value="">All sectors</option>
        {opts.sectors.map((s: string) => <option key={s}>{s}</option>)}
      </select>
      <select value={level} onChange={e => { setLevel(e.target.value); setPage(1) }}>
        <option value="">All risk levels</option>
        {['Critical', 'High', 'Moderate', 'Low'].map(l => <option key={l}>{l}</option>)}
      </select>
      <select value={event} onChange={e => { setEvent(e.target.value); setPage(1) }}>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="risk">Sort: risk score</option>
        <option value="cor">Sort: cost overrun %</option>
        <option value="tor">Sort: schedule overrun</option>
        <option value="cost">Sort: original cost</option>
        <option value="name">Sort: name</option>
      </select>
    </div>

    {err && <div className="error">⚠ {err}</div>}
    {!data && !err && <Loader />}
    {data && <>
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Project</th><th>Sector / State</th><th className="num">Original → Current</th>
              <th className="num">COR %</th><th className="num">Delay (mo)</th>
              <th className="num">P(overrun)</th><th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((p: any) => <tr key={p.project_code} className="clickable"
              onClick={() => nav(`/projects/${p.project_code}`)}>
              <td>
                <div className="name" title={p.project_name}>{p.project_name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 10.5 }}>{p.project_code}
                  {p.anomaly_flag ? ' · ⚠ anomaly' : ''}</div>
              </td>
              <td style={{ fontSize: 11.5 }}>
                {p.sector}<br /><span style={{ color: 'var(--muted)' }}>{p.state || '—'}</span>
              </td>
              <td className="num" style={{ fontSize: 11.5 }}>
                {fmtMoney(p.original_cost)}<br />
                <span style={{ color: p.latest_cost > p.original_cost ? 'var(--critical)' : 'var(--low)' }}>
                  → {fmtMoney(p.latest_cost)}</span>
              </td>
              <td className="num" style={{ color: p.cost_overrun_pct > 0 ? 'var(--critical)' : undefined }}>
                {p.cost_overrun_pct == null ? '—' : p.cost_overrun_pct.toFixed(0)}
              </td>
              <td className="num">{p.time_overrun_months == null ? '—' : p.time_overrun_months.toFixed(0)}</td>
              <td className="num">{p.pred_prob_monitoring == null ? '—' : `${(p.pred_prob_monitoring * 100).toFixed(0)}%`}</td>
              <td><Badge level={p.risk_level} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
        <span>Page {page} of {pages} · {data.total.toLocaleString()} projects</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next ›</button>
      </div>
    </>}
  </div>
}
