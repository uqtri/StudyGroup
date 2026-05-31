import { Outlet } from 'react-router-dom';
import { WebsiteHeader } from '../components/layout/website/WebsiteHeader';
import { WebsiteFooter } from '../components/layout/website/WebsiteFooter';

export const WebsiteLayout = () => (
  <div className="flex min-h-screen flex-col">
    <WebsiteHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <WebsiteFooter />
  </div>
);
