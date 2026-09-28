import { useState, useEffect, useRef } from 'react';
import { 
  fetchSheetRows, 
  submitRetrospective, 
  SHEET_URL, 
  getScriptUrl, 
  setScriptUrl 
} from './googleSheets';

const blank = () => ({ details: '', priority: 'Medium', owner: 'Product', remarks: '' });

const projectRows = [
  {
    project: 'Account Dashboard',
    client: 'MV',
    productOwner: 'Giriraj',
    hours: 18,
    uiOwners: 'Farhan, Yasir',
    status: 'Attention',
    date: '2026-07-29',
    uat: ['Permission scenarios need Product/UI review', 'Workflow label differs from approved UX copy'],
    gaps: ['List all impacted modules in the requirement'],
    productLessons: ['Confirm every affected screen during handover'],
    uiIssues: ['Responsive states need a review matrix'],
    uiLessons: ['Add responsive evidence to UI sign-off'],
    uatRemarks: ['Add role coverage before the next UI review'],
    gapRemarks: ['Product team to attach the module list'],
    productLessonRemarks: ['Use the handover checklist'],
    uiIssueRemarks: ['Agree mobile validation evidence'],
    uiLessonRemarks: ['Include evidence in the UI review pack']
  },
  {
    project: 'Account Configuration',
    client: 'MV',
    productOwner: 'Pratik',
    hours: 12.5,
    uiOwners: 'Lipsa, Renish',
    status: 'Attention',
    date: '2026-07-30',
    uat: ['Account-switching context was unclear'],
    gaps: ['Acceptance criteria need account-level examples'],
    productLessons: ['Add scenario examples to requirement documents'],
    uiIssues: ['Profile layout needs mobile validation'],
    uiLessons: ['Review mobile breakpoints before handover'],
    uatRemarks: ['Review account state in the UI walkthrough'],
    gapRemarks: ['Add examples to acceptance criteria'],
    productLessonRemarks: ['Use examples in the next requirement'],
    uiIssueRemarks: ['Validate the profile layout at every target width'],
    uiLessonRemarks: ['Schedule breakpoint review before handover']
  },
  {
    project: 'Vendor Workspace',
    client: 'Acme',
    productOwner: 'Kanupriya',
    hours: 9,
    uiOwners: 'Farhan',
    status: 'On track',
    date: '2026-07-28',
    uat: ['No high-priority observations'],
    gaps: ['None recorded'],
    productLessons: ['Keep copy decisions documented'],
    uiIssues: ['Icon alignment refinement identified'],
    uiLessons: ['Use the shared icon reference in review'],
    uatRemarks: ['Track in the project close-out note'],
    gapRemarks: ['No action needed'],
    productLessonRemarks: ['Keep the copy log current'],
    uiIssueRemarks: ['Resolve in the next UI pass'],
    uiLessonRemarks: ['Use the icon reference during review']
  }
];

function GoogleSheetModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(getScriptUrl());
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(getScriptUrl());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setScriptUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/google-apps-script.js');
      let code = '';
      if (res.ok) {
        code = await res.text();
      } else {
        code = '// Open google-apps-script.js in the project repository for full script';
      }
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="sheet-modal-backdrop" onClick={onClose}>
      <div className="sheet-modal-card" onClick={e => e.stopPropagation()}>
        <header className="sheet-modal-header">
          <h3>
            <span>📊</span> Google Sheet Integration (Retro)
          </h3>
          <button type="button" className="drawer-close-btn" style={{ width: 'auto', padding: '4px 10px' }} onClick={onClose}>✕</button>
        </header>

        <div className="sheet-modal-body">
          <div className="sheet-modal-section">
            <label>Target Google Sheet</label>
            <p style={{ margin: '4px 0 8px' }}>
              Connected to tab <strong>Retro</strong>:{' '}
              <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-sheet-link">
                Open Spreadsheet ↗
              </a>
            </p>
          </div>

          <div className="sheet-modal-section">
            <form onSubmit={handleSave}>
              <label htmlFor="scriptUrlInput">Google Apps Script Web App URL</label>
              <p style={{ margin: '2px 0 8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Required to write new rows directly to the Google Sheet.
              </p>
              <div className="sheet-modal-input-group">
                <input
                  id="scriptUrlInput"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                />
                <button type="submit" className="btn-sheet-secondary" style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>
                  Save
                </button>
              </div>
              {saved && <p style={{ color: '#15803d', fontSize: '12px', marginTop: '6px', fontWeight: 'bold' }}>✓ Web App URL saved!</p>}
            </form>
          </div>

          <div className="sheet-modal-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ margin: 0 }}>3-Minute Setup Guide</label>
              <button type="button" className="btn-sheet-secondary" onClick={handleCopyCode}>
                {copied ? '✓ Code Copied!' : '📋 Copy Apps Script'}
              </button>
            </div>

            <div className="sheet-step-box">
              <ol>
                <li>Open your <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-sheet-link">Google Sheet</a>.</li>
                <li>In the menu, go to <strong>Extensions → Apps Script</strong>.</li>
                <li>Paste the script from <code>google-apps-script.js</code> (or click "Copy Apps Script" above) and save.</li>
                <li>Click <strong>Deploy → New deployment</strong>, select <strong>Web app</strong>, set <em>Who has access</em> to <strong>Anyone</strong>, and deploy.</li>
                <li>Copy the resulting Web App URL and paste it into the field above!</li>
              </ol>
            </div>
          </div>
        </div>

        <footer className="sheet-modal-footer">
          <button type="button" className="btn-sheet-secondary" onClick={onClose}>Done</button>
        </footer>
      </div>
    </div>
  );
}

