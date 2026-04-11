import { useCallback, useEffect, useState } from 'react';
import type { Feedback, FeedbackFilters, FeedbackStatus } from '../types/feedback';
import { useFeedbackFilters } from './useFeedbackFilters';
import { usePersistedFilters } from './usePersistedFilters';

interface UseFeedbackOptions {
  initialItems: Feedback[];
}

export interface UseFeedbackResult {
  items: Feedback[];
  filters: FeedbackFilters;
  filteredItems: Feedback[];
  totalCount: number;
  selectedItem: Feedback | null;
  setFilters: (updated: Partial<FeedbackFilters>) => void;
  updateStatus: (id: string, status: FeedbackStatus) => void;
  selectItem: (item: Feedback | null) => void;
}

export function useFeedback({ initialItems }: UseFeedbackOptions): UseFeedbackResult {
  const [items, setItems] = useState<Feedback[]>(initialItems);
  const [filters, setFilters] = usePersistedFilters();
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);

  useEffect(() => {
    setItems(initialItems);
    setSelectedItem(null);
  }, [initialItems]);

  const { filteredItems, totalCount } = useFeedbackFilters(items, filters);

  const updateStatus = useCallback((id: string, status: FeedbackStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setSelectedItem((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }, []);

  const selectItem = useCallback((item: Feedback | null) => {
    setSelectedItem(item);
  }, []);

  return {
    items,
    filters,
    filteredItems,
    totalCount,
    selectedItem,
    setFilters,
    updateStatus,
    selectItem,
  };
}
