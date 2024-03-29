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
import { useMenu } from '../menuStateProvider';
import { Meta } from '../meta';

export const StyledPage = styled.div`
  &::before {
    content: '';
    height: 0;
    ${tw`absolute top-0 bottom-0 left-0 right-0 z-[999] !pointer-events-none opacity-0 transition-opacity bg-black bg-opacity-20`};
    ${({ menuOpen }) => menuOpen && tw`opacity-100 h-[9999px]`}
  }
`;

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
  const { status } = useSession();
  const { asPath, push } = useRouter();
  const { open: menuOpen, closeMenu } = useMenu();
  const [loading, setLoading] = useState(false);
  const loadingSession = status === 'loading';
  const authenticated = status === 'authenticated';
  const router = useRouter();
  const { setActiveItem } = useSidebar();
  const { modal } = useModal();
  const { open } = useTransactionMenu();

  // TODO: I can't remember if i'm atually using this effect or not...
  //       if memory serves, it's not actually doing anything
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

  useEffect(() => {
    function handleResize() {
      if (menuOpen) closeMenu();
    }

    window.addEventListener('resize', handleResize);
  });

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
      <Meta />
      {loadingSession ? (
        <PageSpinner />
      ) : authenticated ? (
        <div
          className={`flex max-h-screen overflow-hidden`}
          onClick={handleClick}
        >
          <Header />
          <StyledPage
            menuOpen={menuOpen}
            className={`${
              menuOpen
                ? 'overflow-hidden pointer-events-none'
                : 'overflow-y-scroll overflow-x-hidden'
            } relative flex-grow bg-gray-50 px-4 lg:px-12 `}
          >
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
          </StyledPage>
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