function DetailDrawer({ selected, onClose }) {
  const [closing, setClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const triggerClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 240);
  };

  const handlePointerDown = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startYRef.current;
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.clientY - lastYRef.current) / dt;
    }
    lastYRef.current = e.clientY;
    lastTimeRef.current = now;

    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(deltaY * 0.18);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (dragY > 70 || velocityRef.current > 0.35) {
      triggerClose();
    } else {
      setDragY(0);
    }
  };

  return (
    <div 
      className={`detail-drawer ${closing ? 'drawer-closing' : 'drawer-entering'}`}
      style={{
        transform: isDragging 
          ? `translateY(${Math.max(0, dragY)}px)` 
          : closing 
          ? 'translateY(100%)' 
          : 'translateY(0)',
        transition: isDragging ? 'none' : 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out',
        opacity: closing ? 0 : 1
      }}
    >
      <div 
        className="drawer-drag-area"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Swipe down to dismiss"
      >
        <div className="drawer-drag-pill" />
        <span className="drawer-drag-hint">Swipe down or click close</span>
      </div>

      <div className="drawer-body-layout">
        <div className="drawer-content">
          <h3>{selected.title}</h3>
          <div className="drawer-items">
            {(!selected.items || selected.items.length === 0) ? (
              <p style={{ color: 'var(--text-tertiary)' }}>No items recorded.</p>
            ) : (
              selected.items.map((item, i) => (
                <p key={i}><strong>Point {i + 1}:</strong> {item}</p>
              ))
            )}
          </div>
        </div>
        <button 
          type="button" 
          className="drawer-close-btn" 
          onClick={triggerClose}
          aria-label="Close drawer"
        >
          Close drawer ✕
        </button>
      </div>
    </div>
  );
}

