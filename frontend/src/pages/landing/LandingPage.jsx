import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Star,
} from 'lucide-react';
import { groupApi } from '../../api/groupApi';
import { sessionApi } from '../../api/sessionApi';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatDateTime } from '../../utils/formatDate';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

const features = [
  {
    icon: Users,
    title: 'Group collaboration',
    desc: 'Create and join study groups tailored to your subjects and goals.',
    tint: 'bg-primary/8',
  },
  {
    icon: Calendar,
    title: 'Session scheduling',
    desc: 'Plan study sessions with meeting links and shared calendars.',
    tint: 'bg-elevated',
  },
  {
    icon: FileText,
    title: 'Resource sharing',
    desc: 'Upload notes, PDFs, and materials in one searchable library.',
    tint: 'bg-elevated',
  },
  {
    icon: TrendingUp,
    title: 'Attendance tracking',
    desc: 'Stay accountable with participation records for every session.',
    tint: 'bg-primary/8',
  },
  {
    icon: BarChart3,
    title: 'Learning analytics',
    desc: 'See attendance trends and session insights at a glance.',
    tint: 'bg-elevated',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    text: 'StudyHub helped our algorithms group stay organized. We went from scattered chats to structured weekly sessions.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Group Leader',
    text: 'Managing join requests and attendance used to be a nightmare. Now everything lives in one place.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Biology Major',
    text: 'The resource library saved us hours. Past exam notes from seniors made all the difference.',
    rating: 5,
  },
];

export const LandingPage = () => {
  const { data: groupsData } = useQuery({
    queryKey: ['landing-groups'],
    queryFn: () => groupApi.list({ limit: 6 }).then((r) => r.data.data),
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['landing-sessions'],
    queryFn: () =>
      sessionApi.list({ limit: 5, upcoming: 'true' }).then((r) => r.data.data),
  });

  const groups = groupsData?.items || [];
  const sessions = sessionsData?.items || [];

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              Built for student teams
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl lg:leading-[1.05]">
              Study better,{' '}
              <span className="text-primary">together</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Groups, sessions, resources, and attendance in one calm workspace for your cohort.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="gap-2 px-6">
                  Get started <ArrowRight size={18} strokeWidth={1.75} />
                </Button>
              </Link>
              <Link to="/groups">
                <Button variant="outline" className="px-6">
                  Browse groups
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border shadow-elevated">
            <img
              src={HERO_IMAGE}
              alt="Students collaborating in a library"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-sm font-medium text-white">
                {groups.length > 0 ? `${groups.length}+ active groups` : 'Join your first group'}
              </p>
              <p className="text-xs text-white/80">Sessions and resources, organized</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Everything your study group needs
          </h2>
          <p className="mt-3 text-muted">
            Purpose-built tools for students and group leaders, without the clutter.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className={`lg:col-span-3 ${features[0].tint}`}>
            <FeatureCell feature={features[0]} large />
          </Card>
          <Card className={`lg:col-span-3 ${features[1].tint}`}>
            <FeatureCell feature={features[1]} large />
          </Card>
          {features.slice(2).map((f) => (
            <Card key={f.title} className={`lg:col-span-2 ${f.tint}`}>
              <FeatureCell feature={f} />
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-elevated py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Popular groups</h2>
              <p className="mt-2 text-muted">Active communities you can join today</p>
            </div>
            <Link to="/groups" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <Card key={g.id}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] bg-primary/10 text-lg font-bold text-primary">
                  {g.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-foreground">{g.name}</h3>
                <p className="text-sm text-muted">{g.subject}</p>
                <p className="mt-2 text-xs text-muted">{g._count?.members || 0} members</p>
                <Link to={`/groups/${g.id}`} className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    View group
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Upcoming sessions</h2>
        <p className="mt-2 text-muted">Your next meetups, in chronological order</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {sessions.map((s) => (
            <Card key={s.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted">{s.group?.name}</p>
                <p className="mt-1 text-xs font-medium text-primary">{formatDateTime(s.startTime)}</p>
              </div>
              <Link to={`/sessions/${s.id}`} className="shrink-0">
                <Button variant="outline">Details</Button>
              </Link>
            </Card>
          ))}
          {!sessions.length && (
            <p className="text-muted">No upcoming sessions yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-elevated py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            What students say
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} className="fill-warning text-warning" strokeWidth={1.75} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCell = ({ feature, large }) => {
  const Icon = feature.icon;
  return (
    <>
      <div className="mb-4 inline-flex rounded-[var(--radius-control)] bg-primary/10 p-2.5 text-primary">
        <Icon size={large ? 24 : 20} strokeWidth={1.75} />
      </div>
      <h3 className={large ? 'text-xl font-semibold' : 'font-semibold'}>{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{feature.desc}</p>
    </>
  );
};
