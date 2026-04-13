import type { FeedbackCategory, FeedbackFilters, FeedbackStatus, SortOption } from '../types/feedback';

interface FeedbackFiltersProps {
  filters: FeedbackFilters;
  totalCount: number;
  onChange: (updated: Partial<FeedbackFilters>) => void;
}

const CATEGORIES: FeedbackCategory[] = ['Bug', 'Feature Request', 'Billing', 'Other'];
const STATUSES: FeedbackStatus[] = ['Open', 'In Progress', 'Resolved'];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority-high', label: 'Priority: High to Low' },
  { value: 'priority-low', label: 'Priority: Low to High' },
];

export function FeedbackFilters({ filters, totalCount, onChange }: FeedbackFiltersProps) {
  const hasActiveFilters =
    filters.query !== '' ||
    filters.category !== '' ||
    filters.status !== '' ||
    filters.sort !== 'newest';

  function handleReset() {
    onChange({ query: '', category: '', status: '', sort: 'newest' });
  }

  return (
    <div className="filters" role="search" aria-label="Feedback filters">
      <div className="filters-row">
        <div className="filter-group filter-group--search">
          <label htmlFor="search" className="filter-label">
            Search
          </label>
          <input
            id="search"
            type="search"
            className="filter-input"
            placeholder="Customer name or message..."
            value={filters.query}
            maxLength={100}
            onChange={(e) => onChange({ query: e.target.value })}
            aria-label="Search by customer name or message"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category" className="filter-label">
            Category
          </label>
          <select
            id="category"
            className="filter-select"
            value={filters.category}
            onChange={(e) =>
              onChange({ category: e.target.value as FeedbackCategory | '' })
            }
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status" className="filter-label">
            Status
          </label>
          <select
            id="status"
            className="filter-select"
            value={filters.status}
            onChange={(e) =>
              onChange({ status: e.target.value as FeedbackStatus | '' })
            }
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort" className="filter-label">
            Sort by
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
          {totalCount} {totalCount === 1 ? 'result' : 'results'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="filters-reset"
            onClick={handleReset}
            aria-label="Clear filters"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
