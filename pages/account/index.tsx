import { getSession, useSession } from 'next-auth/react';
import SignOut from '../../components/signOut';
import { Spinner } from '../../components/spinner';

export default function AccountPage() {
  const { data: session, status } = useSession();

  return status === 'authenticated' ? (
    <div>
      <h1>My Account</h1>
      <div>
        <div>
          {session.user?.firstName
            ? `Hi, ${session.user?.firstName}!`
            : `Signed in as ${session.user?.email}`}
        </div>
      </div>
      <SignOut />
    </div>
  ) : (
    <Spinner />
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/account/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
// AccountPage.auth = {
//   role: 'admin',
//   loading: 'loading...',
//   unauthorized: '/', // redirect to this url
// };
