import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

const defaultForm = {
  title: '',
  startTime: '',
  endTime: '',
  startNow: false,
  notifyMembers: false,
};

export const CreateSessionForm = ({ onSubmit, loading, onCancel }) => {
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = () => {
    const payload = {
      title: form.title,
      startNow: form.startNow,
      notifyMembers: form.notifyMembers,
    };

    if (!form.startNow) {
      payload.startTime = new Date(form.startTime).toISOString();
      payload.endTime = new Date(form.endTime).toISOString();
    }

    onSubmit(payload, () => setForm(defaultForm));
  };

  return (
    <Card title="Create Session">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />

        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={form.startNow}
            onChange={(e) => setForm((f) => ({ ...f, startNow: e.target.checked }))}
            className="rounded border-border"
          />
          Start now (no end time required)
        </label>

        {!form.startNow && (
          <>
            <Input
              label="Start"
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            />
            <Input
              label="End"
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
            />
          </>
        )}

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.notifyMembers}
            onChange={(e) => setForm((f) => ({ ...f, notifyMembers: e.target.checked }))}
            className="rounded border-border"
          />
          Notify all group members
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          loading={loading}
          disabled={!form.title.trim() || (!form.startNow && (!form.startTime || !form.endTime))}
          onClick={handleSubmit}
        >
          Create Session
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};
