import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Feedback, FeedbackStatus } from '../types/feedback';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { useI18n } from '../contexts/I18nContext';

const STATUSES: FeedbackStatus[] = ['Open', 'In Progress', 'Resolved'];

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

interface FeedbackDetailModalProps {
  item: Feedback;
  onClose: () => void;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
}

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function FeedbackDetailModal({ item, onClose, onStatusChange }: FeedbackDetailModalProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable?.[0]?.focus();
    return () => {
      document.body.style.overflow = '';
      (previouslyFocusedRef.current as HTMLElement | null)?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ?? []
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formattedDate = (() => {
    const d = new Date(item.createdAt);
    return isNaN(d.getTime()) ? item.createdAt : DATE_FORMAT.format(d);
  })();

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <div className="modal__header-meta">
            <PriorityBadge priority={item.priority} />
            <span className="modal__category">{item.category}</span>
          </div>
          <button className="modal__close" onClick={onClose} aria-label={t.modal.close}>
            ✕
          </button>
        </div>

        <div className="modal__body">
          <h2 id="modal-title" className="modal__customer">{item.customerName}</h2>
          <a className="modal__email" href={`mailto:${encodeURIComponent(item.email)}`}>
            {item.email}
          </a>
          <p className="modal__message">{item.message}</p>
          <dl className="modal__meta">
            <div className="modal__meta-row">
              <dt>{t.modal.statusLabel}</dt>
              <dd><StatusBadge status={item.status} /></dd>
            </div>
            <div className="modal__meta-row">
              <dt>{t.modal.submittedLabel}</dt>
              <dd><time dateTime={item.createdAt}>{formattedDate}</time></dd>
            </div>
            <div className="modal__meta-row">
              <dt>{t.modal.idLabel}</dt>
              <dd className="modal__id">#{item.id}</dd>
            </div>
          </dl>
        </div>

        <div className="modal__footer">
          <fieldset className="modal__status-fieldset">
            <legend className="modal__status-legend">{t.modal.updateStatus}</legend>
            <div className="modal__status-options">
              {STATUSES.map((s) => (
                <label key={s} className="modal__status-label">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={item.status === s}
                    onChange={() => onStatusChange(item.id, s)}
                    className="modal__status-radio"
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>,
    document.body
  );
}
