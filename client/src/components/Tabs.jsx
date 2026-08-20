import { cn } from '../utils/cn';

/**
 * Controlled underline tab strip (wireframe 5a / the Priority filter row).
 * items: array of strings, or { key, label, count }.
 */
const Tabs = ({ items = [], value, onChange, className }) => {
  const normalized = items.map((item) =>
    typeof item === 'string' ? { key: item, label: item } : item
  );

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-2 border-b-2 border-border overflow-x-auto overflow-y-hidden custom-scrollbar',
        className
      )}
    >
      {normalized.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange?.(item.key)}
            className={cn('tab', active && 'tab-active')}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span className={cn('ml-6 font-black', active ? 'text-primary' : 'text-slate-300')}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
