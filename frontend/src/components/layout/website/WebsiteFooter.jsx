import { Link } from 'react-router-dom';
import { Logo } from '../../common/Logo';

const footerSections = [
  {
    title: 'About',
    links: [
      { label: 'Our Mission', to: '/' },
      { label: 'How It Works', to: '/groups' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
    ],
  },
];

export const WebsiteFooter = () => (
  <footer className="mt-auto border-t border-border bg-surface">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-lg" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Collaborate, schedule, and succeed together in your study groups.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
            <ul className="mt-3 space-y-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} StudyHub. All rights reserved.
      </div>
    </div>
  </footer>
);
