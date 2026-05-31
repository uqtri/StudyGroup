export const Spinner = ({ className = 'h-8 w-8' }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`${className} animate-spin rounded-full border-[3px] border-border border-t-primary`}
  />
);
