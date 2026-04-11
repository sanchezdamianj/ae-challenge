import type { Feedback, FeedbackCategory, FeedbackFilters, FeedbackStatus, SortOption } from '../types/feedback';

const PRIORITY_WEIGHT: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function filterByQuery(items: Feedback[], query: string): Feedback[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.customerName.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
  );
}

export function filterByCategory(items: Feedback[], category: FeedbackCategory | ''): Feedback[] {
  if (!category) return items;
  return items.filter((item) => item.category === category);
}

export function filterByStatus(items: Feedback[], status: FeedbackStatus | ''): Feedback[] {
  if (!status) return items;
  return items.filter((item) => item.status === status);
}

export function sortItems(items: Feedback[], sort: SortOption): Feedback[] {
  const sorted = [...items];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'priority-high':
      return sorted.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
    case 'priority-low':
      return sorted.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
    default:
      return sorted;
  }
}

export function applyFilters(items: Feedback[], filters: FeedbackFilters): Feedback[] {
  let result = filterByQuery(items, filters.query);
  result = filterByCategory(result, filters.category);
  result = filterByStatus(result, filters.status);
  return sortItems(result, filters.sort);
}
