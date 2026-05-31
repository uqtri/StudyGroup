export const Spinner = ({ className = 'h-8 w-8' }) => (
  <div
    className={`${className} animate-spin rounded-full border-4 border-border border-t-transparent`}
    style={{
      borderTopColor: 'var(--gradient-from)',
    }}
  />
);
