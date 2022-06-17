import { useSession } from 'next-auth/react';
import styled, { createGlobalStyle } from 'styled-components';
import tw from 'twin.macro';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Footer } from '../footer';
import Header from '../header';
import { Modal } from '../modal';
import { useModal } from '../modalStateProvider';
import { PageSpinner } from '../pageSpinner';
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
  const loading = status === 'loading';
  console.log({ loading });
  const {
    modal: { visible: isModalVisible },
  } = useModal();

  return (
    <>
      <GlobalStyles />
      {loading ? (
        <PageSpinner />
      ) : session ? (
        <div
          className="flex max-h-screen overflow-hidden"
          // onClick={handleClick}
        >
          <Header />
          <main className="relative flex-grow bg-gray-50 px-12 overflow-y-scroll overflow-x-hidden">
            {children}
          </main>
          {/* {modal.visible && <Modal />} */}
        </div>
      ) : (
        <>
          <main className="bg-white">{children}</main>
          <Footer />
        </>
      )}

      {isModalVisible && (
        <LazyMotion features={domAnimation}>
          <m.div
            initial="modalInitial"
            animate="modalAnimate"
            variants={{
              modalInitial: {
                opacity: 0,
              },
              modalAnimate: {
                opacity: 1,
              },
            }}
          >
            <Modal />
          </m.div>
        </LazyMotion>
      )}
    </>
  );
};

export default Layout;
