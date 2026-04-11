import type { Translations } from './types';

export const es: Translations = {
  header: {
    title: 'Explorador de Feedback',
    subtitle: 'Bandeja de soporte al cliente',
    datasetSmall: '20 entradas (predeterminado)',
    datasetLarge: '5 000 entradas (prueba de carga)',
  },
  filters: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Nombre de cliente o mensaje…',
    categoryLabel: 'Categoría',
    statusLabel: 'Estado',
    sortLabel: 'Ordenar por',
    allCategories: 'Todas las categorías',
    allStatuses: 'Todos los estados',
    clearFilters: 'Limpiar filtros',
    results: (count) => `${count} ${count === 1 ? 'resultado' : 'resultados'}`,
    sortNewest: 'Más recientes primero',
    sortOldest: 'Más antiguos primero',
    sortPriorityHigh: 'Prioridad: Alta → Baja',
    sortPriorityLow: 'Prioridad: Baja → Alta',
  },
  table: {
    colCustomer: 'Cliente',
    colCategory: 'Categoría',
    colPriority: 'Prioridad',
    colStatus: 'Estado',
    colDate: 'Fecha',
    empty: 'Ningún feedback coincide con los filtros.',
    ariaLabel: 'Lista de feedback',
    viewDetails: (name) => `Ver detalle de ${name}`,
  },
  modal: {
    close: 'Cerrar panel de detalle',
    statusLabel: 'Estado',
    submittedLabel: 'Enviado',
    idLabel: 'ID',
    updateStatus: 'Actualizar estado',
  },
};
