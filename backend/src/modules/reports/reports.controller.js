import { reportsService } from './reports.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const reportsController = {
  list: async (req, res) => {
    const data = await reportsService.list(req.query);
    ApiResponse.success(res, { message: 'Reports retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await reportsService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Report submitted', data, statusCode: 201 });
  },

  updateStatus: async (req, res) => {
    validate(req);
    const data = await reportsService.updateStatus(req.params.id, req.body.status);
    ApiResponse.success(res, { message: 'Report updated', data });
  },
};
