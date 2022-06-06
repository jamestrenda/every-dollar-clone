import { getSession } from 'next-auth/react';
import { useUser } from '../../components/user';
import SignOut from '../../components/signOut';

export default function AccountPage({ data }) {
  const user = useUser();
  console.log({ user });
  return (
    <div>
      <h1>My Account</h1>
      <div>
        <div>{user?.firstName ? `Hi, ${user.firstName}!` : 'Welcome'}</div>
      </div>
      <SignOut />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log('from getServerSideProps...', { session });
  if (!session) {
    return {
      redirect: {
        destination: '/account/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: { data: session },
  };
}
// AccountPage.auth = {
//   role: 'admin',
//   loading: 'loading...',
//   unauthorized: '/', // redirect to this url
// };
