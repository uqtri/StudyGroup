export const userId = 'user-1';
export const otherUserId = 'user-2';
export const groupId = 'group-1';
export const postId = 'post-1';
export const sessionId = 'session-1';
export const resourceId = 'resource-1';
export const folderId = 'folder-1';

export const mockGroup = {
  id: groupId,
  name: 'Math Study',
  subject: 'Calculus',
  status: 'ACTIVE',
  maxMembers: 50,
  createdBy: userId,
  members: [{ userId, role: 'LEADER' }],
};

export const mockPost = {
  id: postId,
  groupId,
  title: 'Question',
  content: 'Help with chapter 3',
  authorId: userId,
  createdAt: new Date('2026-01-01'),
  editedAt: null,
  votes: [],
  group: { id: groupId },
  _count: { comments: 2 },
};

export const mockSession = {
  id: sessionId,
  groupId,
  title: 'Weekly call',
  status: 'IN_PROGRESS',
  createdBy: userId,
  startTime: new Date(),
  endTime: null,
  group: { name: 'Math Study' },
};

export const mockResource = {
  id: resourceId,
  groupId,
  folderId,
  title: 'Lecture notes.pdf',
  uploadedBy: userId,
};

export const mockFolder = {
  id: folderId,
  groupId,
  name: 'Week 1',
  description: 'Materials',
};
