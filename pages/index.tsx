import React from 'react';
import { Logo } from '../components/logo';
import { Button } from '../components/button';
import styled from 'styled-components';
import { useModal } from '../components/modalStateProvider';
import { getCsrfToken, getSession, useSession } from 'next-auth/react';
import { SignInSignUp } from '../components/signInSignUp';

const StyledHomepageBanner = styled.div`
  background-image: url('/gray-10-dot-brush-bottom.svg');
  background-position: top right;
  background-repeat: no-repeat;
`;

function HomePage({ csrfToken }) {
  const { data: session, status } = useSession();
  const { setModal } = useModal();

  // const html = React.createElement('p', {
  //   children: (
  //     <>
  //       Are you sure you want to delete{' '}
  //       <span className="font-bold">{item.name}</span>?
  //     </>
  //   ),
  // });

  return (
    <StyledHomepageBanner className="bg-indigo-900 p-5">
      <div className="flex justify-between items-center">
        <Logo responsive />
        {/* <Button href="/account/sign-in">Sign In</Button> */}
        {status === 'authenticated' ? (
          <p>Account</p>
        ) : (
          <Button
            onClick={() =>
              setModal({
                visible: true,
                message: <SignInSignUp show="SignIn" csrfToken={csrfToken} />,
                type: null,
              })
            }
          >
            Sign In
          </Button>
        )}
      </div>
      <div className="max-w-6xl mx-auto px-0 pt-24 pb-8 md:px-12 md:py-44 sm:text-center ">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-200 mb-5 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mt-5">
          Tell your money where to go instead of wondering where it went.
        </h1>
        <p className="text-xl italic md:text-xl lg:text-2xl font-bold text-white mb-16">
          Budget confidently with EveryDollar (<em>Ahem...</em>Clone)
        </p>
        {status === 'authenticated' ? (
          <Button href="/budget">Pick up Where You Left Off</Button>
        ) : (
          <Button
            onClick={() =>
              setModal({
                visible: true,
                message: <SignInSignUp show="SignUp" csrfToken={csrfToken} />,
                type: null,
              })
            }
          >
            Start Budgeting For Free
          </Button>
        )}
      </div>
    </StyledHomepageBanner>
  );
}

// HomePage.getLayout = function getLayout(page) {
//  return <CustomLayout>{page}</CustomLayout>;
// };
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const csrfToken = await getCsrfToken(context);

  if (session) {
    return {
      props: {
        session,
      },
    };
  }

  return {
    props: { csrfToken },
  };
}

export default HomePage;
