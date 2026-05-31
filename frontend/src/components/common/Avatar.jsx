import { cn } from '../../utils/cn';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar = ({ src, name, size = 'sm', className }) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary',
      sizes[size],
      className,
    )}
    aria-hidden={!name}
  >
    {src ? (
      <img src={src} alt={name || ''} className="h-full w-full object-cover" />
    ) : (
      getInitials(name)
    )}
  </div>
);
