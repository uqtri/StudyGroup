import { sessionsService } from './sessions.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const sessionsController = {
  list: async (req, res) => {
    validate(req);
    const data = await sessionsService.list(req.query, req.user?.id);
    ApiResponse.success(res, { message: 'Sessions retrieved', data });
  },

  getById: async (req, res) => {
    validate(req);
    const data = await sessionsService.getById(req.params.id);
    ApiResponse.success(res, { message: 'Session retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await sessionsService.create(
      {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      },
      req.user.id,
    );
    ApiResponse.success(res, { message: 'Session created', data, statusCode: 201 });
  },

  update: async (req, res) => {
    validate(req);
    const payload = { ...req.body };
    if (payload.startTime) payload.startTime = new Date(payload.startTime);
    if (payload.endTime) payload.endTime = new Date(payload.endTime);
    const data = await sessionsService.update(req.params.id, payload, req.user.id);
    ApiResponse.success(res, { message: 'Session updated', data });
  },

  remove: async (req, res) => {
    validate(req);
    await sessionsService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Session cancelled', data: null });
  },
};
