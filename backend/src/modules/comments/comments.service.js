import { commentsRepository } from './comments.repository.js';
import { postsRepository } from '../posts/posts.repository.js';
import { groupsRepository } from '../groups/groups.repository.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { attachVoteMeta, computeVoteScore, getUserVote, sortByVoteScore } from '../../utils/voteHelpers.js';

const discussionLink = (groupId, postId, commentId) =>
  `/groups/${groupId}/discussions/${postId}?comment=${commentId}`;

const mapCommentNode = (comment, userId) => {
  const base = attachVoteMeta(comment, userId);
  return {
    ...base,
    isEdited: Boolean(comment.editedAt),
    mentionedUsers: (comment.mentions || []).map((m) => m.user),
    replies: [],
  };
};

const sortRepliesChronologically = (nodes) => {
  nodes.forEach((node) => {
    if (node.replies?.length) {
      node.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      sortRepliesChronologically(node.replies);
    }
  });
};

const buildCommentTree = (flatComments, userId) => {
  const nodes = new Map();

  for (const comment of flatComments) {
    nodes.set(comment.id, mapCommentNode(comment, userId));
  }

  const roots = [];

  for (const comment of flatComments) {
    const node = nodes.get(comment.id);
    if (comment.parentCommentId) {
      const parent = nodes.get(comment.parentCommentId);
      if (parent) parent.replies.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  }

  sortRepliesChronologically(roots);
  return roots;
};

const mapComment = (comment, userId) => mapCommentNode(comment, userId);

const assertGroupMember = async (groupId, userId) => {
  const membership = await groupsRepository.isMember(groupId, userId);
  if (!membership) throw ApiError.forbidden('Must be a group member');
};

const validateMentions = async (groupId, mentionUserIds, authorId) => {
  if (!mentionUserIds?.length) return [];
  const memberIds = await groupsRepository.getMemberUserIds(groupId);
  const memberSet = new Set(memberIds);
  return [...new Set(mentionUserIds)].filter(
    (id) => memberSet.has(id) && id !== authorId,
  );
};

export const commentsService = {
  listByPost: async (postId, query, userId) => {
    const post = await postsRepository.findById(postId, userId);
    if (!post) throw ApiError.notFound('Post not found');

    await assertGroupMember(post.group.id, userId);

    const sort = query.sort === 'votes' ? 'votes' : 'newest';
    const flatComments = await commentsRepository.findAllByPostId(postId);
    let mapped = buildCommentTree(flatComments, userId);

    if (sort === 'votes') {
      mapped = sortByVoteScore(mapped, 'desc');
    } else {
      mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return mapped;
  },

  create: async (data, userId) => {
    const post = await postsRepository.findById(data.postId, userId);
    if (!post) throw ApiError.notFound('Post not found');

    await assertGroupMember(post.group.id, userId);

    let replyParentAuthorId = null;

    if (data.parentCommentId) {
      const parent = await commentsRepository.findById(data.parentCommentId);
      if (!parent || parent.postId !== data.postId) {
        throw ApiError.badRequest('Invalid parent comment');
      }
      if (parent.authorId !== userId) {
        replyParentAuthorId = parent.authorId;
      }
    }

    const requestedMentions = [
      ...(data.mentionedUserIds || []),
      ...(replyParentAuthorId ? [replyParentAuthorId] : []),
    ];

    const mentionUserIds = await validateMentions(
      post.group.id,
      requestedMentions,
      userId,
    );

    const comment = await commentsRepository.create(
      {
        postId: data.postId,
        authorId: userId,
        parentCommentId: data.parentCommentId || null,
        content: data.content,
      },
      mentionUserIds,
    );

    const authorName = comment.author?.fullName || 'Someone';

    if (replyParentAuthorId) {
      await notificationsService.notifyUsers([replyParentAuthorId], {
        title: 'New reply',
        message: `${authorName} replied to your comment`,
        link: discussionLink(post.group.id, post.id, comment.id),
      });
    }

    const mentionTargets = mentionUserIds.filter(
      (id) => id !== userId && id !== replyParentAuthorId,
    );
    if (mentionTargets.length) {
      await notificationsService.notifyUsers(mentionTargets, {
        title: 'You were mentioned',
        message: `${authorName} mentioned you in a discussion`,
        link: discussionLink(post.group.id, post.id, comment.id),
      });
    }

    const detailed = await commentsRepository.findByIdDetailed(comment.id);
    return mapComment(detailed, userId);
  },

  update: async (id, data, userId) => {
    const comment = await commentsRepository.findById(id);
    if (!comment) throw ApiError.notFound('Comment not found');
    if (comment.authorId !== userId) throw ApiError.forbidden();

    await assertGroupMember(comment.post.groupId, userId);

    const updated = await commentsRepository.update(id, {
      content: data.content,
      editedAt: new Date(),
    });
    return mapComment(updated, userId);
  },

  vote: async (id, value, userId) => {
    if (![1, -1].includes(value)) throw ApiError.badRequest('Invalid vote value');

    const comment = await commentsRepository.findById(id);
    if (!comment) throw ApiError.notFound('Comment not found');

    await assertGroupMember(comment.post.groupId, userId);

    const detailed = await commentsRepository.findByIdDetailed(id);
    const existingVote = getUserVote(detailed?.votes, userId);

    if (existingVote === value) {
      await commentsRepository.removeVote(id, userId);
    } else {
      await commentsRepository.upsertVote(id, userId, value);
    }

    const refreshed = await commentsRepository.findByIdDetailed(id);
    return {
      voteScore: computeVoteScore(refreshed?.votes),
      userVote: existingVote === value ? null : value,
    };
  },

  remove: async (id, userId) => {
    const comment = await commentsRepository.findById(id);
    if (!comment) throw ApiError.notFound('Comment not found');
    if (comment.authorId !== userId) throw ApiError.forbidden();
    await commentsRepository.softDelete(id);
    return true;
  },
};
