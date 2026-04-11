import type { Feedback } from '../types/feedback';
import { FeedbackCard } from './FeedbackCard';
import { useI18n } from '../contexts/I18nContext';

interface FeedbackCardListProps {
  items: Feedback[];
  onSelect: (item: Feedback) => void;
}

export function FeedbackCardList({ items, onSelect }: FeedbackCardListProps) {
  const { t } = useI18n();

  if (items.length === 0) {
    return (
      <div className="card-list__empty" role="status">
        {t.table.empty}
      </div>
    );
  }

  return (
    <div className="card-list" role="list" aria-label={t.table.ariaLabel}>
      {items.map((item) => (
        <div key={item.id} role="listitem">
          <FeedbackCard item={item} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
