import { getSession } from 'next-auth/react';
import { getCsrfToken } from 'next-auth/react';
import SignIn from '../../components/signIn';

export default function SignInPage({ providers, session, csrfToken }) {
  return <SignIn csrfToken={csrfToken} />;
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const csrfToken = await getCsrfToken(context);

  if (session) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: { csrfToken },
  };
}
