import type { Translations } from './types';

export const en: Translations = {
  header: {
    title: 'Feedback Explorer',
    subtitle: 'Customer support inbox',
    datasetSmall: '20 entries (default)',
    datasetLarge: '5 000 entries (stress test)',
  },
  filters: {
    searchLabel: 'Search',
    searchPlaceholder: 'Customer name or message…',
    categoryLabel: 'Category',
    statusLabel: 'Status',
    sortLabel: 'Sort by',
    allCategories: 'All categories',
    allStatuses: 'All statuses',
    clearFilters: 'Clear filters',
    results: (count) => `${count} ${count === 1 ? 'result' : 'results'}`,
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortPriorityHigh: 'Priority: High → Low',
    sortPriorityLow: 'Priority: Low → High',
  },
  table: {
    colCustomer: 'Customer',
    colCategory: 'Category',
    colPriority: 'Priority',
    colStatus: 'Status',
    colDate: 'Date',
    empty: 'No feedback matches your filters.',
    ariaLabel: 'Feedback list',
    viewDetails: (name) => `View details for ${name}`,
  },
  modal: {
    close: 'Close detail panel',
    statusLabel: 'Status',
    submittedLabel: 'Submitted',
    idLabel: 'ID',
    updateStatus: 'Update status',
  },
};
