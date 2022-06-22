import Head from 'next/head';
import { ReactNode } from 'react';

interface IPageTitleProps {
  title?: string;
  children?: ReactNode;
}

const PageTitle = ({ title = '', children }: IPageTitleProps) => {
  return (
    <Head>
      <title>{title || children} • Every Dollar (Clone)</title>
    </Head>
  );
};

export { PageTitle };
