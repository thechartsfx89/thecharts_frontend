
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Countdown effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Trigger onTimeUp when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full  ${
        timeLeft <= 10 ? 'bg-red-50 text-red-600' : 'bg-secondary-light text-secondary '
      }`}
    >
      <Clock size={16} />
      <span className="font-mono text-sm font-medium">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
