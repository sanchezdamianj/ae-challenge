import type { Feedback } from '../types/feedback';
import { FeedbackCard } from './FeedbackCard';

interface FeedbackCardListProps {
  items: Feedback[];
  onSelect: (item: Feedback) => void;
}

export function FeedbackCardList({ items, onSelect }: FeedbackCardListProps) {
  if (items.length === 0) {
    return (
      <div className="card-list__empty" role="status">
        No feedback matches your filters.
      </div>
    );
  }

  return (
    <div className="card-list" role="list" aria-label="Feedback list">
      {items.map((item) => (
        <div key={item.id} role="listitem">
          <FeedbackCard item={item} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
