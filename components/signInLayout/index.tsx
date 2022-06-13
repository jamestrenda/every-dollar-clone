import Link from 'next/link';
import { Logo } from '../logo';

export default function SignInLayout({ children }) {
  return (
    <div className="grid justify-center p-8 pb-12">
      <div className="flex justify-center">
        <Link href="/">
          <a>
            <Logo className="justify-center" />
          </a>
        </Link>
      </div>
      {children}
    </div>
  );
}
