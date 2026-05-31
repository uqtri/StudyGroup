export const computeVoteScore = (votes = []) =>
  votes.reduce((sum, v) => sum + v.value, 0);

export const getUserVote = (votes = [], userId) => {
  if (!userId) return null;
  const row = votes.find((v) => v.userId === userId);
  return row ? row.value : null;
};

export const attachVoteMeta = (entity, userId) => {
  const votes = entity.votes || [];
  const { votes: _votes, ...rest } = entity;
  return {
    ...rest,
    voteScore: computeVoteScore(votes),
    userVote: getUserVote(votes, userId),
  };
};

export const sortByVoteScore = (items, sortOrder = 'desc') => {
  const dir = sortOrder === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const scoreDiff = (b.voteScore - a.voteScore) * dir;
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};
