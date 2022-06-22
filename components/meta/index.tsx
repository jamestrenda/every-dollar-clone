import Head from 'next/head';
import { PageTitle } from '../pageTitle';
const Meta = () => (
  <>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta charSet="utf-8" />
    </Head>
    <PageTitle />
  </>
);

export { Meta };
