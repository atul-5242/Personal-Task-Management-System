'use client'

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-white/70 text-center py-2">
            {day}
          </div>
        ))}
        
        {days.map((day: Date) => (
          <div
            key={day.toISOString()}
            className={`
              p-2 border border-white/10 rounded-lg min-h-[100px]
              ${isToday(day) ? 'bg-purple-500/20' : 'hover:bg-white/5'}
              ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
            `}
          >
            <span className="text-white/90">{format(day, 'd')}</span>
            {/* Task indicators would go here */}
          </div>
        ))}
      </div>
    </div>
  );
} 