function Review({ onOpenModal }) {
  const [query, setQuery] = useState('');
  const [productOwner, setProductOwner] = useState('All Product Owners');
  const [uiOwner, setUiOwner] = useState('All UI Owners');
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('consolidated'); // 'consolidated' | 'expanded'
  const [expandedProjects, setExpandedProjects] = useState({});
  const [sheetData, setSheetData] = useState(null);
  const [loadingSheet, setLoadingSheet] = useState(false);

  const loadData = async () => {
    setLoadingSheet(true);
    const rows = await fetchSheetRows();
    if (rows && rows.length > 0) {
      setSheetData(rows);
    } else {
      setSheetData([]);
    }
    setLoadingSheet(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const isLive = sheetData && sheetData.length > 0;
  const activeDataset = isLive ? sheetData : projectRows;

  const toggleExpand = (project) => {
    setExpandedProjects(prev => ({ ...prev, [project]: !prev[project] }));
  };

  const productOwners = ['All Product Owners', ...new Set(activeDataset.map(x => x.productOwner).filter(Boolean))];
  const uiOwners = ['All UI Owners', ...new Set(activeDataset.flatMap(x => (x.uiOwners || '').split(', ')).filter(Boolean))];

  const rows = activeDataset.filter(x => 
    (x.project || '').toLowerCase().includes(query.toLowerCase()) &&
    (productOwner === 'All Product Owners' || x.productOwner === productOwner) &&
    (uiOwner === 'All UI Owners' || (x.uiOwners || '').includes(uiOwner))
  );

  const Detail = ({ title, items }) => (
    <div 
      className="cell-content" 
      onClick={() => setSelected({ title, items: items || [] })} 
      title="Click to expand view in drawer"
    >
      {(items || []).map((item, i) => (
        <div key={i} className="cell-item">
          {items.length > 1 && <span className="cell-bullet">•</span>}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );

  const PairedDetail = ({ title, obsTitle, obsItems, remarkTitle, remarkItems }) => {
    const hasObs = obsItems && obsItems.length > 0;
    const hasRemarks = remarkItems && remarkItems.length > 0 && remarkItems.some(Boolean);

    const handleClick = () => {
      const combined = [];
      if (hasObs) {
        obsItems.forEach((x, idx) => combined.push(`[${obsTitle || 'Observation'} ${idx + 1}] ${x}`));
      }
      if (hasRemarks) {
        remarkItems.forEach((x, idx) => combined.push(`[${remarkTitle || 'Action/Remark'} ${idx + 1}] ${x}`));
      }
      setSelected({ title, items: combined.length > 0 ? combined : ['No details recorded'] });
    };

    return (
      <div 
        className="cell-content paired-cell" 
        onClick={handleClick}
        title="Click to expand grouped details in drawer"
      >
        <div className="paired-group obs-group">
          <span className="paired-pill obs-pill">{obsTitle || 'Observation'}</span>
          {hasObs ? (
            obsItems.map((item, i) => (
              <div key={i} className="cell-item">
                {obsItems.length > 1 && <span className="cell-bullet">•</span>}
                <span>{item}</span>
              </div>
            ))
          ) : (
            <span className="paired-empty">None recorded</span>
          )}
        </div>

        {hasRemarks && (
          <div className="paired-group remark-group">
            <span className="paired-pill remark-pill">{remarkTitle || 'Action / Remark'}</span>
            {remarkItems.map((rem, i) => (
              <div key={i} className="cell-item remark-item">
                <span className="remark-bullet">↳</span>
                <span>{rem}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="review">
      <header className="review-head">
        <div>
          <small>MANAGEMENT VIEW</small>
          <h1>Project retrospective register</h1>
          <p>One row per project, with Product and UI points grouped for fast review.</p>
        </div>
      </header>

      {/* Google Sheet Live Status Banner */}
      <div className={`sheet-banner ${isLive ? '' : 'notice'}`}>
        <div className="sheet-banner-left">
          <span className={`sheet-badge ${isLive ? '' : 'mock'}`}>
            <span className="sheet-badge-dot"></span>
            {isLive ? 'Google Sheet Live' : 'Sheet Empty (Sample View)'}
          </span>
          <span>
            {isLive 
              ? `Connected to Google Sheet: Loaded ${sheetData.length} project(s) directly from tab "Retro".`
              : `Google Sheet "Retro" has 0 rows yet. Showing preview data.`}
          </span>
        </div>
        <div className="sheet-banner-actions">
          <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-sheet-link">
            Open Sheet ↗
          </a>
          <button 
            type="button" 
            className="btn-sheet-secondary" 
            onClick={loadData}
            disabled={loadingSheet}
          >
            {loadingSheet ? 'Refreshing...' : '🔄 Refresh Sheet'}
          </button>
          <button type="button" className="btn-sheet-secondary" onClick={onOpenModal}>
            ⚙️ Sheet Setup
          </button>
        </div>
      </div>

      <section className="panel register">
        <div className="register-title">
          <label>
            Search project
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Search project name..."
            />
          </label>
          <label>
            Product Owner
            <select value={productOwner} onChange={e => setProductOwner(e.target.value)}>
              {productOwners.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>
            UI Owner
            <select value={uiOwner} onChange={e => setUiOwner(e.target.value)}>
              {uiOwners.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>

          {/* VENDX Principle 9B: Master Layout Toggle */}
          <div className="table-layout-switch">
            <span className="layout-switch-label">Table Layout:</span>
            <div className="layout-segmented-control">
              <button 
                type="button" 
                className={viewMode === 'consolidated' ? 'active' : ''}
                onClick={() => setViewMode('consolidated')}
                title="Consolidated paired columns (cuts scroll width by 50%)"
              >
                Consolidated (Clean)
              </button>
              <button 
                type="button" 
                className={viewMode === 'expanded' ? 'active' : ''}
                onClick={() => setViewMode('expanded')}
                title="Traditional 15-column expanded table"
              >
                Expanded (15-Col)
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table className={`project-table ${viewMode === 'consolidated' ? 'table-consolidated' : 'table-expanded'}`}>
            {viewMode === 'consolidated' ? (
              <>
                <thead>
                  <tr>
                    <th className="col-project">Project</th>
                    <th className="col-client">Client</th>
                    <th className="col-po">Product owner</th>
                    <th className="col-hours">PO hrs.</th>
                    <th className="col-detail-paired">UAT Observations & Actions</th>
                    <th className="col-detail-paired">Requirement Gaps & Actions</th>
                    <th className="col-detail-paired">Product Lessons & Actions</th>
                    <th className="col-ui">UI owner(s)</th>
                    <th className="col-detail-paired">UI Issues & Actions</th>
                    <th className="col-detail-paired">UI Lessons & Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                        No matching projects found.
                      </td>
                    </tr>
                  ) : rows.map(row => {
                    const isExpanded = !!expandedProjects[row.project];
                    return (
                      <tr key={row.project} className={isExpanded ? 'mobile-expanded' : 'mobile-collapsed'}>
                        <td className="col-project" data-label="Project">
                          <div className="mobile-project-header">
                            <strong>{row.project}</strong>
                            <button 
                              type="button" 
                              className={`mobile-expand-icon-btn ${isExpanded ? 'expanded' : ''}`}
                              onClick={() => toggleExpand(row.project)}
                              aria-label={isExpanded ? 'Collapse project details' : 'Expand project details'}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="col-client" data-label="Client">{row.client || '—'}</td>
                        <td className="col-po" data-label="Product owner">{row.productOwner || '—'}</td>
                        <td className="col-hours" data-label="PO hrs.">{row.hours ? `${row.hours} hrs` : '—'}</td>
                        <td className="col-detail-paired" data-label="UAT Observations & Actions">
                          <PairedDetail 
                            title="UAT Observations & Actions" 
                            obsTitle="Issues" 
                            obsItems={row.uat} 
                            remarkTitle="Actions" 
                            remarkItems={row.uatRemarks} 
                          />
                        </td>
                        <td className="col-detail-paired" data-label="Requirement Gaps & Actions">
                          <PairedDetail 
                            title="Requirement Gaps & Actions" 
                            obsTitle="Gaps" 
                            obsItems={row.gaps} 
                            remarkTitle="Actions" 
                            remarkItems={row.gapRemarks} 
                          />
                        </td>
                        <td className="col-detail-paired" data-label="Product Lessons & Actions">
                          <PairedDetail 
                            title="Product Lessons & Actions" 
                            obsTitle="Lessons" 
                            obsItems={row.productLessons} 
                            remarkTitle="Actions" 
                            remarkItems={row.productLessonRemarks} 
                          />
                        </td>
                        <td className="col-ui" data-label="UI owner(s)">{row.uiOwners || '—'}</td>
                        <td className="col-detail-paired" data-label="UI Issues & Actions">
                          <PairedDetail 
                            title="UI Issues & Actions" 
                            obsTitle="Issues" 
                            obsItems={row.uiIssues} 
                            remarkTitle="Actions" 
                            remarkItems={row.uiIssueRemarks} 
                          />
                        </td>
                        <td className="col-detail-paired" data-label="UI Lessons & Actions">
                          <PairedDetail 
                            title="UI Lessons & Actions" 
                            obsTitle="Lessons" 
                            obsItems={row.uiLessons} 
                            remarkTitle="Actions" 
                            remarkItems={row.uiLessonRemarks} 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr>
                    <th className="col-project">Project</th>
                    <th className="col-client">Client name</th>
                    <th className="col-po">Product owner</th>
                    <th className="col-hours">Product owner hrs.</th>
                    <th className="col-detail">UAT issues</th>
                    <th className="col-detail">UAT issues remark</th>
                    <th className="col-detail">Requirement & Document gaps</th>
                    <th className="col-detail">Requirement & Document gaps remark</th>
                    <th className="col-detail">Product lessons learned</th>
                    <th className="col-detail">Lessons learned remark</th>
                    <th className="col-ui">UI owner(s)</th>
                    <th className="col-detail">UI issues summary</th>
                    <th className="col-detail">UI issues summary remark</th>
                    <th className="col-detail">UI lessons learned</th>
                    <th className="col-detail">UI lessons learned remark</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="15" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                        No matching projects found.
                      </td>
                    </tr>
                  ) : rows.map(row => {
                    const isExpanded = !!expandedProjects[row.project];
                    return (
                      <tr key={row.project} className={isExpanded ? 'mobile-expanded' : 'mobile-collapsed'}>
                        <td className="col-project" data-label="Project">
                          <div className="mobile-project-header">
                            <strong>{row.project}</strong>
                            <button 
                              type="button" 
                              className={`mobile-expand-icon-btn ${isExpanded ? 'expanded' : ''}`}
                              onClick={() => toggleExpand(row.project)}
                              aria-label={isExpanded ? 'Collapse project details' : 'Expand project details'}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="col-client" data-label="Client name">{row.client || '—'}</td>
                        <td className="col-po" data-label="Product owner">{row.productOwner || '—'}</td>
                        <td className="col-hours" data-label="Product owner hrs.">{row.hours ? `${row.hours} hrs` : '—'}</td>
                        <td className="col-detail" data-label="UAT issues"><Detail title="UAT issues" items={row.uat} /></td>
                        <td className="col-detail" data-label="UAT issues remark"><Detail title="UAT issues remark" items={row.uatRemarks} /></td>
                        <td className="col-detail" data-label="Requirement & Document gaps"><Detail title="Requirement & Document gaps" items={row.gaps} /></td>
                        <td className="col-detail" data-label="Requirement & Document gaps remark"><Detail title="Requirement & Document gaps remark" items={row.gapRemarks} /></td>
                        <td className="col-detail" data-label="Product lessons learned"><Detail title="Product lessons learned" items={row.productLessons} /></td>
                        <td className="col-detail" data-label="Lessons learned remark"><Detail title="Lessons learned remark" items={row.productLessonRemarks} /></td>
                        <td className="col-ui" data-label="UI owner(s)">{row.uiOwners || '—'}</td>
                        <td className="col-detail" data-label="UI issues summary"><Detail title="UI issues summary" items={row.uiIssues} /></td>
                        <td className="col-detail" data-label="UI issues summary remark"><Detail title="UI issues summary remark" items={row.uiIssueRemarks} /></td>
                        <td className="col-detail" data-label="UI lessons learned"><Detail title="UI lessons learned" items={row.uiLessons} /></td>
                        <td className="col-detail" data-label="UI lessons learned remark"><Detail title="UI lessons learned remark" items={row.uiLessonRemarks} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}
          </table>
        </div>

        {selected && (
          <DetailDrawer selected={selected} onClose={() => setSelected(null)} />
        )}
      </section>
    </section>
  );
}

function Points({ title, issue, rows, setRows }) {
  const [undoItem, setUndoItem] = useState(null);
  const [undoTimeLeft, setUndoTimeLeft] = useState(5);

  const change = (i, k, v) => setRows(a => a.map((x, n) => n === i ? { ...x, [k]: v } : x));

  const removePoint = (index) => {
    const target = rows[index];
    setRows(a => a.filter((_, n) => n !== index));
    setUndoItem({ point: target, index });
    setUndoTimeLeft(5);
  };

  useEffect(() => {
    if (!undoItem) return;
    const timer = setInterval(() => {
      setUndoTimeLeft(prev => {
        if (prev <= 1) {
          setUndoItem(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [undoItem]);

  const handleUndo = () => {
    if (!undoItem) return;
    setRows(prev => {
      const next = [...prev];
      next.splice(undoItem.index, 0, undoItem.point);
      return next;
    });
    setUndoItem(null);
  };

  return (
    <section className="panel">
      <div className="panel-header-row">
        <div>
          <h2>{title}</h2>
          <p>{issue ? 'Log items found during UAT.' : 'Capture a clear point for future delivery.'}</p>
        </div>
        {undoItem && (
          <div className="undo-toast" role="status">
            <span className="undo-msg">Point removed</span>
            <button type="button" className="undo-btn" onClick={handleUndo}>
              Undo ↺ ({undoTimeLeft}s)
            </button>
          </div>
        )}
      </div>
      
      {rows.map((point, i) => (
        <div className="point" key={i}>
          <b>{i + 1}</b>
          <label>
            {issue ? 'Issue description' : title === 'Lessons learned' ? 'Learning' : 'Missing or incorrect requirement'}
            <textarea 
              required 
              value={point.details} 
              onChange={e => change(i, 'details', e.target.value)} 
              placeholder="Write a clear point..."
            />
          </label>
          <label>
            Remarks
            <textarea 
              value={point.remarks} 
              onChange={e => change(i, 'remarks', e.target.value)} 
              placeholder="Context, impact, or next action..."
            />
          </label>
          {rows.length > 1 && (
            <button type="button" className="point-remove-btn" onClick={() => removePoint(i)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button className="add" type="button" onClick={() => setRows(a => [...a, blank()])}>
        + Add point
      </button>
    </section>
  );
}

function UIPage({ onOpenModal }) {
  const [data, setData] = useState({ project: '', uiOwners: [] });
  const [issues, setIssues] = useState([blank()]);
  const [lessons, setLessons] = useState([blank()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    const payload = {
      type: 'ui',
      project: data.project,
      uiOwners: data.uiOwners.join(', '),
      uiIssues: issues.map(x => x.details).filter(Boolean).join('\n• '),
      uiIssueRemarks: issues.map(x => x.remarks).filter(Boolean).join('\n• '),
      uiLessons: lessons.map(x => x.details).filter(Boolean).join('\n• '),
      uiLessonRemarks: lessons.map(x => x.remarks).filter(Boolean).join('\n• ')
    };

    const res = await submitRetrospective(payload);
    setSubmitting(false);
    setSubmitResult(res);
  };

  return (
    <>
      <header>
        <div className="logo">U</div>
        <div>
          <small>UI CLOSE-OUT</small>
          <h1>UI retrospective</h1>
          <p>Capture interface observations and learning for the UI team and store in Google Sheet.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="panel project">
          <h2>UI project details</h2>
          <p>Identify the project and UI owners contributing to this retrospective.</p>
          <div className="fields">
            <label>
              Project *
              <input 
                required 
                value={data.project} 
                onChange={e => setData(x => ({ ...x, project: e.target.value }))} 
                placeholder="REQ_NO_1025 - Account Dashboard update"
              />
            </label>

            <div className="ui-owner-container">
              <span className="ui-owner-label">UI owner(s)</span>
              <div className="ui-owner-options">
                {['Farhan', 'Yasir', 'Renish', 'Lipsa'].map(name => {
                  const isChecked = data.uiOwners.includes(name);
                  return (
                    <label key={name} className={`ui-chip ${isChecked ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={e => setData(x => ({
                          ...x,
                          uiOwners: e.target.checked
                            ? [...x.uiOwners, name]
                            : x.uiOwners.filter(v => v !== name)
                        }))} 
                      />
                      <span>{name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Points title="UI issues summary" issue rows={issues} setRows={setIssues} />
        <Points title="Lessons learned" rows={lessons} setRows={setLessons} />

        <footer>
          <div>
            <b>Ready to share?</b>
            <span>Submit the UI retrospective to store directly into the <strong>Retro</strong> Google Sheet tab.</span>
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving to Google Sheet...' : 'Submit UI retrospective →'}
          </button>
        </footer>

        {submitResult && (
          <div className="success" role="status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b>{submitResult.viaSheet ? '✓ Stored in Google Sheet (Retro)!' : '✓ Retrospective saved locally!'}</b>{' '}
              {submitResult.message}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-sheet-secondary">
                View in Google Sheet ↗
              </a>
              {!submitResult.viaSheet && (
                <button type="button" className="btn-sheet-secondary" onClick={onOpenModal}>
                  Connect Web App
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export function App() {
  const [view, setView] = useState('product');
  const [data, setData] = useState({ projects: '', projectHours: '', client: '', productOwner: '' });
  const [issues, setIssues] = useState([blank()]);
  const [gaps, setGaps] = useState([blank()]);
  const [lessons, setLessons] = useState([blank()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const set = (k, v) => setData(x => ({ ...x, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    const payload = {
      type: 'product',
      project: data.projects,
      client: data.client,
      productOwner: data.productOwner,
      hours: data.projectHours,
      uat: issues.map(x => x.details).filter(Boolean).join('\n• '),
      uatRemarks: issues.map(x => x.remarks).filter(Boolean).join('\n• '),
      gaps: gaps.map(x => x.details).filter(Boolean).join('\n• '),
      gapRemarks: gaps.map(x => x.remarks).filter(Boolean).join('\n• '),
      productLessons: lessons.map(x => x.details).filter(Boolean).join('\n• '),
      productLessonRemarks: lessons.map(x => x.remarks).filter(Boolean).join('\n• ')
    };

    const res = await submitRetrospective(payload);
    setSubmitting(false);
    setSubmitResult(res);
  };

  return (
    <main>
      <GoogleSheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <nav>
        <div className="nav-brand">
          <span>R</span> Retrospective
        </div>

        {/* VENDX Principle 9C: iOS-Style Segmented View Switch */}
        <div className="nav-segmented-control">
          <button 
            type="button"
            className={view === 'product' ? 'active' : ''} 
            onClick={() => setView('product')}
          >
            Product
          </button>
          <button 
            type="button"
            className={view === 'ui' ? 'active' : ''} 
            onClick={() => setView('ui')}
          >
            UI
          </button>
          <button 
            type="button"
            className={view === 'review' ? 'active' : ''} 
            onClick={() => setView('review')}
          >
            Management view
          </button>
        </div>

        {/* VENDX Principle 9C: Dedicated Utility Tray */}
        <div className="nav-utility-tray">
          <button 
            type="button"
            className="btn-sheet-secondary nav-sheet-btn"
            onClick={() => setIsModalOpen(true)}
            title="Google Sheet Integration"
          >
            📊 Google Sheet: Retro
          </button>
        </div>
      </nav>

      {view === 'review' ? (
        <Review onOpenModal={() => setIsModalOpen(true)} />
      ) : view === 'ui' ? (
        <UIPage onOpenModal={() => setIsModalOpen(true)} />
      ) : (
        <>
          <header>
            <div className="logo">P</div>
            <div>
              <small>PRODUCT CLOSE-OUT</small>
              <h1>Product retrospective</h1>
              <p>Capture Product observations, requirement gaps, and learning to store directly in Google Sheet.</p>
            </div>
          </header>

          <form onSubmit={handleSubmit}>
            <section className="panel project">
              <h2>Product project details</h2>
              <p>Set the context for this Product retrospective.</p>
              <div className="fields">
                <label>
                  Project(s) *
                  <input 
                    required 
                    value={data.projects} 
                    onChange={e => set('projects', e.target.value)} 
                    placeholder="REQ_NO_1025 - Account Dashboard update"
                  />
                </label>
                <label>
                  Client name *
                  <input 
                    required 
                    value={data.client} 
                    onChange={e => set('client', e.target.value)} 
                    placeholder="Client or organization"
                  />
                </label>
                <label>
                  Product owner *
                  <select 
                    required 
                    value={data.productOwner} 
                    onChange={e => set('productOwner', e.target.value)}
                  >
                    <option value="">Select Product Owner</option>
                    <option>Giriraj</option>
                    <option>Pratik</option>
                    <option>Kanupriya</option>
                  </select>
                </label>
                <label>
                  Product owner Hrs.
                  <input 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    value={data.projectHours} 
                    onChange={e => set('projectHours', e.target.value)} 
                    placeholder="e.g. 12.5"
                  />
                </label>
              </div>
            </section>

            <Points title="UAT issues" issue rows={issues} setRows={setIssues} />
            <Points title="Requirement & Document gaps" rows={gaps} setRows={setGaps} />
            <Points title="Lessons learned" rows={lessons} setRows={setLessons} />

            <footer>
              <div>
                <b>Ready to share?</b>
                <span>Submit the Product retrospective to store directly in the <strong>Retro</strong> Google Sheet tab.</span>
              </div>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Saving to Google Sheet...' : 'Submit Product retrospective →'}
              </button>
            </footer>

            {submitResult && (
              <div className="success" role="status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>{submitResult.viaSheet ? '✓ Stored in Google Sheet (Retro)!' : '✓ Retrospective saved locally!'}</b>{' '}
                  {submitResult.message}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-sheet-secondary">
                    View in Google Sheet ↗
                  </a>
                  {!submitResult.viaSheet && (
                    <button type="button" className="btn-sheet-secondary" onClick={() => setIsModalOpen(true)}>
                      Connect Web App
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </main>
  );
}