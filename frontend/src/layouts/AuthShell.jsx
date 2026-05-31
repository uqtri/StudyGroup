export const AuthShell = ({ children }) => (
  <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12 sm:py-16">
    <div className="w-full max-w-md surface-panel p-8 sm:p-10">{children}</div>
  </div>
);
