import { IoIosCloseCircle, IoIosAlert } from 'react-icons/io';

export const Notice = ({
  type,
  message,
}: {
  type: 'error' | 'warning' | 'info' | 'success';
  message: any;
}) => {
  return (
    <div
      className={`${
        type === 'error' ? 'bg-red-100' : type === 'info' ? 'bg-indigo-100' : ''
      } px-5 py-4 my-5 flex`}
    >
      <div
        className={`mt-1 mr-3 ${
          type === 'error'
            ? 'text-red-700'
            : type === 'info'
            ? 'text-indigo-700'
            : ''
        }`}
      >
        {type === 'error' && <IoIosCloseCircle size="20" fill="currentColor" />}
        {type === 'info' && <IoIosAlert size="20" fill="currentColor" />}
      </div>
      <p
        className={`${
          type === 'error'
            ? 'text-red-700'
            : type === 'info'
            ? 'text-indigo-700'
            : ''
        }`}
      >
        {message}
      </p>
    </div>
  );
};
