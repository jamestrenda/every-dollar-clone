import { signOut } from 'next-auth/react';
export default ({ className }: { className: string }) => (
  <button className={className} onClick={() => signOut()}>
    Sign Out
  </button>
);
