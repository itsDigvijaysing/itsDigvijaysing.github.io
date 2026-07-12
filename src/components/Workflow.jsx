import { useMemo, useState } from 'react';
import WorkflowLightbox from './WorkflowLightbox.jsx';

// ── Layout ──────────────────────────────────────────────────────────────────
// Turns the authored { caption, rows, edges } model into absolute SVG geometry.
// Rows are explicit vertical levels; nodes within a row are centered across the
// canvas. Edges are cubic-bezier connectors (downward) or dashed side loops
// (feedback / back-edges). Pure function → inline preview and the zoom overlay
// share identical geometry.
const NW = 152;
const NH = 54;
const COLGAP = 30;
const ROWGAP = 52;
const PAD = 24;

export function layoutWorkflow(data) {
  const rows = data?.rows || [];
  const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 1);
  const width = PAD * 2 + maxCols * NW + (maxCols - 1) * COLGAP;
  const height = PAD * 2 + rows.length * NH + Math.max(0, rows.length - 1) * ROWGAP;

  const byId = {};
  const nodes = [];
  rows.forEach((row, r) => {
    const rowW = row.length * NW + (row.length - 1) * COLGAP;
    const startX = (width - rowW) / 2;
    row.forEach((n, i) => {
      const node = { ...n, x: startX + i * (NW + COLGAP), y: PAD + r * (NH + ROWGAP), w: NW, h: NH, row: r };
      byId[n.id] = node;
      nodes.push(node);
    });
  });

  const edges = (data?.edges || [])
    .map((e) => {
      const s = byId[e.from];
      const t = byId[e.to];
      if (!s || !t) return null;
      const sCx = s.x + NW / 2;
      const tCx = t.x + NW / 2;
      const up = e.back || t.row <= s.row;
      let path;
      let lx;
      let ly;
      if (up) {
        // Feedback loop - bow out to the right of both nodes.
        const sRx = s.x + NW;
        const sRy = s.y + NH / 2;
        const tRx = t.x + NW;
        const tRy = t.y + NH / 2;
        const cx = Math.max(sRx, tRx) + 48;
        path = `M ${sRx} ${sRy} C ${cx} ${sRy}, ${cx} ${tRy}, ${tRx} ${tRy}`;
        lx = cx;
        ly = (sRy + tRy) / 2;
      } else {
        const sy = s.y + NH;
        const ty = t.y;
        const dy = ty - sy;
        path = `M ${sCx} ${sy} C ${sCx} ${sy + dy * 0.5}, ${tCx} ${ty - dy * 0.5}, ${tCx} ${ty}`;
        // Tuck the label into the gap just below the source so it never lands on an
        // intermediate/target node when the edge skips a row (dy spans >1 level).
        const f = Math.min(0.45, 24 / dy);
        lx = sCx + (tCx - sCx) * f;
        ly = sy + dy * f;
      }
      return { ...e, path, up, lx, ly };
    })
    .filter(Boolean);

  return { width, height, nodes, edges };
}

// ── SVG ─────────────────────────────────────────────────────────────────────
// `uid` namespaces the marker/gradient ids so the inline copy and the overlay
// copy can both live in the DOM without id collisions.
export function WorkflowSvg({ layout, uid = 'wf' }) {
  const { width, height, nodes, edges } = layout;
  const arrow = `${uid}-arrow`;
  const arrowBack = `${uid}-arrow-back`;
  const grad = `${uid}-grad`;
  return (
    <svg
      className="wf-svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label="Project workflow diagram"
    >
      <defs>
        <marker id={arrow} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L8,4.5 L1,8 Z" className="wf-arrow" />
        </marker>
        <marker id={arrowBack} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L8,4.5 L1,8 Z" className="wf-arrow wf-arrow--back" />
        </marker>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b32b2" />
          <stop offset="1" stopColor="#1488cc" />
        </linearGradient>
      </defs>

      {edges.map((e, i) => (
        <path
          key={`e${i}`}
          d={e.path}
          className={`wf-edge${e.up ? ' wf-edge--back' : ''}`}
          markerEnd={`url(#${e.up ? arrowBack : arrow})`}
        />
      ))}

      {nodes.map((n) => (
        <g key={n.id}>
          {/* output uses an inline style (not a fill attr) so the gradient beats the .wf-node stylesheet rule */}
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx="13"
            className={`wf-node wf-node--${n.kind}`}
            style={n.kind === 'output' ? { fill: `url(#${grad})` } : undefined}
          />
          <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
            <div xmlns="http://www.w3.org/1999/xhtml" className={`wf-node__label wf-node__label--${n.kind}`}>
              {n.label}
            </div>
          </foreignObject>
        </g>
      ))}

      {edges
        .filter((e) => e.label)
        .map((e, i) => (
          <g key={`l${i}`} transform={`translate(${e.lx} ${e.ly})`}>
            <rect className="wf-edge-label__bg" x={-(e.label.length * 3.3 + 7)} y="-9" width={e.label.length * 6.6 + 14} height="18" rx="9" />
            <text className="wf-edge-label" x="0" y="4" textAnchor="middle">
              {e.label}
            </text>
          </g>
        ))}
    </svg>
  );
}

// ── Inline panel ──────────────────────────────────────────────────────────────
export default function Workflow({ data, title }) {
  const [open, setOpen] = useState(false);
  const layout = useMemo(() => layoutWorkflow(data), [data]);
  if (!data?.rows?.length) return null;

  return (
    <div className="wf">
      <button type="button" className="wf__stage" onClick={() => setOpen(true)} aria-label={`Expand ${title} workflow to full screen`}>
        <WorkflowSvg layout={layout} uid="wf-inline" />
        <span className="wf__expand" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Expand
        </span>
      </button>
      {data.caption && <p className="wf__caption">{data.caption}</p>}
      {open && <WorkflowLightbox layout={layout} caption={data.caption} title={title} onClose={() => setOpen(false)} />}
    </div>
  );
}
