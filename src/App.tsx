import { useState } from 'react';
import { useFeedback } from './hooks/useFeedback';
import { FeedbackFilters } from './components/FeedbackFilters';
import { FeedbackTable } from './components/FeedbackTable';
import { FeedbackCardList } from './components/FeedbackCardList';
import { FeedbackDetailModal } from './components/FeedbackDetailModal';
import { mockFeedback, generateLargeDataset } from './data/mockFeedback';
import { useI18n } from './contexts/I18nContext';
import { useMediaQuery } from './hooks/useMediaQuery';
import './App.css';

const SMALL_DATASET = mockFeedback;

let largeDatasetCache: ReturnType<typeof generateLargeDataset> | null = null;
function getLargeDataset() {
  return (largeDatasetCache ??= generateLargeDataset(5000));
}

export default function App() {
  const { t, locale, setLocale } = useI18n();
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [isLargeDataset, setIsLargeDataset] = useState(false);

  const {
    filters,
    filteredItems,
    totalCount,
    selectedItem,
    setFilters,
    updateStatus,
    selectItem,
  } = useFeedback({ initialItems: isLargeDataset ? getLargeDataset() : SMALL_DATASET });

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <div className="app__title-group">
            <h1 className="app__title">{t.header.title}</h1>
            <p className="app__subtitle">{t.header.subtitle}</p>
          </div>
          <div className="app__header-actions">
            <button
              className="app__locale-toggle"
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              aria-label={locale === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            >
              {locale === 'en' ? 'ES' : 'EN'}
            </button>
            <button
              className={`app__dataset-toggle ${isLargeDataset ? 'app__dataset-toggle--active' : ''}`}
              onClick={() => setIsLargeDataset((v) => !v)}
              aria-pressed={isLargeDataset}
            >
              {isLargeDataset ? t.header.datasetLarge : t.header.datasetSmall}
            </button>
          </div>
        </div>
      </header>

      <main className="app__main">
        <FeedbackFilters
          filters={filters}
          totalCount={totalCount}
          onChange={setFilters}
        />
        {isMobile ? (
          <FeedbackCardList items={filteredItems} onSelect={selectItem} />
        ) : (
          <FeedbackTable items={filteredItems} onSelect={selectItem} />
        )}
      </main>

      {selectedItem && (
        <FeedbackDetailModal
          item={selectedItem}
          onClose={() => selectItem(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}
