export type FeedbackCategory = 'Bug' | 'Feature Request' | 'Billing' | 'Other';

export type FeedbackPriority = 'Low' | 'Medium' | 'High';

export type FeedbackStatus = 'Open' | 'In Progress' | 'Resolved';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'priority-high'
  | 'priority-low';

export interface Feedback {
  id: string;
  customerName: string;
  email: string;
  category: FeedbackCategory;
  message: string;
  priority: FeedbackPriority;
  createdAt: string;
  status: FeedbackStatus;
}

export interface FeedbackFilters {
  query: string;
  category: FeedbackCategory | '';
  status: FeedbackStatus | '';
  sort: SortOption;
}
