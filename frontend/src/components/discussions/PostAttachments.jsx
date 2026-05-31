import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  formatFileSize,
  getFileCategory,
  getResourceViewUrl,
  isImageType,
} from '../../utils/cloudinaryUpload';

const AttachmentImage = ({ attachment }) => (
  <a
    href={attachment.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group block overflow-hidden rounded-xl border border-border bg-elevated"
  >
    <img
      src={attachment.fileUrl}
      alt={attachment.fileName}
      className="aspect-video max-h-48 w-full object-cover transition group-hover:opacity-90"
    />
    <p className="truncate px-2 py-1.5 text-xs text-muted">{attachment.fileName}</p>
  </a>
);

const AttachmentFile = ({ attachment }) => {
  const href = getResourceViewUrl(attachment.fileUrl, attachment.fileType);
  const category = getFileCategory(
    attachment.fileName,
    attachment.fileType,
    attachment.fileUrl,
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-border bg-elevated px-3 py-2.5 transition hover:border-primary/30 hover:bg-surface"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileText size={18} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{attachment.fileName}</p>
        <p className="text-xs text-muted">
          {category.toUpperCase()}
          {attachment.fileSize ? ` · ${formatFileSize(attachment.fileSize)}` : ''}
        </p>
      </div>
      <ExternalLink size={14} className="shrink-0 text-muted" />
    </a>
  );
};

export const PostAttachments = ({ attachments = [], compact = false }) => {
  if (!attachments.length) return null;

  const images = attachments.filter((a) => isImageType(a.fileType));
  const files = attachments.filter((a) => !isImageType(a.fileType));

  return (
    <div className={cn('space-y-3', compact && 'mt-3')}>
      {images.length > 0 && (
        <div
          className={cn(
            'grid gap-2',
            images.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2',
            compact && images.length > 2 && 'max-h-32 overflow-hidden',
          )}
        >
          {(compact ? images.slice(0, 2) : images).map((a) => (
            <AttachmentImage key={a.id} attachment={a} />
          ))}
          {compact && images.length > 2 && (
            <p className="text-xs text-muted">+{images.length - 2} more images</p>
          )}
        </div>
      )}
      {files.length > 0 && (
        <div className={cn('grid gap-2', !compact && 'sm:grid-cols-2')}>
          {(compact ? files.slice(0, 1) : files).map((a) => (
            <AttachmentFile key={a.id} attachment={a} />
          ))}
          {compact && files.length > 1 && (
            <p className="text-xs text-muted">+{files.length - 1} more files</p>
          )}
        </div>
      )}
    </div>
  );
};
