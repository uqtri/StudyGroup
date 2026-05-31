import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PublicLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="hidden flex-col justify-center bg-primary p-12 text-white lg:flex">
          <h1 className="text-4xl font-bold">StudyHub</h1>
          <p className="mt-4 max-w-md text-lg text-blue-100">
            Organize study groups, schedule sessions, track attendance, and share resources in one
            place.
          </p>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
