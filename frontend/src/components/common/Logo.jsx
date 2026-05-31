import { cn } from '../../utils/cn';

export const Logo = ({ className, as: Tag = 'span', ...props }) => (
  <Tag className={cn('font-bold tracking-tight text-foreground', className)} {...props}>
    Study<span className="text-primary">Hub</span>
  </Tag>
);
