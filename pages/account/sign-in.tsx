import { getSession } from 'next-auth/react';
import { getCsrfToken } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from '../../components/logo';
import SignIn from '../../components/signIn';

export default function SignInPage({ providers, session, csrfToken }) {
  return (
    <div className="grid justify-center py-8 md:pt-12">
      <div className="flex justify-center">
        <Link href="/">
          <a>
            <Logo className="justify-center" />
          </a>
        </Link>
      </div>
      <h1 className="text-4xl md:text-5xl text-center lg:text-6xl font-bold text-indigo-500 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mb-5 mt-5">
        Welcome Back!
      </h1>
      <h2 className="text-xl italic text-center md:text-xl lg:text-2xl font-medium mb-5">
        Sign in to your existing account.
      </h2>
      <SignIn csrfToken={csrfToken} />
    </div>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const csrfToken = await getCsrfToken(context);

  if (session) {
    return {
      redirect: {
        destination: '/budget',
        permanent: false,
      },
    };
  }

  return {
    props: { csrfToken },
  };
}
