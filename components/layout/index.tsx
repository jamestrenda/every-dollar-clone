import styled, { createGlobalStyle } from 'styled-components';
import tw from 'twin.macro';
import { Footer } from '../footer';
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
  return (
    <>
      <GlobalStyles />
      <main className="bg-white">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
