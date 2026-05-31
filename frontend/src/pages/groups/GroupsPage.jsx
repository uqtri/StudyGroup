import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { groupApi } from '../../api/groupApi';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { GroupsPageSkeleton } from '../../components/skeletons/LoadingSkeletons';
import { Input } from '../../components/common/Input';

export const GroupsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [sort, setSort] = useState('createdAt');

  const { data, isLoading } = useQuery({
    queryKey: ['groups', search, subject, sort],
    queryFn: () =>
      groupApi
        .list({ limit: 50, search: search || undefined, sortBy: sort, sortOrder: 'desc' })
        .then((r) => r.data.data),
  });

  const groups = useMemo(() => {
    let items = data?.items || [];
    if (subject) items = items.filter((g) => g.subject.toLowerCase().includes(subject.toLowerCase()));
    if (sort === 'members') {
      items = [...items].sort((a, b) => (b._count?.members || 0) - (a._count?.members || 0));
    }
    return items;
  }, [data, subject, sort]);

  const handleJoin = (groupId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/groups/${groupId}`);
  };

  if (isLoading) return <GroupsPageSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Explore groups"
        description="Find and join study communities"
        action={
          isAuthenticated ? (
            <Link to="/groups/create">
              <Button className="gap-2">
                <Plus size={16} strokeWidth={1.75} /> Create group
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[var(--radius-control)] border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <Input
          placeholder="Filter by subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        >
          <option value="createdAt">Sort by Activity</option>
          <option value="members">Sort by Members</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="flex flex-col">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-xl font-bold text-primary">
              {group.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-foreground">{group.name}</h3>
            <p className="text-sm text-primary">{group.subject}</p>
            <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{group.description}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <Users size={14} />
              {group._count?.members || 0} members
            </div>
            <div className="mt-4 flex gap-2">
              <Link to={`/groups/${group.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View
                </Button>
              </Link>
              <Button className="flex-1" onClick={() => handleJoin(group.id)}>
                Join
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!groups.length && (
        <p className="py-12 text-center text-muted">No groups match your search.</p>
      )}
    </div>
  );
};
