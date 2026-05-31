import { commentsService } from './comments.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const commentsController = {
  create: async (req, res) => {
    validate(req);
    const data = await commentsService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Comment added', data, statusCode: 201 });
  },

  remove: async (req, res) => {
    validate(req);
    await commentsService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Comment deleted', data: null });
  },
};
