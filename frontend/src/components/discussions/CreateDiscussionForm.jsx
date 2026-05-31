import { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import {
  DiscussionFilePicker,
  useUploadDiscussionFiles,
} from './DiscussionFilePicker';

export const CreateDiscussionForm = ({ loading, onCancel, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadAll, isUploading } = useUploadDiscussionFiles();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      let attachments = [];
      if (files.length) {
        attachments = await uploadAll(files, { onProgress: setUploadProgress });
      }
      onSubmit(
        { title: title.trim(), content: content.trim(), attachments },
        () => {
          setTitle('');
          setContent('');
          setFiles([]);
          setUploadProgress(0);
        },
      );
    } catch {
      /* upload error — user can retry */
    }
  };

  const busy = loading || isUploading;

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-foreground">New discussion</h3>
      <div className="space-y-3">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="text-sm font-medium text-foreground">Content</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts with the group..."
            disabled={busy}
          />
        </div>

        <DiscussionFilePicker files={files} onFilesChange={setFiles} disabled={busy} />

        {isUploading && (
          <div className="space-y-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted">Uploading files… {uploadProgress}%</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button loading={busy} onClick={handleSubmit}>
            Publish
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
