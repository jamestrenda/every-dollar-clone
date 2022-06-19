import { Spinner } from '../spinner';

type PageLoaderProps = {
  align?: string; // tailwind css class name
  size?: string; // tailwind css class name
  className?: string; // tailwind css class name
};
export const PageSpinner = ({
  align,
  size = 'h-8 w-8',
  className = '',
}: PageLoaderProps) => {
  return (
    <div
      className={`grid ${
        align || 'place-items-center'
      } absolute top-1/2 -translate-y-1/2 left-0 right-0`}
    >
      <Spinner align={align} size={size} className={className} />
    </div>
  );
};
