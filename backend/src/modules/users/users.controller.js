import { usersService } from './users.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const usersController = {
  list: async (req, res) => {
    validate(req);
    const data = await usersService.list(req.query);
    ApiResponse.success(res, { message: 'Users retrieved', data });
  },

  getById: async (req, res) => {
    validate(req);
    const data = await usersService.getById(req.params.id);
    ApiResponse.success(res, { message: 'User retrieved', data });
  },

  update: async (req, res) => {
    validate(req);
    const data = await usersService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { message: 'User updated', data });
  },

  remove: async (req, res) => {
    validate(req);
    await usersService.remove(req.params.id);
    ApiResponse.success(res, { message: 'User deactivated', data: null });
  },
};
