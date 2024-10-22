import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
      {format(time, 'hh:mm:ss a')}
    </div>
  );
};

export default Clock;