import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';
import { UI_TEXT } from '@/utils/constant/ui-texts';
import Link from 'next/link';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  totalTime: number;
  onRetry: () => void;
  onReview: () => void;
  courseDocId?: string;
}

/** Reusable inline-styled full-width button */
function InlineButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const [hover, setHover] = useState(false);

  const baseStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 12,
    fontWeight: 600,
    border: 'none',
    transition: 'background-color 150ms ease, color 150ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  let style: React.CSSProperties = { ...baseStyle };

  if (variant === 'primary') {
    // blue-500 -> blue-600
    style.background = disabled ? '#e5e7eb' : (hover ? '#2563eb' : '#3b82f6');
    style.color = disabled ? '#9ca3af' : '#ffffff';
  } else if (variant === 'secondary') {
    // Purple secondary
    style.background = disabled ? '#f3f4f6' : (hover ? '#ddd6fe' : '#ede9fe');
    style.color = disabled ? '#9ca3af' : '#5b21b6';
    style.border = '1px solid #ddd6fe';

  } else {
    // gray-100 -> gray-200
    style.background = disabled ? '#f5f5f5' : (hover ? '#e5e7eb' : '#f5f5f5');
    style.color = disabled ? '#9ca3af' : '#374151';
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={style}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, totalTime, onRetry, onReview, courseDocId }) => {
  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 60;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
  };

  // const searchParams = useSearchParams();

  // If courseDocId is missing from props, get it from URL or LocalStorage
  const persistentCourseDocId = courseDocId || localStorage.getItem('last_course_doc_id');

  // Save it to localStorage whenever we DO have it, just in case of another refresh
  useEffect(() => {
    if (persistentCourseDocId) {
      localStorage.setItem('last_course_doc_id', persistentCourseDocId);
    }
  }, [persistentCourseDocId]);

  const safePercentage = Number.isFinite(Number(percentage))
  ? Number(percentage).toFixed(2)
  : "0.00";

const safeScore = Number.isFinite(Number(score)) ? score : 0;
const safeTotal =
  Number.isFinite(Number(totalQuestions)) && totalQuestions > 0
    ? totalQuestions
    : 0;
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            marginBottom: 16,
            backgroundColor: passed ? '#dcfce7' : '#fee2e2', // green-100 / red-100
          }}
        >
          {passed ? (
            <CheckCircle
              style={{
                width: 40,
                height: 40,
                color: '#16a34a', // green-600
              }}
            />
          ) : (
            <XCircle
              style={{
                width: 40,
                height: 40,
                color: '#dc2626', // red-600
              }}
            />
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {passed ? UI_TEXT.result.passed : UI_TEXT.result.failed}
        </h2>

        <p className="text-gray-600 mb-6">
          {passed ? UI_TEXT.result.passedSubtitle : UI_TEXT.result.failedSubtitle}
        </p>
      </div>

      <div className={`panel ${passed ? "shadow-secondary" : "shadow-danger"} rounded-xl p-6 mb-8 space-y-4`}>
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{safePercentage}%</div>
          <div className="text-gray-600">
            {safeScore} out of {safeTotal} correct
          </div>
          <div
            className={`mt-3 px-4 py-2 rounded-full text-sm font-medium inline-block ${passed ? 'bg-success-light text-green-700 font-extrabold' : 'bg-danger-light text-danger font-extrabold'
              }`}
          >
            {passed ? UI_TEXT.result.passedStatus : UI_TEXT.result.failedStatus}
          </div>
        </div>

        <div className={`border-t border-gray-200 p-4 ${passed ? "bg-primary-light" : "bg-danger-light"}  w-full`}>
          <div className="flex items-center justify-center gap-2 text-gray-600 ">
            {/* <Clock size={16} /> */}
            <span className="text-sm font-bold">
              {/* {UI_TEXT.quiz.totalTimeLabel} {formatTime(totalTime)} */}
              {passed ? `Next module has been unlocked. Continue learning! 🚀` : `Mininum 60% required to unlock next Module`}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Review (primary) */}
        {/* <InlineButton  >
          {UI_TEXT.buttons.review}
       
        </InlineButton> */}
        {/* {passed && <Link href={`/dash/student/enroll-course/module/${courseDocId}`}>
        <button className='btn-dark py-2 px-1 font-semibold text-lg rounded w-full'>Next</button>
        </Link>} */}

        {passed && (
          <Link
            href={persistentCourseDocId ? `/dash/student/enroll-course/module/${persistentCourseDocId}` : '#'}
            onClick={(e) => {
              if (!persistentCourseDocId) {
                e.preventDefault();
                alert("Course ID not found. Please go back to the enroll Course.");
              }
            }}
          >
            <button className='btn-dark py-2 px-1 font-semibold text-lg rounded w-full'>
              {persistentCourseDocId ? 'Next Module' : 'Loading Module...'}
            </button>
          </Link>
        )}

        {/* Retry (secondary) */}
        {!passed && (
          <InlineButton onClick={onRetry} variant="secondary" >
            <RotateCcw size={16} />
            {UI_TEXT.buttons.retry}
          </InlineButton>
        )}
      </div>
    </div>
  );
};

export default Results;
