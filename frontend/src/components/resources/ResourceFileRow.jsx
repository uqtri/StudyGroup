import { useState } from 'react';
import {
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
  X,
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import {
  getFileCategory,
  getResourceViewUrl,
} from '../../utils/cloudinaryUpload';
import { ResourceStarRating } from './ResourceStarRating';
import { Button } from '../common/Button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../ui/popover';
import { cn } from '../../utils/cn';

const FILE_ICONS = {
  pdf: { Icon: FileText, color: 'text-red-600', bg: 'bg-red-500/10' },
  doc: { Icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  sheet: { Icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  slide: { Icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  image: { Icon: FileImage, color: 'text-violet-600', bg: 'bg-violet-500/10' },
  archive: { Icon: FileArchive, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  text: { Icon: FileText, color: 'text-slate-600', bg: 'bg-slate-500/10' },
  file: { Icon: File, color: 'text-primary', bg: 'bg-primary/10' },
};

export const ResourceFileRow = ({
  resource,
  canDelete,
  onDelete,
  deleting,
  onToggleStar,
  starring,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const category = getFileCategory(resource.title, resource.fileType, resource.fileUrl);
  const { Icon, color, bg } = FILE_ICONS[category] || FILE_ICONS.file;
  const viewUrl = getResourceViewUrl(resource.fileUrl, resource.fileType);

  const handleConfirmDelete = () => {
    onDelete(resource.id);
    setConfirmOpen(false);
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition hover:border-primary/20 hover:bg-elevated/40 sm:px-4">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          bg,
        )}
      >
        <Icon size={20} className={color} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <a
          href={viewUrl}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
        >
          {resource.title}
        </a>
        <p className="mt-0.5 text-xs text-muted">
          {resource.uploader?.fullName}
          <span className="mx-1.5 text-border">·</span>
          {formatDate(resource.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <ResourceStarRating
          starCount={resource.starCount}
          starredByMe={resource.starredByMe}
          onToggle={() => onToggleStar?.(resource.id)}
          loading={starring}
        />
        {canDelete && (
          <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
            <PopoverTrigger
              className="inline-flex"
              render={
                <button
                  type="button"
                  disabled={deleting}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-0 transition hover:bg-danger/10 hover:text-danger group-hover:opacity-100',
                    confirmOpen && 'opacity-100',
                    deleting && 'opacity-50',
                  )}
                  aria-label="Delete file"
                >
                  <X size={15} />
                </button>
              }
            />
            <PopoverContent className="w-64" align="end" side="top">
              <PopoverHeader>
                <PopoverTitle>Delete file?</PopoverTitle>
                <PopoverDescription>
                  &ldquo;{resource.title}&rdquo; will be permanently removed. This cannot be undone.
                </PopoverDescription>
              </PopoverHeader>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  className="!py-1.5 !text-xs"
                  onClick={() => setConfirmOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="!py-1.5 !text-xs"
                  loading={deleting}
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
