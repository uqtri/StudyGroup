import { ROLES } from '../constants/roles';

let _id = 1;
const nextId = () => `test-id-${_id++}`;

// ─── User ────────────────────────────────────────────────────────────────────

export const UserFactory = {
  build: (overrides = {}) => ({
    id: nextId(),
    fullName: 'Alice Smith',
    email: 'alice@example.com',
    avatar: null,
    bio: 'A test user.',
    roles: [ROLES.MEMBER],
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),

  buildAdmin: (overrides = {}) =>
    UserFactory.build({ roles: [ROLES.ADMIN], email: 'admin@example.com', ...overrides }),

  buildLeader: (overrides = {}) =>
    UserFactory.build({ roles: [ROLES.LEADER], email: 'leader@example.com', ...overrides }),
};

// ─── Auth Response ───────────────────────────────────────────────────────────

export const AuthResponseFactory = {
  build: (userOverrides = {}) => ({
    user: UserFactory.build(userOverrides),
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  }),
};

// ─── Group ───────────────────────────────────────────────────────────────────

export const GroupFactory = {
  build: (overrides = {}) => ({
    id: nextId(),
    name: 'React Study Group',
    description: 'A group for studying React.',
    subject: 'Computer Science',
    maxMembers: 20,
    status: 'ACTIVE',
    isPrivate: false,
    createdBy: nextId(),
    createdAt: '2024-01-01T00:00:00.000Z',
    _count: { members: 5, sessions: 3, resources: 10 },
    ...overrides,
  }),

  buildList: (count = 3, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      GroupFactory.build({ name: `Group ${i + 1}`, ...overrides }),
    ),
};

// ─── Session ─────────────────────────────────────────────────────────────────

export const SessionFactory = {
  build: (overrides = {}) => ({
    id: nextId(),
    title: 'Introduction to Testing',
    description: 'Learn testing fundamentals.',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 90000000).toISOString(),
    status: 'SCHEDULED',
    groupId: nextId(),
    group: { name: 'React Study Group' },
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),

  buildList: (count = 3, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      SessionFactory.build({ title: `Session ${i + 1}`, ...overrides }),
    ),
};

// ─── Resource ────────────────────────────────────────────────────────────────

export const ResourceFactory = {
  build: (overrides = {}) => ({
    id: nextId(),
    title: 'React Best Practices.pdf',
    fileType: 'pdf',
    fileSize: 204800,
    fileUrl: 'https://example.com/file.pdf',
    uploadedBy: nextId(),
    groupId: nextId(),
    folderId: null,
    rating: 4.5,
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),

  buildList: (count = 3, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      ResourceFactory.build({ title: `Resource ${i + 1}`, ...overrides }),
    ),
};

// ─── Post (Discussion) ────────────────────────────────────────────────────────

export const PostFactory = {
  build: (overrides = {}) => ({
    id: nextId(),
    title: 'How do I use useEffect?',
    content: 'I have a question about useEffect...',
    authorId: nextId(),
    author: UserFactory.build(),
    groupId: nextId(),
    upvotes: 3,
    downvotes: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    _count: { comments: 2 },
    ...overrides,
  }),
};

// ─── Paginated response wrapper ───────────────────────────────────────────────

export const paginatedResponse = (items, overrides = {}) => ({
  items,
  total: items.length,
  page: 1,
  limit: 20,
  totalPages: 1,
  ...overrides,
});

// ─── API Response wrapper ─────────────────────────────────────────────────────

export const apiSuccess = (data) => ({ data: { data } });
