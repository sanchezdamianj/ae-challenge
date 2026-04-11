import { memo, useCallback, useRef, useState } from 'react';
import type { Feedback } from '../types/feedback';
import { FeedbackRow } from './FeedbackRow';
import { useI18n } from '../contexts/I18nContext';

// Must match the `.feedback-row` height defined in App.css
const ROW_HEIGHT = 64;
const OVERSCAN = 5;
const DEFAULT_CONTAINER_HEIGHT = 560;

interface FeedbackTableProps {
  items: Feedback[];
  onSelect: (item: Feedback) => void;
  containerHeight?: number;
}

function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={5} className="feedback-table__empty" role="status">
        {message}
      </td>
    </tr>
  );
}

export const FeedbackTable = memo(function FeedbackTable({
  items,
  onSelect,
  containerHeight = DEFAULT_CONTAINER_HEIGHT,
}: FeedbackTableProps) {
  const { t } = useI18n();
  const [scrollTop, setScrollTop] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setScrollTop(top));
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rowTop = index * ROW_HEIGHT;
    const rowBottom = rowTop + ROW_HEIGHT;
    if (rowTop < container.scrollTop) {
      container.scrollTop = rowTop;
      setScrollTop(rowTop);
    } else if (rowBottom > container.scrollTop + containerHeight) {
      const newTop = rowBottom - containerHeight;
      container.scrollTop = newTop;
      setScrollTop(newTop);
    }
  }, [containerHeight]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    if (items.length === 0) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const current = focusedIndex < 0 ? 0 : focusedIndex;
    const next =
      e.key === 'ArrowDown'
        ? Math.min(current + 1, items.length - 1)
        : Math.max(current - 1, 0);
    scrollToIndex(next);
    setFocusedIndex(next);
  }, [items.length, focusedIndex, scrollToIndex]);

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN
  );
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const paddingTop = startIndex * ROW_HEIGHT;
  const paddingBottom = Math.max(0, (items.length - endIndex - 1) * ROW_HEIGHT);

  return (
    <div
      ref={containerRef}
      className="feedback-table-container"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      role="region"
      aria-label={t.table.ariaLabel}
    >
      <table className="feedback-table">
        <thead className="feedback-table__head">
          <tr>
            <th scope="col" className="feedback-table__th feedback-table__th--name">{t.table.colCustomer}</th>
            <th scope="col" className="feedback-table__th">{t.table.colCategory}</th>
            <th scope="col" className="feedback-table__th">{t.table.colPriority}</th>
            <th scope="col" className="feedback-table__th">{t.table.colStatus}</th>
            <th scope="col" className="feedback-table__th feedback-table__th--date">{t.table.colDate}</th>
          </tr>
        </thead>
        <tbody onKeyDown={handleKeyDown}>
          {items.length === 0 ? (
            <EmptyState message={t.table.empty} />
          ) : (
            <>
              {paddingTop > 0 && (
                <tr style={{ height: paddingTop }} aria-hidden="true">
                  <td colSpan={5} />
                </tr>
              )}
              {visibleItems.map((item, i) => (
                <FeedbackRow
                  key={item.id}
                  item={item}
                  index={startIndex + i}
                  focused={focusedIndex === startIndex + i}
                  onSelect={onSelect}
                  onFocus={setFocusedIndex}
                />
              ))}
              {paddingBottom > 0 && (
                <tr style={{ height: paddingBottom }} aria-hidden="true">
                  <td colSpan={5} />
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
});
