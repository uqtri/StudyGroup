import { Skeleton } from '@/components/ui/skeleton';

export const PageHeaderSkeleton = ({ withAction = true }) => (
  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
    {withAction && <Skeleton className="h-10 w-36 rounded-[var(--radius-control)]" />}
  </div>
);

export const CardGridSkeleton = ({ count = 6, columns = 'sm:grid-cols-2 lg:grid-cols-3' }) => (
  <div className={`grid gap-6 ${columns}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="surface-panel flex flex-col gap-3 p-6"
      >
        <Skeleton className="h-14 w-14 rounded-[var(--radius-card)]" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-auto flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-[var(--radius-control)]" />
          <Skeleton className="h-10 flex-1 rounded-[var(--radius-control)]" />
        </div>
      </div>
    ))}
  </div>
);

export const ListCardsSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface-panel p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const SessionCardSkeleton = () => (
  <div className="surface-panel p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-56 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20 rounded-[var(--radius-control)]" />
        <Skeleton className="h-8 w-28 rounded-[var(--radius-control)]" />
        <Skeleton className="h-8 w-16 rounded-[var(--radius-control)]" />
      </div>
    </div>
  </div>
);

export const FolderGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface-panel p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ResourceFileListSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface-panel flex items-center gap-3 p-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-7 w-12 rounded-lg" />
      </div>
    ))}
  </div>
);

export const FolderDetailSkeleton = () => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-32 rounded-[var(--radius-control)]" />
    </div>
    <div className="surface-panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
    </div>
    <ResourceFileListSkeleton count={5} />
  </div>
);

export const GroupResourcesTabSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-end">
      <Skeleton className="h-10 w-44 rounded-[var(--radius-control)]" />
    </div>
    <FolderGridSkeleton />
  </div>
);

export const GroupSessionsTabSkeleton = ({ canManage = false, count = 4 }) => (
  <div className="space-y-3">
    {canManage && (
      <Skeleton className="h-10 w-44 rounded-[var(--radius-control)]" />
    )}
    {Array.from({ length: count }).map((_, i) => (
      <SessionCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 6, cols = 4 }) => (
  <div className="surface-panel overflow-hidden p-6">
    <div className="mb-4 flex gap-4 border-b border-border pb-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, row) => (
      <div key={row} className="flex gap-4 border-b border-border py-4 last:border-0">
        {Array.from({ length: cols }).map((_, col) => (
          <Skeleton key={col} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const StatCardsSkeleton = ({ count = 4 }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface-panel p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-20" />
      </div>
    ))}
  </div>
);

export const ChartGridSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="surface-panel p-6">
      <Skeleton className="mb-4 h-5 w-40" />
      <Skeleton className="mx-auto h-48 w-48 rounded-full" />
    </div>
    <div className="surface-panel p-6">
      <Skeleton className="mb-4 h-5 w-40" />
      <div className="flex h-48 items-end gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${40 + (i % 3) * 20}%` }} />
        ))}
      </div>
    </div>
  </div>
);

export const GroupDetailSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-[var(--radius-control)]" />
        <Skeleton className="h-10 w-28 rounded-[var(--radius-control)]" />
      </div>
    </div>
    <div className="mb-6 flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-lg" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="surface-panel p-6">
        <Skeleton className="mb-4 h-5 w-20" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="surface-panel p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const SessionDetailSkeleton = () => (
  <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-[var(--radius-control)]" />
        <Skeleton className="h-10 w-28 rounded-[var(--radius-control)]" />
      </div>
    </div>
    <div className="surface-panel p-6">
      <Skeleton className="mb-4 h-5 w-24" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
    <div className="surface-panel p-6">
      <Skeleton className="mb-4 h-5 w-28" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const MyGroupsSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <PageHeaderSkeleton withAction={false} />
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-6 w-48" />
        <CardGridSkeleton count={4} columns="sm:grid-cols-2" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <ListCardsSkeleton count={3} />
      </div>
    </div>
  </div>
);

export const AdminDashboardSkeleton = () => (
  <div className="space-y-6">
    <StatCardsSkeleton />
    <ChartGridSkeleton />
    <TableSkeleton rows={4} cols={4} />
  </div>
);

export const MeetingRoomSkeleton = () => (
  <div className="flex h-[calc(100vh-4rem)] flex-col">
    <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <div className="space-y-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded-[var(--radius-control)]" />
    </div>
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-elevated p-8">
      <Skeleton className="h-64 w-full max-w-3xl rounded-xl" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

export const FilterBarSkeleton = () => (
  <div className="mb-8 grid gap-4 sm:grid-cols-3">
    <Skeleton className="h-10 w-full rounded-[var(--radius-control)]" />
    <Skeleton className="h-10 w-full rounded-[var(--radius-control)]" />
    <Skeleton className="h-10 w-full rounded-[var(--radius-control)]" />
  </div>
);

export const GroupsPageSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <PageHeaderSkeleton />
    <FilterBarSkeleton />
    <CardGridSkeleton />
  </div>
);

export const SessionsPageSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <PageHeaderSkeleton />
    <ListCardsSkeleton count={6} />
  </div>
);

export const ResourcesPageSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <PageHeaderSkeleton />
    <CardGridSkeleton count={4} columns="sm:grid-cols-2" />
  </div>
);

export const DiscussionsPageSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <PageHeaderSkeleton />
    <ListCardsSkeleton count={5} />
  </div>
);

export const DiscussionPostSkeleton = () => (
  <div className="surface-panel overflow-hidden p-0">
    <div className="flex gap-3 p-4 sm:p-5">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-3/4 max-w-md" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-28 rounded-[var(--radius-control)]" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  </div>
);

export const GroupDiscussionsTabSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-48 rounded-[var(--radius-control)]" />
    </div>
    {Array.from({ length: count }).map((_, i) => (
      <DiscussionPostSkeleton key={i} />
    ))}
  </div>
);

export const DiscussionCommentsSkeleton = ({ count = 4 }) => (
  <div className="space-y-6">
    <div className="flex gap-2">
      <Skeleton className="h-7 w-16 rounded-lg" />
      <Skeleton className="h-7 w-14 rounded-lg" />
    </div>
    <Skeleton className="h-20 w-full rounded-xl" />
    <Skeleton className="h-9 w-24 rounded-[var(--radius-control)]" />
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-3 w-5" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export const DiscussionDetailSkeleton = () => (
  <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
    <Skeleton className="h-4 w-40" />
    <DiscussionPostSkeleton />
    <DiscussionCommentsSkeleton count={3} />
  </div>
);

export const GroupManageSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <Skeleton className="h-8 w-64" />
    <div className="mt-6 flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-lg" />
      ))}
    </div>
    <div className="mt-6 surface-panel p-6">
      <Skeleton className="mb-4 h-5 w-32" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="mt-4 h-4 w-48" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <PageHeaderSkeleton withAction={false} />
    <StatCardsSkeleton count={3} />
    <div className="mt-6">
      <ListCardsSkeleton count={4} />
    </div>
  </div>
);

export const AdminAnalyticsSkeleton = () => (
  <div className="space-y-6">
    <ChartGridSkeleton />
    <ChartGridSkeleton />
  </div>
);

export const NotificationListSkeleton = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <li key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-1.5 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-5/6" />
        <Skeleton className="mt-2 h-2.5 w-20" />
      </li>
    ))}
  </>
);
