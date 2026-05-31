import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROLES } from '../constants/roles';
import { getHomePath, isAdmin } from '../utils/authRedirect';

export const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.some((r) => user?.roles?.includes(r))) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return <Outlet />;
};

/** Student & Leader portal — admins are redirected to admin portal */
export const StudentRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.roles?.includes(ROLES.ADMIN)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return <Outlet />;
};
