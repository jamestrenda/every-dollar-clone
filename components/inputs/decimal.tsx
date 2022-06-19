import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

// TODO: allow for select all and delete

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

const DecimalInput = ({
  className = '',
  max = Number.MAX_SAFE_INTEGER,
  onValueChange = null,
  onBlur = null,
  onFocus = null,
  style = {},
  value = 0,
  useWhole = false,
  name,
  placeholder = '',
  tabIndex = -1,
  readOnly = false,
  ariaLabel = '',
  index = 0,
}) => {
  if (value) {
    const valueAbsTrunc = Math.trunc(Math.abs(value));

    // if (
    //   value !== valueAbsTrunc ||
    //   !Number.isFinite(value) ||
    //   Number.isNaN(value)
    // ) {
    //   message.error(`Invalid property value for '${name}'.`);
    // }
  }

  const handleKeyDown = useCallback(
    (e) => {
      const { key, keyCode } = e;
      if (value >= 0) {
        if (
          (value === 0 && !VALID_FIRST.test(key)) ||
          (value !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
        ) {
          return;
        }
        const valueString = value.toString();
        let nextValue;
        if (keyCode !== DELETE_KEY_CODE) {
          const nextValueString = value === 0 ? key : `${valueString}${key}`;
          nextValue = Number.parseInt(nextValueString, 10);
        } else {
          const nextValueString = valueString.slice(0, -1);
          nextValue =
            nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
        }
        if (nextValue > max) {
          return;
        }

        onValueChange(nextValue, e.target, index);
      }
    },
    [max, onValueChange, value]
  );
  const handleChange = useCallback(() => {
    // DUMMY TO AVOID REACT WARNING
  }, []);

  const options = {
    style: 'decimal',
    minimumFractionDigits: 2,
  };
  // if its a whole amount, leave off the .00
  // if (useWhole && value % 100 === 0) options.minimumFractionDigits = 0;
  let valueDisplay;
  if (value > 0) {
    valueDisplay = (value / 100).toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
  } else {
    valueDisplay = '';
  }

  return (
    <Input
      name={name}
      id={name}
      className={className}
      inputMode="numeric"
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={onValueChange && handleKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
      style={style}
      value={valueDisplay}
      tabIndex={tabIndex}
      readOnly={readOnly}
      autoComplete="off"
      aria-label={ariaLabel || placeholder}
    />
  );
};

DecimalInput.propTypes = {
  className: PropTypes.string,
  max: PropTypes.number,
  onValueChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.number,
  useWhole: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  tabIndex: PropTypes.string,
  ariaLabel: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default DecimalInput;
