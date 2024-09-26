import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format, set, isToday, isBefore, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export default function DateTimePicker({ selectedDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setInternalDate] = useState(selectedDate || new Date());
  const [hours, setHours] = useState(date.getHours());
  const [minutes, setMinutes] = useState(date.getMinutes());
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  const handleDateChange = (date) => {
    if (date) {
      const newDateTime = set(date, { hours, minutes });
      setInternalDate(newDateTime);
      onChange(newDateTime);
    }
  };

  const handleTimeChange = (newHours, newMinutes) => {
    const updatedHours = Math.max(0, Math.min(23, newHours));
    const updatedMinutes = Math.max(0, Math.min(59, newMinutes));
    setHours(updatedHours);
    setMinutes(updatedMinutes);
    const newDateTime = set(date, { hours: updatedHours, minutes: updatedMinutes });
    setInternalDate(newDateTime);
    onChange(newDateTime);
  };

  const formatDateTime = () => {
    return format(date, "PPP p");
  };

  const TimeInput = ({ value, onChange, onIncrement, onDecrement }) => (
    <div className="flex items-center">
      <input
        type="text"
        value={value.toString().padStart(2, '0')}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-8 text-center border rounded"
      />
      <div className="flex flex-col ml-1">
        <button onClick={onIncrement} className="text-gray-600 hover:text-gray-800">
          <ChevronUpIcon className="h-4 w-4" />
        </button>
        <button onClick={onDecrement} className="text-gray-600 hover:text-gray-800">
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-0">
    <Popover placement="bottom" open={isOpen} handler={setIsOpen}>
      <PopoverHandler>
        <Input
          label="Select Date and Time"
          onChange={() => null}
          value={formatDateTime()}
          onClick={() => setIsOpen(true)}
        />
      </PopoverHandler>
      <PopoverContent className="p-6 z-[9999]" ref={popoverRef}>
      {/* <PopoverContent className="z-[9999]"> */}
        <div className="flex justify-center flex-col items-center">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            showOutsideDays
            className="border-0"
            modifiers={{
              today: (day) => isToday(day),
              disabled: (day) => isBefore(day, startOfDay(new Date())),
            }}
            modifiersStyles={{
              today: { fontWeight: 'bold', color: 'orange' },
              disabled: { opacity: 0.5 },
            }}
            modifiersClassNames={{
              // today: "bg-accent text-accent-foreground",
              // today: "rounded-md bg-gray-200 text-gray-900",
              selected: "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
            }}
            disabled={(day) => isBefore(day, startOfDay(new Date()))}
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
          <div className="mt-4 mb-2 flex items-center">
            <TimeInput
              value={hours}
              onChange={(newHours) => handleTimeChange(newHours, minutes)}
              onIncrement={() => handleTimeChange(hours + 1, minutes)}
              onDecrement={() => handleTimeChange(hours - 1, minutes)}
            />
            <span className="mx-2">:</span>
            <TimeInput
              value={minutes}
              onChange={(newMinutes) => handleTimeChange(hours, newMinutes)}
              onIncrement={() => handleTimeChange(hours, minutes + 1)}
              onDecrement={() => handleTimeChange(hours, minutes - 1)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
    </div>
  );
}