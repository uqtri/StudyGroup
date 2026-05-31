import { commentsRepository } from './comments.repository.js';
import { postsRepository } from '../posts/posts.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const commentsService = {
  create: async (data, userId) => {
    const post = await postsRepository.findById(data.postId);
    if (!post) throw ApiError.notFound('Post not found');
    return commentsRepository.create({ ...data, authorId: userId });
  },

  remove: async (id, userId) => {
    const comment = await commentsRepository.findById(id);
    if (!comment) throw ApiError.notFound('Comment not found');
    if (comment.authorId !== userId) throw ApiError.forbidden();
    await commentsRepository.softDelete(id);
    return true;
  },
};
