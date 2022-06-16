import { PasswordReset } from '../../components/passwordReset';

export default function PasswordResetPage({ token }) {
  return <PasswordReset resetToken={token} />;
}

export async function getServerSideProps(context) {
  const { query } = context;
  if (!query.resetToken) {
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
