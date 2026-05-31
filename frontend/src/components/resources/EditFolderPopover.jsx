import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { Button } from '../common/Button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { resourceFolderApi } from '../../api/resourceFolderApi';
import { cn } from '../../utils/cn';

export const EditFolderPopover = ({ folder, groupId }) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(folder.name);
  const [description, setDescription] = useState(folder.description || '');

  const syncForm = () => {
    setName(folder.name);
    setDescription(folder.description || '');
  };

  const updateMutation = useMutation({
    mutationFn: (payload) =>
      resourceFolderApi.update(folder.id, payload).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resource-folder', folder.id] });
      qc.invalidateQueries({ queryKey: ['group-folders', groupId] });
      setOpen(false);
    },
  });

  const handleOpenChange = (next) => {
    if (next) syncForm();
    setOpen(next);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    updateMutation.mutate({
      name: trimmedName,
      description: description.trim() || null,
    });
  };

  const isUnchanged =
    name.trim() === folder.name &&
    (description.trim() || '') === (folder.description || '');

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className="inline-flex"
        render={
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-surface/80 text-muted shadow-sm transition hover:border-primary/30 hover:bg-surface hover:text-primary"
            aria-label="Edit folder"
          >
            <Pencil size={14} strokeWidth={1.75} />
          </button>
        }
      />
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle>Edit folder</PopoverTitle>
          <PopoverDescription>Update the folder name and description.</PopoverDescription>
        </PopoverHeader>
        <div className="space-y-3 px-0.5 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor={`edit-folder-name-${folder.id}`}>Folder name</Label>
            <Input
              id={`edit-folder-name-${folder.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-folder-description-${folder.id}`}>
              Description (optional)
            </Label>
            <textarea
              id={`edit-folder-description-${folder.id}`}
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                'w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm',
                'outline-none placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/15',
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={updateMutation.isPending}
              disabled={!name.trim() || isUnchanged}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
