// import App from 'next/app'
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { client } from '../lib/apollo';
import Layout from '../components/layout';
import '../lib/tailwind.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Layout>{page}</Layout>
        </ApolloProvider>
      </SessionProvider>
    ));
  return getLayout(<Component {...pageProps} />);
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
