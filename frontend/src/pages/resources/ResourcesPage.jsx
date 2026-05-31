import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Folder, Search } from 'lucide-react';
import { resourceFolderApi } from '../../api/resourceFolderApi';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { ResourcesPageSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { formatDate } from '../../utils/formatDate';

export const ResourcesPage = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['resource-folders', search],
    queryFn: () =>
      resourceFolderApi
        .list({ limit: 50, myGroups: 'true' })
        .then((r) => r.data.data),
  });

  const folders = (data?.items || []).filter(
    (folder) =>
      !search ||
      folder.name.toLowerCase().includes(search.toLowerCase()) ||
      folder.description?.toLowerCase().includes(search.toLowerCase()) ||
      folder.group?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <ResourcesPageSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Resources"
        description="Shared study materials from your groups — open a folder in its group"
      />

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search folders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            to={`/groups/${folder.group?.id}?tab=Resources`}
            className="block transition hover:opacity-95"
          >
            <Card className="h-full transition hover:border-primary/40">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Folder size={20} strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{folder.name}</h3>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {folder.group?.name}
                  </p>
                  {folder.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {folder.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {folder._count?.resources ?? 0} files · by{' '}
                    {folder.creator?.fullName} · {formatDate(folder.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {!folders.length && <p className="text-muted">No resource folders yet.</p>}
    </div>
  );
};
