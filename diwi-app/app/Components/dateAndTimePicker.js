import React from "react";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format, set } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

export default function DateAndTimePicker() {
  const [selectedDate, setSelectedDate] = React.useState();
  const [selectedTime, setSelectedTime] = React.useState("12:00");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = set(selectedDate, { hours, minutes });
      setSelectedDate(newDate);
    }
  };

  const formatDateTime = () => {
    if (selectedDate) {
      return format(selectedDate, "PPP p");
    }
    return "";
  };

  return (
    <div className="p-24">
      <Popover placement="bottom">
        <PopoverHandler>
          <Input
            label="Select Date and Time"
            onChange={() => null}
            value={formatDateTime()}
          />
        </PopoverHandler>
        <PopoverContent>
          <div className="flex flex-col items-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              showOutsideDays
              className="border-0"
              classNames={{
                caption: "flex justify-center py-2 mb-4 relative items-center",
                caption_label: "text-sm font-medium text-gray-900",
                nav: "flex items-center",
                nav_button:
                  "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                nav_button_previous: "absolute left-1.5",
                nav_button_next: "absolute right-1.5",
                table: "w-full border-collapse",
                head_row: "flex font-medium text-gray-900",
                head_cell: "m-0.5 w-9 font-normal text-sm",
                row: "flex w-full mt-2",
                cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal",
                day_range_end: "day-range-end",
                day_selected:
                  "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                day_today: "rounded-md bg-gray-200 text-gray-900",
                day_outside:
                  "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                day_disabled: "text-gray-500 opacity-50",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: ({ ...props }) => (
                  <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                ),
                IconRight: ({ ...props }) => (
                  <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                ),
              }}
            />
            <div className="mt-4">
              <TimePicker
                onChange={handleTimeChange}
                value={selectedTime}
                disableClock={true}
                clearIcon={null}
                format="HH:mm"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}