import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';

const KIND_LABEL = { work: 'Work', education: 'Education', research: 'Research', product: 'Product', future: 'Ahead' };

// Era color bands - explicit, hand-picked, one per named life stage (keyed by
// the `color` string each journeyEras entry carries), not a formula
// interpolated from position/count. The era list is small and fixed and
// won't suddenly grow to a dozen entries, so a deliberately chosen color per
// stage is simpler to reason about than a generated ramp. Keying by name
// (not array index) is what lets two different cards - SSC and HSC - share
// one color while staying two separate cards. Adding a new era later is one
// new key here; where each band's boundary actually falls is still measured
// live from the DOM, unrelated to how many eras exist.
const ERA_COLORS = {
  school: 'rgba(14, 165, 233, 0.12)', // sky
  btech: 'rgba(33, 130, 216, 0.18)', // blue
  cognizant: 'rgba(51, 92, 194, 0.23)', // blue-indigo
  mtech: 'rgba(61, 56, 168, 0.28)', // indigo
  ahead: 'rgba(71, 36, 150, 0.33)', // violet-indigo
};
const ERA_LABEL = {
  school: 'School',
  btech: 'B.Tech',
  cognizant: 'Cognizant',
  mtech: 'M.Tech',
  ahead: 'Ahead',
};
function bandColor(colorId) {
  return ERA_COLORS[colorId] ?? ERA_COLORS.mtech;
}

