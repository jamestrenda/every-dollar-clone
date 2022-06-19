import { getSession } from 'next-auth/react';
import { ForgotPassword } from '../../components/forgotPassword';

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}

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
