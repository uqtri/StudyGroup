import { postsService } from './posts.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const postsController = {
  list: async (req, res) => {
    validate(req);
    const data = await postsService.list(req.query, req.user.id);
    ApiResponse.success(res, { message: 'Posts retrieved', data });
  },

  getById: async (req, res) => {
    validate(req);
    const data = await postsService.getById(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Post retrieved', data });
  },

  create: async (req, res) => {
    validate(req);
    const data = await postsService.create(req.body, req.user.id);
    ApiResponse.success(res, { message: 'Post created', data, statusCode: 201 });
  },

  update: async (req, res) => {
    validate(req);
    const data = await postsService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { message: 'Post updated', data });
  },

  vote: async (req, res) => {
    validate(req);
    const data = await postsService.vote(req.params.id, req.body.value, req.user.id);
    ApiResponse.success(res, { message: 'Vote recorded', data });
  },

  remove: async (req, res) => {
    validate(req);
    await postsService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Post deleted', data: null });
  },
};
