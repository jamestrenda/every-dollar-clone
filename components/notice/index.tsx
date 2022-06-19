import { ReactNode } from 'react';
import {
  IoIosCloseCircle,
  IoIosAlert,
  IoIosCheckmarkCircle,
  IoIosWarning,
} from 'react-icons/io';

type NoticeProps = {
  type?: 'error' | 'warning' | 'info' | 'success';
  heading?: boolean;
  message: ReactNode | string;
  className?: string;
};

export const Notice = ({
  type,
  heading = false,
  message,
  className = '',
}: NoticeProps) => {
  return (
    <div
      className={`${
        type === 'error'
          ? 'bg-red-100'
          : type === 'warning'
          ? 'bg-yellow-50'
          : type === 'success'
          ? 'bg-green-100'
          : type === 'info'
          ? 'bg-indigo-100'
          : ''
      } px-5 py-4 my-5 flex text-left ${className}`}
    >
      <div
        className={`mt-1 mr-3 ${
          type === 'error'
            ? 'text-red-700'
            : type === 'warning'
            ? 'text-yellow-700'
            : type === 'success'
            ? 'text-green-700'
            : type === 'info'
            ? 'text-indigo-700'
            : ''
        }`}
      >
        {type === 'error' && <IoIosCloseCircle size="20" fill="currentColor" />}
        {type === 'warning' && <IoIosWarning size="20" fill="currentColor" />}
        {type === 'info' && <IoIosAlert size="20" fill="currentColor" />}
        {type === 'success' && (
          <IoIosCheckmarkCircle size="20" fill="currentColor" />
        )}
      </div>
      <div>
        {heading && (
          <p
            className={`font-medium mb-1 ${
              type === 'warning' ? 'text-yellow-700' : ''
            }`}
          >
            {heading ? (type === 'warning' ? 'Attention Needed' : '') : ''}
          </p>
        )}
        <p
          className={`${
            type === 'error'
              ? 'text-red-700'
              : type === 'success'
              ? 'text-green-700'
              : type === 'warning'
              ? 'text-yellow-700'
              : type === 'info'
              ? 'text-indigo-700'
              : ''
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
