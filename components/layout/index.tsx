import styled, { createGlobalStyle } from 'styled-components';
import tw from 'twin.macro';
import { Footer } from '../footer';
import { Modal } from '../modal';
import { useModal } from '../modalStateProvider';
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
  const {
    modal: { visible: isModalVisible },
  } = useModal();
  return (
    <>
      <GlobalStyles />
      <main className="bg-white">{children}</main>
      <Footer />
      {isModalVisible && <Modal />}
    </>
  );
};

export default Layout;
