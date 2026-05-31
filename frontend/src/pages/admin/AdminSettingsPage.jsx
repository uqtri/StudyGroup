import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const AdminSettingsPage = () => (
  <div className="mx-auto max-w-2xl space-y-6">
    <Card title="Platform Settings">
      <div className="space-y-4">
        <Input label="Platform Name" defaultValue="StudyHub" />
        <Input label="Support Email" defaultValue="support@studyhub.com" />
        <Input label="Max Group Size (default)" type="number" defaultValue="20" />
        <Button>Save Settings</Button>
      </div>
    </Card>
    <Card title="Security">
      <p className="text-sm text-muted">
        JWT session settings and role policies are configured via backend environment variables.
      </p>
    </Card>
  </div>
);
