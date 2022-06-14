import { getSession, useSession } from 'next-auth/react';
import { Spinner } from '../../components/spinner';

export default function AccountPage() {
  const { data: session, status } = useSession();

  return status === 'authenticated' ? (
    <>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto text-center">
        <h1 className="">My Account</h1>
        <p>(Coming Soon)</p>
      </div>
    </>
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
