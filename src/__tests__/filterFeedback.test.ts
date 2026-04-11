import { describe, expect, it } from 'vitest';
import {
  applyFilters,
  filterByCategory,
  filterByQuery,
  filterByStatus,
  sortItems,
} from '../lib/filterFeedback';
import type { Feedback } from '../types/feedback';

const makeItem = (overrides: Partial<Feedback>): Feedback => ({
  id: '1',
  customerName: 'Alice Johnson',
  email: 'alice@example.com',
  category: 'Bug',
  message: 'The export button crashes the app.',
  priority: 'High',
  createdAt: '2024-03-01T09:00:00.000Z',
  status: 'Open',
  ...overrides,
});

const ITEMS: Feedback[] = [
  makeItem({ id: '1', customerName: 'Alice Johnson', message: 'Export button crashes', category: 'Bug', priority: 'High', status: 'Open', createdAt: '2024-03-01T00:00:00.000Z' }),
  makeItem({ id: '2', customerName: 'Bob Martinez', message: 'Dark mode request', category: 'Feature Request', priority: 'Low', status: 'Open', createdAt: '2024-03-02T00:00:00.000Z' }),
  makeItem({ id: '3', customerName: 'Carol White', message: 'Charged twice in February', category: 'Billing', priority: 'High', status: 'In Progress', createdAt: '2024-03-03T00:00:00.000Z' }),
  makeItem({ id: '4', customerName: 'David Lee', message: 'Notifications broken on iOS', category: 'Bug', priority: 'Medium', status: 'Resolved', createdAt: '2024-03-04T00:00:00.000Z' }),
];

describe('filterByQuery', () => {
  it('returns all items when query is empty', () => {
    expect(filterByQuery(ITEMS, '')).toHaveLength(4);
  });

  it('returns all items when query is only whitespace', () => {
    expect(filterByQuery(ITEMS, '   ')).toHaveLength(4);
  });

  it('matches by customer name (case-insensitive)', () => {
    const result = filterByQuery(ITEMS, 'alice');
    expect(result).toHaveLength(1);
    expect(result[0].customerName).toBe('Alice Johnson');
  });

  it('matches by partial customer name', () => {
    const result = filterByQuery(ITEMS, 'mart');
    expect(result).toHaveLength(1);
    expect(result[0].customerName).toBe('Bob Martinez');
  });

  it('matches by message content', () => {
    const result = filterByQuery(ITEMS, 'iOS');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('does not search by category field', () => {
    expect(filterByQuery(ITEMS, 'bug')).toHaveLength(0);
  });

  it('trims whitespace from query before matching', () => {
    const result = filterByQuery(ITEMS, '  Alice  ');
    expect(result).toHaveLength(1);
  });

  it('returns empty array when no items match', () => {
    expect(filterByQuery(ITEMS, 'zzznomatch')).toHaveLength(0);
  });

  it('does not mutate the original array', () => {
    const original = [...ITEMS];
    filterByQuery(ITEMS, 'alice');
    expect(ITEMS).toEqual(original);
  });
});

describe('filterByCategory', () => {
  it('returns all items when category is empty string', () => {
    expect(filterByCategory(ITEMS, '')).toHaveLength(4);
  });

  it('filters by Bug category', () => {
    const result = filterByCategory(ITEMS, 'Bug');
    expect(result).toHaveLength(2);
    result.forEach((item) => expect(item.category).toBe('Bug'));
  });

  it('filters by Billing category', () => {
    const result = filterByCategory(ITEMS, 'Billing');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('returns empty array when no items match category', () => {
    expect(filterByCategory(ITEMS, 'Other')).toHaveLength(0);
  });
});

describe('filterByStatus', () => {
  it('returns all items when status is empty string', () => {
    expect(filterByStatus(ITEMS, '')).toHaveLength(4);
  });

  it('filters by Open status', () => {
    const result = filterByStatus(ITEMS, 'Open');
    expect(result).toHaveLength(2);
    result.forEach((item) => expect(item.status).toBe('Open'));
  });

  it('filters by In Progress status', () => {
    const result = filterByStatus(ITEMS, 'In Progress');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by Resolved status', () => {
    const result = filterByStatus(ITEMS, 'Resolved');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });
});

describe('sortItems', () => {
  it('sorts newest first by createdAt descending', () => {
    const result = sortItems(ITEMS, 'newest');
    expect(result[0].id).toBe('4');
    expect(result[result.length - 1].id).toBe('1');
  });

  it('sorts oldest first by createdAt ascending', () => {
    const result = sortItems(ITEMS, 'oldest');
    expect(result[0].id).toBe('1');
    expect(result[result.length - 1].id).toBe('4');
  });

  it('sorts priority-high puts High before Medium before Low', () => {
    const result = sortItems(ITEMS, 'priority-high');
    const priorities = result.map((i) => i.priority);
    expect(priorities.indexOf('High')).toBeLessThan(priorities.indexOf('Medium'));
    expect(priorities.indexOf('Medium')).toBeLessThan(priorities.indexOf('Low'));
  });

  it('sorts priority-low puts Low before Medium before High', () => {
    const result = sortItems(ITEMS, 'priority-low');
    const priorities = result.map((i) => i.priority);
    expect(priorities.indexOf('Low')).toBeLessThan(priorities.indexOf('Medium'));
    expect(priorities.indexOf('Medium')).toBeLessThan(priorities.indexOf('High'));
  });

  it('does not mutate the original array', () => {
    const original = [...ITEMS];
    sortItems(ITEMS, 'newest');
    expect(ITEMS).toEqual(original);
  });
});

describe('applyFilters', () => {
  it('returns all items with default (empty) filters', () => {
    const result = applyFilters(ITEMS, { query: '', category: '', status: '', sort: 'newest' });
    expect(result).toHaveLength(4);
  });

  it('combines query + category filter correctly', () => {
    const result = applyFilters(ITEMS, {
      query: 'crashes',
      category: 'Bug',
      status: '',
      sort: 'newest',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('combines category + status filter correctly', () => {
    const result = applyFilters(ITEMS, {
      query: '',
      category: 'Bug',
      status: 'Resolved',
      sort: 'newest',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('returns empty array when combined filters match nothing', () => {
    const result = applyFilters(ITEMS, {
      query: 'alice',
      category: 'Billing',
      status: '',
      sort: 'newest',
    });
    expect(result).toHaveLength(0);
  });

  it('applies sort after filtering', () => {
    const result = applyFilters(ITEMS, {
      query: '',
      category: 'Bug',
      status: '',
      sort: 'priority-high',
    });
    expect(result[0].priority).toBe('High');
    expect(result[1].priority).toBe('Medium');
  });

  it('handles query with trailing spaces', () => {
    const result = applyFilters(ITEMS, {
      query: 'alice   ',
      category: '',
      status: '',
      sort: 'newest',
    });
    expect(result).toHaveLength(1);
  });
});
