import { dashboardService } from './dashboard.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const dashboardController = {
  getStats: async (req, res) => {
    const data = await dashboardService.getStats(req.user);
    ApiResponse.success(res, { message: 'Dashboard stats retrieved', data });
  },
};
