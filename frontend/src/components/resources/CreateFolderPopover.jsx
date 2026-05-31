import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderPlus } from 'lucide-react';
import { Button } from '../common/Button';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { resourceFolderApi } from '../../api/resourceFolderApi';
import { cn } from '../../utils/cn';

export const CreateFolderPopover = ({ groupId, onCreated }) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const createMutation = useMutation({
    mutationFn: (payload) =>
      resourceFolderApi.create(payload).then((r) => r.data.data),
    onSuccess: (folder) => {
      qc.invalidateQueries({ queryKey: ['group-folders', groupId] });
      qc.invalidateQueries({ queryKey: ['group', groupId] });
      resetForm();
      setOpen(false);
      onCreated?.(folder);
    },
  });

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    createMutation.mutate({
      groupId,
      name: trimmed,
      description: description.trim() || undefined,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex"
        render={
          <Button type="button" className="gap-2">
            <FolderPlus size={16} /> Create new folder
          </Button>
        }
      />
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle>New folder</PopoverTitle>
          <PopoverDescription>
            Name your folder and optionally add a short description.
          </PopoverDescription>
        </PopoverHeader>
        <div className="space-y-3 px-0.5 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input
              id="folder-name"
              placeholder="e.g. Week 3 Notes"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="folder-description">Description (optional)</Label>
            <textarea
              id="folder-description"
              placeholder="What will this folder contain?"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                'w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm',
                'outline-none placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/15',
              )}
            />
          </div>
          <Button
            className="w-full"
            loading={createMutation.isPending}
            disabled={!name.trim()}
            onClick={handleCreate}
          >
            Create folder
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
