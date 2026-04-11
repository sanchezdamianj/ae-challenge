import type { FeedbackStatus } from '../types/feedback';

interface StatusBadgeProps {
  status: FeedbackStatus;
}

const STATUS_CLASS: Record<FeedbackStatus, string> = {
  Open: 'badge badge--open',
  'In Progress': 'badge badge--in-progress',
  Resolved: 'badge badge--resolved',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={STATUS_CLASS[status]}>
      {status}
    </span>
  );
}
