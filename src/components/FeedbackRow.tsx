import { memo, useEffect, useRef } from 'react';
import type { Feedback } from '../types/feedback';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface FeedbackRowProps {
  item: Feedback;
  index: number;
  focused: boolean;
  onSelect: (item: Feedback) => void;
  onFocus: (index: number) => void;
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  return isNaN(date.getTime()) ? '—' : DATE_FORMAT.format(date);
}

export const FeedbackRow = memo(function FeedbackRow({
  item,
  index,
  focused,
  onSelect,
  onFocus,
}: FeedbackRowProps) {
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (focused && rowRef.current && document.activeElement !== rowRef.current) {
      rowRef.current.focus();
    }
  }, [focused]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item);
    }
  }

  return (
    <tr
      ref={rowRef}
      className="feedback-row"
      data-index={index}
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus(index)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.customerName}`}
    >
      <td className="feedback-row__cell feedback-row__cell--name">
        <span className="feedback-row__name">{item.customerName}</span>
        <span className="feedback-row__email">{item.email}</span>
      </td>
      <td className="feedback-row__cell">
        <span className="feedback-row__category">{item.category}</span>
      </td>
      <td className="feedback-row__cell">
        <PriorityBadge priority={item.priority} />
      </td>
      <td className="feedback-row__cell">
        <StatusBadge status={item.status} />
      </td>
      <td className="feedback-row__cell feedback-row__cell--date">
        <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
      </td>
    </tr>
  );
});
