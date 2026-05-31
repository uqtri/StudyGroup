import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { resourceApi } from '../../api/resourceApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { formatDate } from '../../utils/formatDate';

export const ResourcesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourceApi.list({ limit: 50, myGroups: 'true' }).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const resources = data?.items || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Shared Resources</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((r) => (
          <Card key={r.id}>
            <h3 className="font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-muted">{r.group?.name}</p>
            <p className="mt-2 line-clamp-2 text-sm">{r.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>{formatDate(r.createdAt)}</span>
              <a
                href={r.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Open <ExternalLink size={12} />
              </a>
            </div>
          </Card>
        ))}
      </div>
      {!resources.length && <p className="text-muted">No resources yet.</p>}
    </div>
  );
};
