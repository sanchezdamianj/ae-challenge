import type { FeedbackPriority } from '../types/feedback';

interface PriorityBadgeProps {
  priority: FeedbackPriority;
}

const PRIORITY_CLASS: Record<FeedbackPriority, string> = {
  High: 'priority priority--high',
  Medium: 'priority priority--medium',
  Low: 'priority priority--low',
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={PRIORITY_CLASS[priority]}>
      <span className="priority__dot" aria-hidden="true" />
      {priority}
    </span>
  );
}
