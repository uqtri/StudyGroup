import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Upload, ExternalLink } from 'lucide-react';
import { resourceApi } from '../../api/resourceApi';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatDate } from '../../utils/formatDate';

export const ResourcesPage = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    groupId: '',
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'application/pdf',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['resources', search],
    queryFn: () =>
      resourceApi
        .list({ limit: 50, myGroups: 'true' })
        .then((r) => r.data.data),
  });

  const upload = useMutation({
    mutationFn: (payload) => resourceApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resources'] });
      setShowUpload(false);
    },
  });

  const resources = (data?.items || []).filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Resources"
        description="Shared study materials from your groups"
        action={
          <Button className="gap-2" onClick={() => setShowUpload((s) => !s)}>
            <Upload size={16} strokeWidth={1.75} /> Upload
          </Button>
        }
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

      {showUpload && (
        <Card className="mb-8" title="Upload Resource">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Group ID" value={form.groupId} onChange={(e) => setForm((f) => ({ ...f, groupId: e.target.value }))} />
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Input label="File URL" value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))} />
            <Input label="File Type" value={form.fileType} onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))} />
          </div>
          <Button className="mt-4" loading={upload.isPending} onClick={() => upload.mutate(form)}>
            Upload
          </Button>
        </Card>
      )}

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
