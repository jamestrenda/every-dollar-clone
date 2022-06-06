import { getSession } from 'next-auth/react';
import SignIn from '../../components/signIn';

export default function SignInPage({ providers, session, csrfToken }) {
  return <SignIn />;
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
