import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

// TODO: maybe modify the button component instead to include a tooltip

export const ToolTip = ({ tip = '', position = 'top' }) => {
  return (
    <div
      className={`mt-4 font-sm whitespace-nowrap opacity-0 group-hover:opacity-100 p-2 absolute ${position}-0 group-hover:${
        position === 'bottom' || position === 'left' ? '-' : ''
      }${position}-full`}
    >
      {tip}
    </div>
  );
};
