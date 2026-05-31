import { groupsService } from './groups.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const groupsController = {
  list: async (req, res) => {
    validate(req);
    const isAdmin = req.user?.roles?.includes('ADMIN');
    const data = await groupsService.list(req.query, req.user?.id, isAdmin);
    ApiResponse.success(res, { message: 'Groups retrieved', data });
  },

  getById: async (req, res) => {
    validate(req);
    const isAdmin = req.user?.roles?.includes('ADMIN');
    const data = await groupsService.getById(req.params.id, req.user?.id, isAdmin);
    ApiResponse.success(res, { message: 'Group retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await groupsService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Group created', data, statusCode: 201 });
  },

  update: async (req, res) => {
    validate(req);
    const data = await groupsService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { message: 'Group updated', data });
  },

  remove: async (req, res) => {
    validate(req);
    const isAdmin = req.user.roles.includes('ADMIN');
    await groupsService.remove(req.params.id, req.user.id, isAdmin);
    ApiResponse.success(res, { message: 'Group deleted', data: null });
  },

  requestJoin: async (req, res) => {
    validate(req);
    const data = await groupsService.requestJoin(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Join request submitted', data, statusCode: 201 });
  },

  handleJoinRequest: async (req, res) => {
    validate(req);
    const data = await groupsService.handleJoinRequest(
      req.params.requestId,
      req.body.status,
      req.user.id,
    );
    ApiResponse.success(res, { message: 'Join request updated', data });
  },

  approveJoinRequest: async (req, res) => {
    validate(req);
    const data = await groupsService.approveJoinRequest(req.params.requestId, req.user.id);
    ApiResponse.success(res, { message: 'Join request approved', data });
  },

  rejectJoinRequest: async (req, res) => {
    validate(req);
    const data = await groupsService.rejectJoinRequest(req.params.requestId, req.user.id);
    ApiResponse.success(res, { message: 'Join request rejected', data });
  },

  cancelJoinRequest: async (req, res) => {
    validate(req);
    await groupsService.cancelJoinRequest(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Join request cancelled', data: null });
  },

  setStatus: async (req, res) => {
    validate(req);
    const isAdmin = req.user.roles.includes('ADMIN');
    const data = await groupsService.setStatus(req.params.id, req.body.status, isAdmin);
    ApiResponse.success(res, { message: 'Group status updated', data });
  },
};
