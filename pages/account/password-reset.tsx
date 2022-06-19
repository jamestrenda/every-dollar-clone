import { getSession } from 'next-auth/react';
import { PasswordReset } from '../../components/passwordReset';

export default function PasswordResetPage({ token }) {
  return <PasswordReset resetToken={token} />;
}

export async function getServerSideProps(context) {
  const { query } = context;
  const session = await getSession(context);

  // there will be a dedicated page under account settings where logged in users can change their password.

  // so if a user accesses this page without the resetToken or they're already logged in...
  // redirect to homepage.

  // if they're logged in, they will then be re-directed to the budget page (see components/budget.tsx)
  if (!query.resetToken || session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: { token: query.resetToken },
  };
}
