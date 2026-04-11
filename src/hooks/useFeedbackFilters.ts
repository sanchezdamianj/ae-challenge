import { useMemo } from 'react';
import type { Feedback, FeedbackFilters } from '../types/feedback';
import { useDebounce } from './useDebounce';
import { applyFilters } from '../lib/filterFeedback';

interface UseFeedbackFiltersResult {
  filteredItems: Feedback[];
  totalCount: number;
}

export function useFeedbackFilters(
  items: Feedback[],
  filters: FeedbackFilters
): UseFeedbackFiltersResult {
  const debouncedQuery = useDebounce(filters.query, 300);

  const filteredItems = useMemo(() => {
    return applyFilters(items, { ...filters, query: debouncedQuery });
  }, [items, debouncedQuery, filters.category, filters.status, filters.sort]);

  return { filteredItems, totalCount: filteredItems.length };
}
