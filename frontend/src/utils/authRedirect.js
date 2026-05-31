import { ROLES } from '../constants/roles';

export const getHomePath = (user) => {
  if (user?.roles?.includes(ROLES.ADMIN)) return '/admin/dashboard';
  return '/';
};

export const isAdmin = (user) => user?.roles?.includes(ROLES.ADMIN);

export const isLeader = (user) => user?.roles?.includes(ROLES.LEADER);
