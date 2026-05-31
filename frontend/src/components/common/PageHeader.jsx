import { cn } from '../../utils/cn';

export const PageHeader = ({ title, description, action, className }) => (
  <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-base text-muted">{description}</p>}
    </div>
    {action}
  </div>
);
