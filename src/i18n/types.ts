export type Locale = 'en' | 'es';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    datasetSmall: string;
    datasetLarge: string;
  };
  filters: {
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    statusLabel: string;
    sortLabel: string;
    allCategories: string;
    allStatuses: string;
    clearFilters: string;
    results: (count: number) => string;
    sortNewest: string;
    sortOldest: string;
    sortPriorityHigh: string;
    sortPriorityLow: string;
  };
  table: {
    colCustomer: string;
    colCategory: string;
    colPriority: string;
    colStatus: string;
    colDate: string;
    empty: string;
    ariaLabel: string;
    viewDetails: (name: string) => string;
  };
  modal: {
    close: string;
    statusLabel: string;
    submittedLabel: string;
    idLabel: string;
    updateStatus: string;
  };
}
