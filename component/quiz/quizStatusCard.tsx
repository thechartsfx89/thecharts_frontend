// QuizStatusCard.jsx
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconPlayCircle from '@/components/icon/icon-play-circle';
import { co } from '@fullcalendar/core/internal-common';
import Link from 'next/link';

export default function QuizStatusCard({ isUnlocked, moduleId, courseDocId }: { isUnlocked: boolean , moduleId: any, courseDocId?: any}) {
  console.log("QuizStatusCard - isUnlocked:", isUnlocked);
  const config = isUnlocked
    ? {
        title: "Course Quiz Unlock",
        border: "border-primary dark:border-blue-800",
        bg: "bg-blue-50 dark:bg-blue-900/30",
        iconBg: "bg-blue-200 dark:bg-blue-700",
        iconColor: "text-blue-600 dark:text-blue-200",
        message:
          "You’ve unlocked the quiz! Test your understanding now.",
        button: (
          <button className="w-full py-2 rounded-lg bg-brand text-white hover:bg-brand-hover transition">
            Start Quiz
          </button>
        ),
        icon: <IconPlayCircle />,
      }
    : {
        title: "Course Quiz Lock",
        border: "border-danger dark:border-pink-800",
        bg: "bg-danger-light dark:bg-pink-900/30",
        iconBg: "bg-red-300/20 dark:bg-pink-700",
        iconColor: "text-danger",
        message:
          "The quiz will unlock once you finish watching all course videos.",
        button: (
          <button
            disabled
            className="w-full py-2 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed 
              dark:bg-[#2a3555] dark:text-gray-400"
          >
            Start Quiz
          </button>
        ),
        icon: <IconLockDots />,
      };
  console.log("QuizStatusCard - config:", config, config.bg, config.border);
  return (
    <div style={{ background: `${config.bg} ${config.border}` }}
      className={`mt-2 space-y-4 panel w-auto lg:h-fit h-auto p-4 rounded-xl border ${config.border} ${config.bg}`}
    >
     <div className="text-center space-y-3">
        <h3 className="text-md font-semibold text-black">{config.title}</h3>
        <div className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full ${config.iconBg} ${config.iconColor}`}>
            {config.icon}
          </div>
          <p className="text-sm px-4">{config.message}</p>
        </div>
        <Link href={moduleId ? `/dash/student/quiz?courseDocId=${courseDocId}&moduleId=${moduleId}` : "#"}>
        {config.button}
        </Link>
      </div>
    </div>
  );
}
