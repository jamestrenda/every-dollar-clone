// import App from 'next/app'
import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { client } from '../lib/apollo';
import Layout from '../components/layout';
import '../lib/tailwind.css';
import { ModalStateProvider } from '../components/modalStateProvider';
import { NextPage } from 'next';
import { TransactionMenuStateProvider } from '../components/transactionMenuProvider';
import { SidebarStateProvider } from '../components/sidebarStateProvider';
import { PageSpinner } from '../components/pageSpinner';
import { MenuStateProvider } from '../components/menuStateProvider';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <MenuStateProvider>
          <ModalStateProvider>
            <TransactionMenuStateProvider>
              <SidebarStateProvider>
                {getLayout(<Component {...pageProps} />)}
              </SidebarStateProvider>
            </TransactionMenuStateProvider>
          </ModalStateProvider>
        </MenuStateProvider>
      </ApolloProvider>
    </SessionProvider>
  );
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
