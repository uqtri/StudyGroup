import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const PublicLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-center lg:p-12">
          <div className="absolute inset-0 bg-primary" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
          <div className="relative z-10 text-white">
            <h1 className="text-4xl font-bold tracking-tight">StudyHub</h1>
            <p className="mt-4 max-w-md text-lg text-white/85">
              Organize study groups, schedule sessions, track attendance, and share resources in
              one modern workspace.
            </p>
            <div className="mt-8 flex gap-3">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
                Groups
              </span>
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
                Sessions
              </span>
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
                Resources
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface/90 p-8 shadow-xl shadow-primary/5 backdrop-blur-sm dark:bg-surface/80">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
