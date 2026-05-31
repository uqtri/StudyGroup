import { ExternalLink, FileText, Image as ImageIcon, X } from 'lucide-react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/formatDate';
import { isImageType } from '../../utils/cloudinaryUpload';
import { ResourceStarRating } from './ResourceStarRating';
import { cn } from '../../utils/cn';

export const ResourceCard = ({
  resource,
  canDelete,
  onDelete,
  deleting,
  onToggleStar,
  starring,
}) => {
  const isImage = isImageType(resource.fileType);

  return (
    <Card className="relative overflow-hidden !p-0">
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(resource.id)}
          disabled={deleting}
          className={cn(
            'absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-muted shadow-sm transition hover:bg-danger/10 hover:text-danger',
            deleting && 'opacity-50',
          )}
          aria-label="Delete resource"
        >
          <X size={14} />
        </button>
      )}

      <div className="flex h-32 items-center justify-center bg-elevated">
        {isImage ? (
          <img
            src={resource.fileUrl}
            alt={resource.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            {resource.fileType?.includes('pdf') ? (
              <FileText className="h-10 w-10 text-primary" strokeWidth={1.5} />
            ) : (
              <ImageIcon className="h-10 w-10 text-primary" strokeWidth={1.5} />
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="pr-6 font-medium">{resource.title}</h3>

        <div className="mt-2 flex items-center gap-2">
          <Avatar
            src={resource.uploader?.avatar}
            name={resource.uploader?.fullName}
            className="!h-6 !w-6 text-[10px]"
          />
          <p className="text-xs text-muted">
            {resource.uploader?.fullName} · {formatDate(resource.createdAt)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <ResourceStarRating
            starCount={resource.starCount}
            starredByMe={resource.starredByMe}
            onToggle={() => onToggleStar?.(resource.id)}
            loading={starring}
          />
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Open <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </Card>
  );
};
