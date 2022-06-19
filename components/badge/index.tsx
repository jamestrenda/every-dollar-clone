import React from 'react';

export const Badge = ({ children, className }) => {
  return (
    <span className={`rounded-full py-1 px-3 text-xs ${className}`}>
      {children}
    </span>
  );
};
