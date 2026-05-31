import { Folder } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

export const FolderDetailHeader = ({ folder, fileCount }) => (
  <div className="overflow-hidden rounded-[var(--radius-card)] border border-primary/15 bg-gradient-to-br from-primary/8 via-surface to-surface shadow-soft">
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
          <Folder size={26} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Resource folder
          </p>
          <h2 className="mt-1 truncate text-xl font-semibold text-foreground">
            {folder.name}
          </h2>
          {folder.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {folder.description}
            </p>
          ) : (
            <p className="mt-2 text-sm italic text-muted">No description</p>
          )}
        </div>
      </div>

      <dl className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-1 sm:text-right">
        <div className="rounded-xl border border-border/60 bg-surface/80 px-3 py-2">
          <dt className="text-[10px] font-medium uppercase tracking-wide text-muted">Files</dt>
          <dd className="text-lg font-semibold text-foreground">{fileCount}</dd>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/80 px-3 py-2">
          <dt className="text-[10px] font-medium uppercase tracking-wide text-muted">Created</dt>
          <dd className={cn('text-sm font-medium text-foreground')}>
            {formatDate(folder.createdAt)}
          </dd>
        </div>
      </dl>
    </div>

    {folder.creator?.fullName && (
      <div className="border-t border-primary/10 bg-primary/5 px-5 py-2.5 text-xs text-muted">
        Created by <span className="font-medium text-foreground">{folder.creator.fullName}</span>
      </div>
    )}
  </div>
);
