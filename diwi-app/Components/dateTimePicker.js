import React, { useState } from 'react';
import { Input } from '@material-tailwind/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({ label, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="MMMM d, yyyy h:mm aa"
        customInput={
          <Input
            label={label || "Select Date and Time"}
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: "hidden",
            }}
            containerProps={{ className: "min-w-[200px]" }}
          />
        }
      />
    </div>
  );
};

export default DateTimePicker;