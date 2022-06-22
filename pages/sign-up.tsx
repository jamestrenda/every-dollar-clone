import { ReactElement } from 'react';
import { getSession, getCsrfToken } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from '../components/logo';
import SignInLayout from '../components/signInLayout';
import SignUp from '../components/signUp';

export default function SignUpPage({ csrfToken }) {
  return (
    <div className="grid justify-center py-8 md:pt-12 bg-gray-50">
      <div className="flex justify-center">
        <Link href="/">
          <a>
            <Logo className="justify-center" />
          </a>
        </Link>
      </div>
      <h1 className="text-4xl md:text-5xl text-center lg:text-6xl font-bold text-indigo-500 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mb-5 mt-5">
        Open a Free Account
      </h1>
      <p className="text-xl italic text-center md:text-xl lg:text-2xl font-bold mb-5 max-w-md mx-auto">
        Great decision. But don't stop now. Sign up today and start telling your
        money where to go.
      </p>
      <SignUp csrfToken={csrfToken} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const csrfToken = await getCsrfToken(context);

  if (session) {
    return {
      redirect: {
        destination: '/budget',
        permanent: false,
      },
    };
  }

  return {
    props: { csrfToken },
  };
}
// SignUpPage.getLayout = function getLayout(page: ReactElement) {
//   return <SignInLayout>{page}</SignInLayout>;
// };
