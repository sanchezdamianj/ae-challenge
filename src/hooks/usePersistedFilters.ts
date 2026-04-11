import { useCallback, useState } from 'react';
import type { FeedbackFilters } from '../types/feedback';

const STORAGE_KEY = 'feedback-explorer:filters';
const SCHEMA_VERSION = 1;

interface PersistedShape {
  v: number;
  filters: FeedbackFilters;
}

const DEFAULT_FILTERS: FeedbackFilters = {
  query: '',
  category: '',
  status: '',
  sort: 'newest',
};

function loadFromStorage(): FeedbackFilters {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as PersistedShape).v !== SCHEMA_VERSION
    ) {
      return DEFAULT_FILTERS;
    }

    return (parsed as PersistedShape).filters ?? DEFAULT_FILTERS;
  } catch {
    return DEFAULT_FILTERS;
  }
}

function saveToStorage(filters: FeedbackFilters): void {
  try {
    const payload: PersistedShape = { v: SCHEMA_VERSION, filters };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // intentionally silent
  }
}

export function usePersistedFilters(): [FeedbackFilters, (updated: Partial<FeedbackFilters>) => void] {
  const [filters, setFiltersState] = useState<FeedbackFilters>(loadFromStorage);

  const setFilters = useCallback((updated: Partial<FeedbackFilters>) => {
    setFiltersState((prev) => {
      const next = { ...prev, ...updated };
      saveToStorage(next);
      return next;
    });
  }, []);

  return [filters, setFilters];
}