// Career milestones on a single serpentine SVG path. Node positions are
// measured from the DOM (card heights vary), the curve is rebuilt on resize,
// and the solid line draws itself in as the section scrolls through the
// viewport - nodes light up as the line reaches them. The dashed "future"
// segment (into an item flagged `future`) is a separate, always-visible
// path, not part of the animated reveal. Cards alternate sides of a center
// spine on desktop and stack against a left rail on mobile; the same
// measuring logic produces both shapes. A flat color band sits behind each
// run of items that share a `color`, with a hard edge (no blend) between
// colors - milestones read as "part of" their era without being visually
// nested inside it.
//
// The draw-in is paced by matching actual vertical scroll position (in
// pixels), not by raw arc length along the path. The path bows left/right
// between nodes, so a bowed segment has more arc length than the vertical
// pixel distance it covers - animating strokeDashoffset off a plain 0-1
// scroll fraction of total length therefore drifts from the y-pixel
// threshold used to light up nodes, worse the more nodes/curves there are,
// so the drawn tip visibly lags or overshoots the lit node. Fix: sample the
// rendered path into a length<->y lookup table, then look up the arc length
// whose point's y matches the target scroll pixel, so the line and the
// nodes are always paced by the same metric.
export default function JourneyPath({ items }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const lineRef = useRef(null);
  const futureLineRef = useRef(null);
  const nodeRefs = useRef([]);
  const itemRefs = useRef([]);
  const bandsRef = useRef(null);
  const phaseLabelRefs = useRef([]);

  const futureStart = items.findIndex((m) => m.future);
  // Stable, render-time list of distinct colors in the order they first
  // appear - drives both the phase-label elements below and their
  // positioning in measure(), so the two stay in lockstep by construction.
  const colorOrder = [...new Set(items.map((m) => m.color).filter(Boolean))];

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const line = lineRef.current;
    if (!wrap || !svg || !line) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let length = 0;
    let ys = [];
    let lengthAtY = [];
    let raf = 0;

    const lengthForY = (targetY) => {
      if (!lengthAtY.length) return length;
      const last = lengthAtY.length - 1;
      if (targetY <= lengthAtY[0].y) return lengthAtY[0].L;
      if (targetY >= lengthAtY[last].y) return lengthAtY[last].L;
      let lo = 0;
      let hi = last;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (lengthAtY[mid].y <= targetY) lo = mid;
        else hi = mid;
      }
      const a = lengthAtY[lo];
      const b = lengthAtY[hi];
      const t = b.y === a.y ? 0 : (targetY - a.y) / (b.y - a.y);
      return a.L + t * (b.L - a.L);
    };

    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const progress = reduced
        ? 1
        : Math.min(1, Math.max(0, (window.innerHeight * 0.78 - rect.top) / rect.height));
      const py = progress * rect.height;
      line.style.strokeDashoffset = `${length - lengthForY(py)}`;
      nodeRefs.current.forEach((el, i) => {
        if (el) el.classList.toggle('lit', ys[i] !== undefined && ys[i] <= py + 6);
      });
    };

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const pts = nodeRefs.current.filter(Boolean).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 };
      });
      if (pts.length < 2) return;
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      // Gentle serpentine: nodes stay on the spine, the segments bow to
      // alternating sides. Smaller bow on mobile so it stays inside the rail.
      const bow = rect.width < 768 ? 14 : 46;
      const segment = (a, b, side) => {
        const my = (a.y + b.y) / 2;
        return ` C ${a.x + bow * side} ${my}, ${b.x + bow * side} ${my}, ${b.x} ${b.y}`;
      };

      // Split at the `future` item (if any) - everything before it is one
      // solid path; the final segment is a separate dashed path.
      const splitAt = futureStart > 0 && futureStart < pts.length ? futureStart : pts.length;

      let mainD = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < splitAt; i += 1) {
        mainD += segment(pts[i - 1], pts[i], i % 2 ? 1 : -1);
      }
      line.setAttribute('d', mainD);
      length = line.getTotalLength();
      line.style.strokeDasharray = `${length}`;
      ys = pts.map((p) => p.y);
      const SAMPLES = 200;
      lengthAtY = [];
      for (let s = 0; s <= SAMPLES; s += 1) {
        const Lval = (s / SAMPLES) * length;
        const pt = line.getPointAtLength(Lval);
        lengthAtY.push({ L: Lval, y: pt.y });
      }

      if (futureLineRef.current) {
        if (splitAt < pts.length) {
          const a = pts[splitAt - 1];
          const b = pts[splitAt];
          const futureD = `M ${a.x} ${a.y}` + segment(a, b, splitAt % 2 ? 1 : -1);
          futureLineRef.current.setAttribute('d', futureD);
          futureLineRef.current.style.display = '';
        } else {
          futureLineRef.current.style.display = 'none';
        }
      }

      // Era color backdrop: one element, one CSS linear-gradient, instead of
      // N stacked rectangles - a gradient can't produce the seam/notch
      // artifacts a multi-div approach did, since there's only one paint
      // surface and no overlapping edges to fight each other.
      //
      // 1. Find each color group's actual vertical span (min/max of every
      //    item that shares a `color`, e.g. SSC + HSC both under 'school').
      // 2. Turn the gaps between groups into boundaries, split at the
      //    midpoint so neighbors meet exactly - no overlap, no uncovered
      //    strip.
      // 3. Each color holds flat right up to the boundary, then the next
      //    color starts - no blend. The hard edge between two flat colors
      //    already reads as a dividing line; no separate line element needed.
      // 4. .journey's own box ends where its content does, but the visible
      //    gap down to the footer (the page section's shared bottom padding,
      //    plus the footer's own margin-top - not owned by .journey) is
      //    still blank page background. Stretch the backdrop past
      //    .journey's own bottom to close that gap, measured live. CSS % in
      //    a gradient is relative to the element's own rendered size, so
      //    every percentage below must be computed against that same
      //    stretched height (totalHeight), not rect.height - using the
      //    smaller rect.height as the denominator while the element renders
      //    taller pushed every boundary down by (bottomExtra * its own %),
      //    which is exactly the drift that showed cards straddling the
      //    wrong color.
      const bandsEl = bandsRef.current;
      let totalHeight = rect.height;
      if (bandsEl) {
        const footerEl = document.querySelector('.site-footer');
        const bottomExtra = footerEl ? Math.max(0, footerEl.getBoundingClientRect().top - rect.bottom) : 0;
        totalHeight = rect.height + bottomExtra;
        bandsEl.style.height = `${totalHeight}px`;
      }
      if (bandsEl && rect.height > 0) {
        const ranges = {};
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const top = r.top - rect.top;
          const bottom = r.bottom - rect.top;
          const color = items[i]?.color;
          if (!color) return;
          if (!ranges[color]) ranges[color] = { top, bottom };
          else {
            ranges[color].top = Math.min(ranges[color].top, top);
            ranges[color].bottom = Math.max(ranges[color].bottom, bottom);
          }
        });
        const order = colorOrder.filter((c) => ranges[c]);
        if (order.length) {
          const boundaries = [0];
          for (let i = 1; i < order.length; i += 1) {
            const prev = ranges[order[i - 1]];
            const next = ranges[order[i]];
            boundaries.push((prev.bottom + next.top) / 2);
          }
          boundaries.push(rect.height);

          const pct = (px) => `${Math.min(100, Math.max(0, (px / totalHeight) * 100)).toFixed(3)}%`;
          const stops = [`${bandColor(order[0])} ${pct(boundaries[0])}`];
          for (let i = 1; i < order.length; i += 1) {
            stops.push(`${bandColor(order[i - 1])} ${pct(boundaries[i])}`);
            stops.push(`${bandColor(order[i])} ${pct(boundaries[i])}`);
          }
          stops.push(`${bandColor(order[order.length - 1])} ${pct(boundaries[boundaries.length - 1])}`);
          bandsEl.style.background = `linear-gradient(180deg, ${stops.join(', ')})`;
        }

        // One faint background label per phase, vertically centered on that
        // phase's own span, so "which era am I looking at" doesn't rely on
        // matching a color swatch from memory - the name is just there.
        colorOrder.forEach((color, idx) => {
          const el = phaseLabelRefs.current[idx];
          const range = ranges[color];
          if (!el || !range) return;
          el.style.top = `${(range.top + range.bottom) / 2}px`;
        });
      }

      update();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    measure();
    // Re-measure when card heights change (font load, text wrap, viewport resize).
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [items, futureStart]);

  return (
    <div className="journey" ref={wrapRef}>
      <div className="jp-bands" aria-hidden="true" ref={bandsRef}>
        {colorOrder.map((color, idx) => (
          <span
            key={color}
            className="jp-phase-label"
            ref={(el) => {
              phaseLabelRefs.current[idx] = el;
            }}
          >
            {ERA_LABEL[color] ?? color}
          </span>
        ))}
      </div>
      <svg ref={svgRef} className="jp-svg" aria-hidden="true">
        <defs>
          <linearGradient id="jp-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b32b2" />
            <stop offset="1" stopColor="#1488cc" />
          </linearGradient>
        </defs>
        <path ref={lineRef} className="jp-line" stroke="url(#jp-grad)" />
        <path ref={futureLineRef} className="jp-line jp-line--future" stroke="url(#jp-grad)" />
      </svg>
      <ol className="jp-list">
        {items.map((m, i) => (
          <li
            key={m.title}
            className={`jp-item${i % 2 ? ' jp-item--flip' : ''} jp-item--${m.kind}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            <span
              className="jp-node"
              aria-hidden="true"
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
            />
            <Reveal className="jp-reveal">
              <article className="jp-card">
                <div className="jp-meta">
                  <span className="jp-kind">{KIND_LABEL[m.kind]}</span>
                  <span className="jp-date">{m.period}</span>
                </div>
                <h3>{m.title}</h3>
                <p className="jp-org">{m.org}</p>
                {m.points?.length > 0 && (
                  <ul>
                    {m.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
                {m.quote && <p className="jp-quote">“{m.quote}”</p>}
                {m.to && (
                  <Link className="jp-link" to={m.to}>
                    View project ›
                  </Link>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
