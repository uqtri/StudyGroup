import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ExternalLink } from 'lucide-react';
import { resourceApi } from '../../api/resourceApi';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { ResourcesPageSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { ResourceStarRating } from '../../components/resources/ResourceStarRating';
import { formatDate } from '../../utils/formatDate';

export const ResourcesPage = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['resources', search],
    queryFn: () =>
      resourceApi
        .list({ limit: 50, myGroups: 'true' })
        .then((r) => r.data.data),
  });

  const starMutation = useMutation({
    mutationFn: (id) => resourceApi.toggleStar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] }),
  });

  const resources = (data?.items || []).filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <ResourcesPageSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Resources"
        description="Shared study materials from your groups — upload via a group folder"
      />

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((r) => (
          <Card key={r.id}>
            <h3 className="font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {r.group?.name}
              {r.folder?.name ? ` · ${r.folder.name}` : ''}
            </p>
            <p className="mt-2 line-clamp-2 text-sm">{r.description}</p>
            <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted">
              <div className="flex items-center gap-2">
                <ResourceStarRating
                  starCount={r.starCount}
                  starredByMe={r.starredByMe}
                  onToggle={() => starMutation.mutate(r.id)}
                  loading={starMutation.isPending}
                />
                <span>{formatDate(r.createdAt)}</span>
              </div>
              <a
                href={r.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Download <ExternalLink size={12} />
              </a>
            </div>
          </Card>
        ))}
      </div>
      {!resources.length && <p className="text-muted">No resources yet.</p>}
    </div>
  );
};
