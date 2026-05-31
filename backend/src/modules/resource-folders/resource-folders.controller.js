import { resourceFoldersService } from './resource-folders.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const resourceFoldersController = {
  list: async (req, res) => {
    validate(req);
    const data = await resourceFoldersService.list(req.query, req.user.id);
    ApiResponse.success(res, { message: 'Folders retrieved', data });
  },

  getById: async (req, res) => {
    validate(req);
    const data = await resourceFoldersService.getById(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Folder retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await resourceFoldersService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Folder created', data, statusCode: 201 });
  },
};
