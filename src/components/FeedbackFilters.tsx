import { useI18n } from '../contexts/I18nContext';
import type { FeedbackCategory, FeedbackFilters, FeedbackStatus, SortOption } from '../types/feedback';

interface FeedbackFiltersProps {
  filters: FeedbackFilters;
  totalCount: number;
  onChange: (updated: Partial<FeedbackFilters>) => void;
}

const CATEGORIES: FeedbackCategory[] = ['Bug', 'Feature Request', 'Billing', 'Other'];
const STATUSES: FeedbackStatus[] = ['Open', 'In Progress', 'Resolved'];

export function FeedbackFilters({ filters, totalCount, onChange }: FeedbackFiltersProps) {
  const { t } = useI18n();

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t.filters.sortNewest },
    { value: 'oldest', label: t.filters.sortOldest },
    { value: 'priority-high', label: t.filters.sortPriorityHigh },
    { value: 'priority-low', label: t.filters.sortPriorityLow },
  ];

  const hasActiveFilters =
    filters.query !== '' || filters.category !== '' || filters.status !== '';

  function handleReset() {
    onChange({ query: '', category: '', status: '', sort: 'newest' });
  }

  return (
    <div className="filters" role="search" aria-label={t.filters.searchLabel}>
      <div className="filters-row">
        <div className="filter-group filter-group--search">
          <label htmlFor="search" className="filter-label">
            {t.filters.searchLabel}
          </label>
          <input
            id="search"
            type="search"
            className="filter-input"
            placeholder={t.filters.searchPlaceholder}
            value={filters.query}
            maxLength={100}
            onChange={(e) => onChange({ query: e.target.value })}
            aria-label={t.filters.searchPlaceholder}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category" className="filter-label">
            {t.filters.categoryLabel}
          </label>
          <select
            id="category"
            className="filter-select"
            value={filters.category}
            onChange={(e) =>
              onChange({ category: e.target.value as FeedbackCategory | '' })
            }
          >
            <option value="">{t.filters.allCategories}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status" className="filter-label">
            {t.filters.statusLabel}
          </label>
          <select
            id="status"
            className="filter-select"
            value={filters.status}
            onChange={(e) =>
              onChange({ status: e.target.value as FeedbackStatus | '' })
            }
          >
            <option value="">{t.filters.allStatuses}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort" className="filter-label">
            {t.filters.sortLabel}
          </label>
          <select
            id="sort"
            className="filter-select"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-meta">
        <span className="filters-count" aria-live="polite" aria-atomic="true">
          {t.filters.results(totalCount)}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="filters-reset"
            onClick={handleReset}
            aria-label={t.filters.clearFilters}
          >
            {t.filters.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}
