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
import { relative } from 'path';
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
  const loading = status === 'loading';
  const authenticated = status === 'authenticated';

  const { setActiveItem } = useSidebar();
  const { modal } = useModal();
  const { open } = useTransactionMenu();

  const handleClick = ({ target }) => {
    const overviewSection = target.closest('.sidebar__itemOverview');
    const budgetHeader = target.closest('.budgetHeader');
    if (!overviewSection && !budgetHeader && !modal.visible && !open) {
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
      {loading ? (
        <PageSpinner />
      ) : authenticated ? (
        <div
          className="flex max-h-screen overflow-hidden"
          onClick={handleClick}
        >
          <Header />
          <main className="relative flex-grow bg-gray-50 px-12 overflow-y-scroll overflow-x-hidden">
            {children}
          </main>
        </div>
      ) : (
        <>
          <main className="bg-white">{children}</main>
          <Footer />
        </>
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
