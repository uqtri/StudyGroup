import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ROLES = ['ADMIN', 'LEADER', 'MEMBER'];

async function main() {
  for (const name of ROLES) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const leaderRole = await prisma.role.findUnique({ where: { name: 'LEADER' } });
  const memberRole = await prisma.role.findUnique({ where: { name: 'MEMBER' } });

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@studyhub.com' },
    update: {},
    create: {
      email: 'admin@studyhub.com',
      passwordHash,
      fullName: 'System Admin',
      bio: 'Platform administrator',
      roles: { create: { roleId: adminRole.id } },
    },
  });

  const leader = await prisma.user.upsert({
    where: { email: 'leader@studyhub.com' },
    update: {},
    create: {
      email: 'leader@studyhub.com',
      passwordHash,
      fullName: 'Group Leader',
      bio: 'Study group leader',
      roles: {
        create: [{ roleId: leaderRole.id }, { roleId: memberRole.id }],
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@studyhub.com' },
    update: {},
    create: {
      email: 'student@studyhub.com',
      passwordHash,
      fullName: 'Student User',
      bio: 'Active learner',
      roles: { create: { roleId: memberRole.id } },
    },
  });

  const group = await prisma.studyGroup.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Algorithms Study Circle',
      description: 'Weekly DSA practice and problem solving',
      subject: 'Computer Science',
      maxMembers: 15,
      createdBy: leader.id,
      members: {
        create: [
          { userId: leader.id, role: 'LEADER' },
          { userId: student.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const now = new Date();
  const sessionStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const sessionEnd = new Date(sessionStart.getTime() + 2 * 60 * 60 * 1000);

  const session = await prisma.studySession.create({
    data: {
      groupId: group.id,
      title: 'Binary Trees Deep Dive',
      description: 'Traversal, BST operations, and interview patterns',
      startTime: sessionStart,
      endTime: sessionEnd,
      meetingLink: 'https://meet.example.com/algorithms',
      createdBy: leader.id,
      status: 'SCHEDULED',
      attendances: {
        create: [
          { userId: leader.id, status: 'PRESENT', checkedAt: now },
          { userId: student.id, status: 'ABSENT' },
        ],
      },
    },
  });

  await prisma.resourceFolder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      groupId: group.id,
      name: 'General',
      createdBy: leader.id,
    },
  });

  await prisma.resource.create({
    data: {
      groupId: group.id,
      folderId: '00000000-0000-0000-0000-000000000010',
      uploadedBy: leader.id,
      title: 'Binary Tree Cheatsheet',
      description: 'Quick reference for tree algorithms',
      fileUrl: 'https://example.com/files/tree-cheatsheet.pdf',
      fileType: 'application/pdf',
    },
  });

  const post = await prisma.post.create({
    data: {
      groupId: group.id,
      authorId: leader.id,
      title: 'Welcome to the group!',
      content: 'Introduce yourself and share your study goals.',
      comments: {
        create: {
          authorId: student.id,
          content: 'Excited to learn together!',
        },
      },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        title: 'New Session',
        message: `Upcoming session: ${session.title}`,
        link: `/sessions/${session.id}`,
      },
      {
        userId: leader.id,
        title: 'New Member',
        message: `${student.fullName} joined your group`,
      },
    ],
  });

  console.log('Seed completed:', {
    admin: admin.email,
    leader: leader.email,
    student: student.email,
    group: group.name,
    post: post.title,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
