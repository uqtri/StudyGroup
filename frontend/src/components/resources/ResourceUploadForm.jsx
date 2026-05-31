import { useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { cn } from '../../utils/cn';
import { uploadApi } from '../../api/uploadApi';
import { resourceApi } from '../../api/resourceApi';
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  formatFileSize,
  isImageType,
  resolveFileType,
  titleFromFilename,
  uploadToCloudinary,
} from '../../utils/cloudinaryUpload';

const makeId = () => crypto.randomUUID();

const FilePreview = ({ file }) => {
  if (file && isImageType(file.type)) {
    return (
      <img
        src={URL.createObjectURL(file)}
        alt=""
        className="h-full w-full object-cover"
        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
      />
    );
  }

  return <FileText className="h-8 w-8 text-primary" strokeWidth={1.5} />;
};

const UploadFileCard = ({ item, onTitleChange, onRemove }) => {
  const isError = item.status === 'error';
  const isDone = item.status === 'done';
  const isUploading = item.status === 'uploading';
  const isPending = item.status === 'pending';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-surface',
        isError ? 'border-danger/40' : 'border-border',
      )}
    >
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={isUploading}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-muted shadow-sm transition hover:bg-danger/10 hover:text-danger disabled:opacity-50"
        aria-label="Remove file"
      >
        <X size={14} />
      </button>

      <div className="flex h-28 items-center justify-center bg-elevated">
        <FilePreview file={item.file} />
      </div>

      <div className="space-y-2 p-3">
        <Input
          label="Title"
          value={item.title}
          onChange={(e) => onTitleChange(item.id, e.target.value)}
          disabled={isUploading || isDone}
          className="!py-2"
        />

        <p className="truncate text-xs text-muted">
          {item.file?.name} · {formatFileSize(item.file?.size || 0)}
        </p>

        {(isUploading || isDone || isError) && (
          <div className="space-y-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isError ? 'bg-danger' : isDone ? 'bg-success' : 'bg-primary',
                )}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <p className="flex items-center gap-1 text-xs text-muted">
              {isError && (
                <>
                  <AlertCircle size={12} className="text-danger" />
                  {item.error}
                </>
              )}
              {isUploading && `${item.progress}% uploading…`}
              {isDone && (
                <>
                  <CheckCircle2 size={12} className="text-success" />
                  Saved
                </>
              )}
            </p>
          </div>
        )}

        {isPending && (
          <p className="text-xs text-muted">Ready — click Confirm to upload</p>
        )}
      </div>
    </div>
  );
};

export const ResourceUploadForm = ({ groupId, folderId, onSuccess, onCancel }) => {
  const [items, setItems] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const inputRef = useRef(null);
  const abortControllers = useRef(new Map());

  const signatureMutation = useMutation({
    mutationFn: () => uploadApi.getCloudinarySignature().then((r) => r.data.data),
  });

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const uploadItem = useCallback(
    async (item, signature) => {
      const controller = new AbortController();
      abortControllers.current.set(item.id, controller);

      updateItem(item.id, { status: 'uploading', progress: 0, error: null });

      try {
        const result = await uploadToCloudinary(item.file, signature, {
          onProgress: (progress) => updateItem(item.id, { progress }),
          signal: controller.signal,
        });

        updateItem(item.id, { progress: 95 });

        await resourceApi.create({
          groupId,
          folderId,
          title: item.title.trim() || titleFromFilename(item.file.name),
          fileUrl: result.secure_url,
          fileType: resolveFileType(item.file, result),
        });

        updateItem(item.id, { status: 'done', progress: 100 });
      } catch (err) {
        if (err.message !== 'Upload cancelled') {
          updateItem(item.id, {
            status: 'error',
            error: err.message || 'Upload failed',
          });
        }
        throw err;
      } finally {
        abortControllers.current.delete(item.id);
      }
    },
    [groupId, folderId, updateItem],
  );

  const addFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) => {
      if (file.size > MAX_FILE_SIZE) return false;
      if (ACCEPTED_MIME_TYPES.includes(file.type)) return true;
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ext && ACCEPTED_EXTENSIONS.has(ext);
    });

    if (!validFiles.length) return;

    const newItems = validFiles.map((file) => ({
      id: makeId(),
      file,
      title: titleFromFilename(file.name),
      status: 'pending',
      progress: 0,
      error: null,
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleConfirm = async () => {
    const queue = items.filter((item) => item.status === 'pending' || item.status === 'error');
    if (!queue.length) return;

    setConfirming(true);

    try {
      const signature = await signatureMutation.mutateAsync();
      let allSucceeded = true;

      for (const item of queue) {
        try {
          await uploadItem(item, signature);
        } catch {
          allSucceeded = false;
        }
      }

      if (allSucceeded) {
        setItems([]);
        onSuccess?.();
        onCancel?.();
      } else {
        onSuccess?.();
      }
    } catch {
      /* signature error shown below */
    } finally {
      setConfirming(false);
    }
  };

  const handleRemove = (id) => {
    const item = items.find((i) => i.id === id);
    if (item?.status === 'uploading') {
      const controller = abortControllers.current.get(id);
      if (controller) controller.abort();
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const hasActiveUploads = items.some((item) => item.status === 'uploading');
  const canConfirm = items.some(
    (item) => item.status === 'pending' || item.status === 'error',
  );
  const allDone =
    items.length > 0 && items.every((item) => item.status === 'done');

  return (
    <Card title="Upload files">
      <div className="space-y-5">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition',
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border bg-elevated/50 hover:border-primary/40 hover:bg-elevated',
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload size={22} strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Click or drag files here
            </p>
            <p className="mt-1 text-xs text-muted">
              PDF, DOC, DOCX, XLS, PPT, images — max {formatFileSize(MAX_FILE_SIZE)} each
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILE_TYPES}
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {signatureMutation.isError && (
          <p className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertCircle size={16} />
            Cloudinary is not configured. Add credentials to backend .env.
          </p>
        )}

        {items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <UploadFileCard
                key={item.id}
                item={item}
                onTitleChange={(id, title) => updateItem(id, { title })}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            loading={confirming || hasActiveUploads}
            disabled={!canConfirm || hasActiveUploads}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={hasActiveUploads || confirming}
            >
              {allDone ? 'Done' : 'Cancel'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
