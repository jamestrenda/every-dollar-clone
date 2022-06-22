import { getSession } from 'next-auth/react';
import { Budget } from '../../components/budget';
import { PageSpinner } from '../../components/pageSpinner';
import { Spinner } from '../../components/spinner';

export default function BudgetPage() {
  // if (!session) return <PageSpinner />;
  return <Budget />;
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
