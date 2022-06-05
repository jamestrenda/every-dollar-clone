import { UserProvider } from '@auth0/nextjs-auth0';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return getLayout(
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
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
