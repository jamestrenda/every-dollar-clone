import { useSession } from 'next-auth/react';
import styled, { createGlobalStyle } from 'styled-components';
import tw from 'twin.macro';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Footer } from '../footer';
import Header from '../header';
import { Modal } from '../modal';
import { useModal } from '../modalStateProvider';
import { PageSpinner } from '../pageSpinner';
import { BudgetProvider } from '../budgetProvider';
import { useTransactionMenu } from '../transactionMenuProvider';
import { useSidebar } from '../sidebarStateProvider';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function Loading({ status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = (url) => {
      setLoading(true);
    };
    const handleComplete = (url) => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });
  return loading && <PageSpinner />;
}

const GlobalStyles = createGlobalStyle`
  html {
    // custom-properties
    ${tw`bg-gray-100`} 
  }
  p + p {
    ${tw`mt-5`}
  }
`;

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const { asPath, push } = useRouter();

  const [loading, setLoading] = useState(false);
  const loadingSession = status === 'loading';
  const authenticated = status === 'authenticated';
  const router = useRouter();
  const { setActiveItem } = useSidebar();
  const { modal } = useModal();
  const { open } = useTransactionMenu();
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [asPath]);

  const handleClick = ({ target }) => {
    const overviewSection = target.closest('.sidebar__itemOverview');
    const budgetHeader = target.closest('.budgetHeader');
    const toast = target.closest('.toast');
    if (
      !overviewSection &&
      !budgetHeader &&
      !modal.visible &&
      !open &&
      !toast
    ) {
      // user clicked outside of the overview section in the sidebar, so we'll clear the active item
      // which will display the default sidebar overview
      setActiveItem(null);
    }
  };

  if (authenticated) {
    if (asPath === '/account/verify-email') {
      push('/budget');
      return <PageSpinner />;
    }
  }

  return (
    <>
      <GlobalStyles />
      {loadingSession ? (
        <PageSpinner />
      ) : authenticated ? (
        <div
          className="flex max-h-screen overflow-hidden"
          onClick={handleClick}
        >
          <Header />
          <main className="relative flex-grow bg-gray-50 px-4 lg:px-12 overflow-y-scroll overflow-x-hidden">
            {loading ? (
              <PageSpinner />
            ) : (
              <LazyMotion features={domAnimation}>
                <m.div
                  key={asPath}
                  initial="pageInitial"
                  animate="pageAnimate"
                  variants={{
                    pageInitial: {
                      opacity: 0,
                      // height: '100%',
                    },
                    pageAnimate: {
                      opacity: 1,
                      // height: '100%',
                    },
                  }}
                >
                  {children}
                </m.div>
              </LazyMotion>
            )}
          </main>
        </div>
      ) : (
        <LazyMotion features={domAnimation}>
          <m.div
            key={asPath}
            initial="pageInitial"
            animate="pageAnimate"
            variants={{
              pageInitial: {
                opacity: 0,
              },
              pageAnimate: {
                opacity: 1,
              },
            }}
          >
            <main className="bg-white">{children}</main>
            <Footer />
          </m.div>
        </LazyMotion>
      )}

      {modal?.visible && (
        <LazyMotion features={domAnimation}>
          <m.div
            initial="modalInitial"
            animate="modalAnimate"
            variants={{
              modalInitial: {
                opacity: 0,
                position: 'fixed',
                zIndex: 9999,
              },
              modalAnimate: {
                opacity: 1,
                position: 'fixed',
                zIndex: 9999,
              },
            }}
          >
            {modal?.context ? (
              <BudgetProvider
                value={{
                  ...modal.context,
                }}
              >
                <Modal />
              </BudgetProvider>
            ) : (
              <Modal />
            )}
          </m.div>
        </LazyMotion>
      )}
    </>
  );
};

export default Layout;
