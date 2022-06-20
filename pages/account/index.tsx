import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { getSession, signOut, useSession } from 'next-auth/react';
import tw from 'twin.macro';
import { Button } from '../../components/button';
import { useModal } from '../../components/modalStateProvider';
import { Spinner } from '../../components/spinner';
import { useRouter } from 'next/router';

const DELETE_USER_MUTATION = gql`
  mutation DELETE_USER_MUTATION($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { setModal } = useModal();

  const [deleteUser, { data, loading, error }] =
    useMutation(DELETE_USER_MUTATION);

  const { user } = session;
  const { id } = user;

  const handleDeleteUser = async () => {
    // alert('user deleted! (not really)');
    const { data } = await deleteUser({ variables: { id } });
    if (data?.deleteUser?.id) {
      await signOut();
    }
  };

  const html = React.createElement('p', {
    children: (
      <>
        Are you sure you want to delete your account,{' '}
        <span className="font-bold">{user.email}</span>?
      </>
    ),
  });

  return status === 'authenticated' ? (
    <div className="grid gap-5 p-8 h-full">
      <div className="">
        <h1 className="font-bold text-4xl mb-5">My Account</h1>
        <p>(Other stuff goes )</p>
      </div>
      <div className="self-end">
        <Button
          type="button"
          innerStyle={tw`bg-red-500 hover:bg-red-600 rounded-md py-2 px-4`}
          onClick={() =>
            setModal({
              title: `Delete Account`,
              btnText: 'Yes, delete it.',
              message: html,
              visible: true,
              callback: handleDeleteUser,
              type: 'delete',
            })
          }
        >
          Delete My Account
        </Button>
      </div>
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
        destination: '/',
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
