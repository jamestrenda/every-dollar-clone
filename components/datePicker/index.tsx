import {
  useDisclosure,
  useOutsideClick,
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';

import {
  Calendar,
  CalendarDate,
  CalendarDefaultTheme,
} from '@uselessdev/datepicker';
import { isValid } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { formatDate } from '../../lib/formatDate';
import { BudgetItemInput } from '../budgetItemInput';

export const theme = extendTheme(CalendarDefaultTheme, {
  components: {
    Calendar: {
      parts: ['calendar'],

      baseStyle: {
        calendar: {
          zIndex: 9999,
          backgroundColor: 'white',
        },
      },
    },
  },
});

export const DatePicker = () => {
  const [date, setDate] = useState<CalendarDate>();
  const [value, setValue] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);

  const initialRef = useRef(null);
  const calendarRef = useRef(null);

  const handleSelectDate = (date: CalendarDate) => {
    setDate(date);
    setValue(() => (isValid(date) ? formatDate(date, 'MM/dd/yyyy') : ''));
    onClose();
  };

  const match = (value: string) => value.match(/(\d{2})\/(\d{2})\/(\d{4})/);

  const handleInputChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(target.value);

    if (match(target.value)) {
      onClose();
    }
  };

  useOutsideClick({
    ref: calendarRef,
    handler: onClose,
    enabled: isOpen,
  });

  useEffect(() => {
    if (match(value)) {
      const date = new Date(value);

      return setDate(date);
    }
  }, [value]);

  return (
    <Popup
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      on="click"
      trigger={
        <BudgetItemInput
          name="transactionDate"
          type="text"
          placeholder="Choose a Date"
          value={value}
          className="!pl-10"
          handleChange={() => handleSelectDate}
        />
      }
      hoverable={true}
      hideOnScroll={true}
      className="relative"
    >
      <Popup.Content>
        <Calendar
          value={{ start: date }}
          onSelectDate={handleSelectDate}
          singleDateSelection
        />
      </Popup.Content>
    </Popup>
  );
};
