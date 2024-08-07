import React from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const DateRangePickerComponent = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-gray-700">Application Period:</label>
      <DateRangePicker
        value={value}
        onChange={onChange}
        showOneCalendar
        placeholder="YYYY-MM-DD - YYYY-MM-DD"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
      />
    </div>
  );
};

export default DateRangePickerComponent;
