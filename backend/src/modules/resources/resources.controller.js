import { resourcesService } from './resources.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const resourcesController = {
  list: async (req, res) => {
    validate(req);
    const data = await resourcesService.list(req.query, req.user.id);
    ApiResponse.success(res, { message: 'Resources retrieved', data });
  },

  getById: async (req, res) => {
    validate(req);
    const data = await resourcesService.getById(req.params.id);
    ApiResponse.success(res, { message: 'Resource retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await resourcesService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Resource created', data, statusCode: 201 });
  },

  remove: async (req, res) => {
    validate(req);
    await resourcesService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Resource deleted', data: null });
  },
};
