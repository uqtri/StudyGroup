import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Folder, Upload } from 'lucide-react';
import { resourceFolderApi } from '../../api/resourceFolderApi';
import { resourceApi } from '../../api/resourceApi';
import { Button } from '../common/Button';
import { CreateFolderPopover } from './CreateFolderPopover';
import { ResourceUploadForm } from './ResourceUploadForm';
import { ResourceFileRow } from './ResourceFileRow';
import { FolderDetailHeader } from './FolderDetailHeader';
import {
  FolderDetailSkeleton,
  FolderGridSkeleton,
  GroupResourcesTabSkeleton,
  ResourceFileListSkeleton,
} from '../skeletons/LoadingSkeletons';
import { formatDate } from '../../utils/formatDate';

export const GroupResourcesTab = ({
  groupId,
  isMember,
  canManage,
  userId,
}) => {
  const qc = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['group-folders', groupId],
    queryFn: () =>
      resourceFolderApi.list({ groupId, limit: 50 }).then((r) => r.data.data),
    enabled: isMember,
  });

  const { data: folderDetail, isLoading: folderDetailLoading } = useQuery({
    queryKey: ['resource-folder', selectedFolderId],
    queryFn: () =>
      resourceFolderApi.getById(selectedFolderId).then((r) => r.data.data),
    enabled: !!selectedFolderId,
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['group-resources', groupId, selectedFolderId],
    queryFn: () =>
      resourceApi
        .list({ folderId: selectedFolderId, limit: 50 })
        .then((r) => r.data.data),
    enabled: !!selectedFolderId,
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (resourceId) => resourceApi.remove(resourceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group-resources', groupId, selectedFolderId] });
      qc.invalidateQueries({ queryKey: ['resource-folder', selectedFolderId] });
      qc.invalidateQueries({ queryKey: ['group-folders', groupId] });
      qc.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });

  const starMutation = useMutation({
    mutationFn: (resourceId) => resourceApi.toggleStar(resourceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group-resources', groupId, selectedFolderId] });
    },
  });

  const handleResourceUploaded = () => {
    qc.invalidateQueries({ queryKey: ['group-resources', groupId, selectedFolderId] });
    qc.invalidateQueries({ queryKey: ['resource-folder', selectedFolderId] });
    qc.invalidateQueries({ queryKey: ['group-folders', groupId] });
    qc.invalidateQueries({ queryKey: ['group', groupId] });
  };

  const handleFolderCreated = (folder) => {
    setSelectedFolderId(folder.id);
    setShowUpload(true);
  };

  if (!isMember) {
    return (
      <p className="text-muted">
        Join this group to access and upload shared resources.
      </p>
    );
  }

  if (foldersLoading && !selectedFolderId) {
    return <GroupResourcesTabSkeleton />;
  }

  if (selectedFolderId) {
    const folderItems = resources?.items || [];
    const folder = folderDetail;
    const fileCount = folder?._count?.resources ?? folderItems.length;
    const isFolderLoading = folderDetailLoading && !folder;

    if (isFolderLoading) {
      return <FolderDetailSkeleton />;
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedFolderId(null);
              setShowUpload(false);
            }}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} /> All folders
          </button>

          {!showUpload && (
            <Button className="gap-2" onClick={() => setShowUpload(true)}>
              <Upload size={16} /> Upload files
            </Button>
          )}
        </div>

        {folder && (
          <FolderDetailHeader
            folder={folder}
            fileCount={fileCount}
            canManage={canManage}
            groupId={groupId}
          />
        )}

        {showUpload && folder && (
          <ResourceUploadForm
            groupId={groupId}
            folderId={folder.id}
            onSuccess={handleResourceUploaded}
            onCancel={() => setShowUpload(false)}
          />
        )}

        {resourcesLoading ? (
          <ResourceFileListSkeleton count={5} />
        ) : (
          <div className="space-y-2">
            {folderItems.map((r) => (
              <ResourceFileRow
                key={r.id}
                resource={r}
                canDelete={r.uploadedBy === userId || canManage}
                deleting={deleteResourceMutation.isPending}
                onDelete={(id) => deleteResourceMutation.mutate(id)}
                onToggleStar={(id) => starMutation.mutate(id)}
                starring={starMutation.isPending}
              />
            ))}
          </div>
        )}

        {!resourcesLoading && !folderItems.length && !showUpload && (
          <p className="text-muted">This folder is empty. Upload files to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateFolderPopover groupId={groupId} onCreated={handleFolderCreated} />
      </div>

      {foldersLoading ? (
        <FolderGridSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(folders?.items || []).map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setSelectedFolderId(folder.id)}
              className="rounded-[var(--radius-card)] border border-border bg-surface p-5 text-left shadow-soft transition hover:border-primary/30 hover:shadow-elevated"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Folder size={20} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{folder.name}</h3>
                  {folder.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{folder.description}</p>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    {folder._count?.resources ?? 0} files
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    by {folder.creator?.fullName} · {formatDate(folder.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!foldersLoading && !folders?.items?.length && (
        <p className="text-muted">
          No folders yet. Create one to start sharing resources.
        </p>
      )}
    </div>
  );
};
