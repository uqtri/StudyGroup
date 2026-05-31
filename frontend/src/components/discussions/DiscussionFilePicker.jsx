import { useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { uploadApi } from '../../api/uploadApi';
import { cn } from '../../utils/cn';
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  formatFileSize,
  isImageType,
  resolveFileType,
  uploadToCloudinary,
} from '../../utils/cloudinaryUpload';

const makeId = () => crypto.randomUUID();

const FileChip = ({ item, onRemove, disabled }) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-2 py-1.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface">
      {item.file && isImageType(item.file.type) ? (
        <img
          src={URL.createObjectURL(item.file)}
          alt=""
          className="h-full w-full object-cover"
          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
        />
      ) : (
        <FileText size={14} className="text-primary" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-medium text-foreground">{item.file?.name}</p>
      <p className="text-[10px] text-muted">{formatFileSize(item.file?.size || 0)}</p>
    </div>
    <button
      type="button"
      disabled={disabled}
      onClick={() => onRemove(item.id)}
      className="rounded p-0.5 text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-50"
      aria-label="Remove file"
    >
      <X size={14} />
    </button>
  </div>
);

export const DiscussionFilePicker = ({ files, onFilesChange, disabled }) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const valid = Array.from(fileList).filter((file) => {
      if (file.size > MAX_FILE_SIZE) return false;
      if (ACCEPTED_MIME_TYPES.includes(file.type)) return true;
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ext && ACCEPTED_EXTENSIONS.has(ext);
    });
    if (!valid.length || files.length + valid.length > 10) return;

    const next = [
      ...files,
      ...valid.slice(0, 10 - files.length).map((file) => ({ id: makeId(), file })),
    ];
    onFilesChange(next);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Attachments (optional)</label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border bg-elevated/40 hover:border-primary/40',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Upload size={20} className="text-primary" strokeWidth={1.75} />
        <p className="text-center text-xs text-muted">
          Images, PDF, Office docs — up to 10 files, {formatFileSize(MAX_FILE_SIZE)} each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {files.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {files.map((item) => (
            <FileChip
              key={item.id}
              item={item}
              disabled={disabled}
              onRemove={(id) => onFilesChange(files.filter((f) => f.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const useUploadDiscussionFiles = () => {
  const signatureMutation = useMutation({
    mutationFn: () => uploadApi.getCloudinarySignature().then((r) => r.data.data),
  });

  const uploadAll = useCallback(
    async (fileItems, { onProgress } = {}) => {
      if (!fileItems.length) return [];

      const signature = await signatureMutation.mutateAsync();
      const results = [];

      for (let i = 0; i < fileItems.length; i += 1) {
        const item = fileItems[i];
        onProgress?.(Math.round((i / fileItems.length) * 100));

        const cloudinary = await uploadToCloudinary(item.file, signature, {
          onProgress: (pct) =>
            onProgress?.(Math.round(((i + pct / 100) / fileItems.length) * 100)),
        });

        results.push({
          fileUrl: cloudinary.secure_url,
          fileName: item.file.name,
          fileType: resolveFileType(item.file, cloudinary),
          fileSize: item.file.size,
        });
      }

      onProgress?.(100);
      return results;
    },
    [signatureMutation],
  );

  return { uploadAll, isUploading: signatureMutation.isPending };
};
