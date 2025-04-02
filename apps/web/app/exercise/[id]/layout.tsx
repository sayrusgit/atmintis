import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exercise | atmintis',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="container-size-sm">{children}</div>;
};

export default Layout;
