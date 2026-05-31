import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';

export const StaticPage = ({ title, children }) => (
  <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
    <PageHeader title={title} />
    <Card>
      <div className="text-base leading-relaxed text-muted">{children}</div>
    </Card>
  </div>
);
