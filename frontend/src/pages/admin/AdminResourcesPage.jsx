import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '../../api/resourceApi';
import { Avatar } from '../../components/common/Avatar';
import { Card } from '../../components/common/Card';
import { GroupAvatar } from '../../components/common/GroupAvatar';
import { ResourceFileListSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { formatDate } from '../../utils/formatDate';
import { getFileCategory, getResourceViewUrl } from '../../utils/cloudinaryUpload';
import { getFileIconProps } from '../../utils/fileIcons';
import { cn } from '../../utils/cn';

export const AdminResourcesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: () => resourceApi.list({ limit: 100 }).then((r) => r.data.data),
  });

  if (isLoading) return <ResourceFileListSkeleton count={8} />;

  const resources = data?.items || [];

  return (
    <Card title={`All Resources (${resources.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-2">Title</th>
              <th className="pb-2">Group</th>
              <th className="pb-2">Uploader</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => {
              const category = getFileCategory(r.title, r.fileType, r.fileUrl);
              const { Icon, color, bg } = getFileIconProps(category);
              const viewUrl = getResourceViewUrl(r.fileUrl, r.fileType);

              return (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-3">
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 font-medium text-foreground hover:text-primary"
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          bg,
                        )}
                      >
                        <Icon size={20} className={color} strokeWidth={1.75} />
                      </div>
                      <span className="hover:underline">{r.title}</span>
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <GroupAvatar name={r.group?.name} className="h-8 w-8 text-sm" />
                      <span>{r.group?.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar src={r.uploader?.avatar} name={r.uploader?.fullName} />
                      <span>{r.uploader?.fullName}</span>
                    </div>
                  </td>
                  <td className="text-muted">{formatDate(r.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
