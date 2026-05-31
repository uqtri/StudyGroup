import { commentsService } from './comments.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const commentsController = {
  listByPost: async (req, res) => {
    validate(req);
    const data = await commentsService.listByPost(req.params.postId, req.query, req.user.id);
    ApiResponse.success(res, { message: 'Comments retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await commentsService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Comment added', data, statusCode: 201 });
  },

  update: async (req, res) => {
    validate(req);
    const data = await commentsService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { message: 'Comment updated', data });
  },

  vote: async (req, res) => {
    validate(req);
    const data = await commentsService.vote(req.params.id, req.body.value, req.user.id);
    ApiResponse.success(res, { message: 'Vote recorded', data });
  },

  remove: async (req, res) => {
    validate(req);
    await commentsService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Comment deleted', data: null });
  },
};
