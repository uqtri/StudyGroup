import { dashboardService } from './dashboard.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const dashboardController = {
  getStats: async (req, res) => {
    const data = await dashboardService.getStats(req.user);
    ApiResponse.success(res, { message: 'Dashboard stats retrieved', data });
  },

  getGroupStats: async (req, res) => {
    validate(req);
    const data = await dashboardService.getGroupStats(req.params.groupId, req.user);
    ApiResponse.success(res, { message: 'Group stats retrieved', data });
  },
};
