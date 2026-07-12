import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WorkflowSvg } from './Workflow.jsx';

const MIN = 0.25;
const MAX = 5;

// Centered modal that floats over the current page with the surrounding area blurred
// (not a full-screen takeover). Styled in the site's light theme. Wheel/pinch + buttons
// zoom, drag to pan, Esc / backdrop / ✕ to close. Focus-trapped, body-scroll-locked,
// rendered in a portal so no transformed/overflow ancestor can clip it.
export default function WorkflowLightbox({ layout, caption, title, onClose }) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dialogRef = useRef(null);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);

  const fit = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const s = Math.max(MIN, Math.min((rect.width - 48) / layout.width, (rect.height - 48) / layout.height, 1.8));
    setScale(s);
    setTx((rect.width - layout.width * s) / 2);
    setTy((rect.height - layout.height * s) / 2);
  }, [layout]);

  // Fit once on open.
  useEffect(() => {
    fit();
  }, [fit]);

  // Body scroll lock, focus management, Esc-to-close.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, [onClose]);

  // Zoom keeping the point (cx,cy) under the cursor fixed.
  const zoomAt = useCallback((factor, cx, cy) => {
    setScale((prev) => {
      const next = Math.min(MAX, Math.max(MIN, prev * factor));
      const ratio = next / prev;
      setTx((t) => cx - ratio * (cx - t));
      setTy((t) => cy - ratio * (cy - t));
      return next;
    });
  }, []);

  // Native non-passive wheel listener so preventDefault is allowed.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - rect.left, e.clientY - rect.top);
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    setTx(d.tx + (e.clientX - d.x));
    setTy(d.ty + (e.clientY - d.y));
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const btnZoom = (factor) => {
    const rect = viewportRef.current.getBoundingClientRect();
    zoomAt(factor, rect.width / 2, rect.height / 2);
  };

  const onKeyDownTrap = (e) => {
    if (e.key !== 'Tab') return;
    const f = dialogRef.current.querySelectorAll('button');
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    // Backdrop: dims + blurs the page behind. Clicking it (outside the card) closes.
    <div
      className="wf-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wf-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} workflow`}
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={onKeyDownTrap}
      >
        <div className="wf-modal__bar">
          <span className="wf-modal__title">
            {title} <span className="wf-modal__title-sub">Workflow</span>
          </span>
          <div className="wf-modal__controls">
            <button type="button" className="wf-ctl" onClick={() => btnZoom(1 / 1.25)} aria-label="Zoom out">
              &minus;
            </button>
            <button type="button" className="wf-ctl wf-ctl--text" onClick={fit} aria-label="Fit to screen">
              Fit
            </button>
            <button type="button" className="wf-ctl" onClick={() => btnZoom(1.25)} aria-label="Zoom in">
              +
            </button>
            <button type="button" className="wf-ctl wf-ctl--close" onClick={onClose} aria-label="Close workflow">
              ✕
            </button>
          </div>
        </div>

        <div
          className="wf-modal__viewport"
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="wf-modal__zoom"
            style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: '0 0' }}
          >
            <WorkflowSvg layout={layout} uid="wf-zoom" />
          </div>
        </div>

        <div className="wf-modal__foot">
          {caption && <p className="wf-modal__caption">{caption}</p>}
          <p className="wf-modal__hint">Scroll to zoom · drag to pan · Esc to close</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
