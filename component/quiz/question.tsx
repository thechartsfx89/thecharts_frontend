import React from 'react';

interface Option {
  key: number;
  value: string;
}
interface Question {
  id: number;
  text: string;
  options: Option[];
  correct: number;
}

interface QuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (questionId:any,answerIndex: any) => void;
  questionNumber: number;
  totalQuestions: number;
  reviewMode?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
  reviewMode = false,
}) => {
  console.log("Rendering Question:",{question}, question.id, "Selected Answer:", selectedAnswer);
  // ---------- base palettes ----------
  const palette = {
    blue: { border: '#3b82f6', light: '#eff6ff', text: '#1e3a8a' },
    green: { border: '#22c55e', light: '#ecfdf5', text: '#065f46' },
    red: { border: '#ef4444', light: '#fef2f2', text: '#7f1d1d' },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      600: '#4b5563',
      800: '#1f2937',
      900: '#111827',
    },
    white: '#ffffff',
  };

  // ---------- style helpers ----------
  const containerStyle: React.CSSProperties = {
    maxWidth: 672, // ~max-w-2xl
    margin: '0 auto',
  };

  const headerWrapStyle: React.CSSProperties = {
    marginBottom: 32,
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  };

  const headerMetaStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: palette.gray[600],
  };

  const dotsWrapStyle: React.CSSProperties = {
    display: 'flex',
    gap: 4,
  };

  const dotStyle = (idx: number): React.CSSProperties => {
    const done = idx < questionNumber - 1;
    const current = idx === questionNumber - 1;
    return {
      width: 8,
      height: 8,
      borderRadius: '9999px',
      backgroundColor: done ? palette.blue.border : current ? '#93c5fd' : palette.gray[200],
    };
  };

  const questionTextStyle: React.CSSProperties = {
    fontSize: 17,
    fontWeight: 600,
    color: palette.gray[900],
    lineHeight: 1.5,
  };

  const optionsWrapStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const baseOptionStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'solid',
    transition: 'background-color .2s, border-color .2s',
    backgroundColor: palette.white,
    borderColor: palette.gray[200],
    cursor: reviewMode ? 'default' : 'pointer',
  };

  const selectedStyle: React.CSSProperties = {
    borderColor: palette.blue.border,
    backgroundColor: palette.blue.light,
    color: palette.blue.text,
  };

  const correctStyle: React.CSSProperties = {
    borderColor: palette.green.border,
    backgroundColor: palette.green.light,
    color: palette.green.text,
  };

  const wrongStyle: React.CSSProperties = {
    borderColor: palette.red.border,
    backgroundColor: palette.red.light,
    color: palette.red.text,
  };

  const mutedStyle: React.CSSProperties = {
    borderColor: palette.gray[200],
    backgroundColor: palette.gray[50],
    color: '#475569', // slate-600-ish
  };

  const optionRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const radioOuterBase: React.CSSProperties = {
    width: 20,
    height: 20,
    borderRadius: '9999px',
    borderWidth: 2,
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const radioOuterFor = (index: number): React.CSSProperties => {
    // non-review
    if (!reviewMode) {
      if (selectedAnswer === index) {
        return { ...radioOuterBase, borderColor: palette.blue.border, backgroundColor: palette.blue.border };
      }
      return { ...radioOuterBase, borderColor: palette.gray[300], backgroundColor: 'transparent' };
    }

    // review mode
    // if (index === question.correct) {
    //   return { ...radioOuterBase, borderColor: palette.green.border, backgroundColor: palette.green.border };
    // }
    if (selectedAnswer === index) {
      return { ...radioOuterBase, borderColor: palette.red.border, backgroundColor: palette.red.border };
    }
    return { ...radioOuterBase, borderColor: palette.gray[300], backgroundColor: 'transparent' };
  };

  const radioInnerFor = (index: number): React.CSSProperties => {
    const showDot = !reviewMode
      ? selectedAnswer === index
      : index === question.correct || selectedAnswer === index;

    return {
      width: 8,
      height: 8,
      borderRadius: '9999px',
      backgroundColor: showDot ? palette.white : 'transparent',
    };
  };

  const optionTextStyle: React.CSSProperties = {
    fontWeight: 600,
  };

  const badgeStyle = (color: 'green' | 'red'): React.CSSProperties => ({
    marginLeft: 'auto',
    color: color === 'green' ? '#16a34a' : '#dc2626',
    fontWeight: 600,
  });

  // compute per-option style
  const optionStyleFor = (index: number): React.CSSProperties => {
    if (!reviewMode) {
      return selectedAnswer === index ? { ...baseOptionStyle, ...selectedStyle } : baseOptionStyle;
    }
    if (index === question.correct) return { ...baseOptionStyle, ...correctStyle };
    if (selectedAnswer === index) return { ...baseOptionStyle, ...wrongStyle };
    return { ...baseOptionStyle, ...mutedStyle };
  };

  return (
    <div style={containerStyle}>
      <div style={headerWrapStyle}>
        <div style={headerRowStyle}>
          <span style={headerMetaStyle}>
            Question {questionNumber} of {totalQuestions}
          </span>
          {/* <div style={dotsWrapStyle}>
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div key={i} style={dotStyle(i)} />
            ))}
          </div> */}
        </div>

        <h2 style={questionTextStyle}>{question.text}</h2>
      </div>

      <div style={optionsWrapStyle}>
        {question.options.map((option, index) => (
          <button
            key={`${question.id}-${index}`}
             onClick={() => onSelectAnswer(question.id, option.key)}
            disabled={reviewMode}
            style={optionStyleFor(option.key)}
          >
            <div style={optionRowStyle}>
              <div style={radioOuterFor(option.key)}>
                <div style={radioInnerFor(option.key)} />
              </div>

              <span style={optionTextStyle}>{option?.value}</span>

              {/* {reviewMode && option.key === question.correct && <span style={badgeStyle('green')}>✓</span>}
              {reviewMode && selectedAnswer === option.key && option.key !== question.correct && (
                <span style={badgeStyle('red')}>✗</span>
              )} */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
