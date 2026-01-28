'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month (0 = Sunday, we want Monday = 0)
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar grid
  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (day: number | null) => {
    if (!day) return false;
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="rounded-lg p-5 bg-[#0a0a0a] border border-[#a855f7]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#a855f7]/10">
            <Calendar size={16} className="text-[#a855f7]" />
          </div>
          <span className="text-white font-mono text-sm">
            {MONTHS[month]} {year}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={goToToday}
            className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs text-zinc-600 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square flex items-center justify-center text-sm rounded-md transition-colors",
              day === null && "text-transparent",
              day !== null && !isToday(day) && "text-zinc-400 hover:bg-white/5",
              isToday(day) && "bg-[#a855f7] text-white font-medium"
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
