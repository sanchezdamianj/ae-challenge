import { memo } from 'react';
import type { Feedback } from '../types/feedback';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface FeedbackCardProps {
  item: Feedback;
  onSelect: (item: Feedback) => void;
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

export const FeedbackCard = memo(function FeedbackCard({ item, onSelect }: FeedbackCardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item);
    }
  }

  return (
    <article
      className="feedback-card"
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.customerName}`}
    >
      <div className="feedback-card__top">
        <div className="feedback-card__badges">
          <PriorityBadge priority={item.priority} />
          <StatusBadge status={item.status} />
        </div>
        <time className="feedback-card__date" dateTime={item.createdAt}>
          {formatDate(item.createdAt)}
        </time>
      </div>

      <div className="feedback-card__customer">
        <span className="feedback-card__name">{item.customerName}</span>
        <span className="feedback-card__category">{item.category}</span>
      </div>

      <p className="feedback-card__message">{item.message}</p>
    </article>
  );
});
