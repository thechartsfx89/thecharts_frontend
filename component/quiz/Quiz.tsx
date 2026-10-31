"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import Results from "./Results";
import Timer from "./Timer";
import Question from "./question";
import { UI_TEXT } from "@/utils/constant/ui-texts";
import { useSearchParams } from "next/navigation";
import QuizInstructions from "./quizInstruction";

/** 🔹 Inline Button (same style as before) */
function InlineButton({
  children,
  onClick,
  disabled = false,
  variant = "secondary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const [hover, setHover] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 12,
    fontWeight: 600,
    border: "none",
    transition: "background-color 150ms ease, color 150ms ease",
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
  };

  let style: React.CSSProperties = { ...baseStyle };

  if (variant === "primary") {
    style.background = disabled ? "#e5e7eb" : hover ? "#2563eb" : "#3b82f6";
    style.color = disabled ? "#9ca3af" : "#ffffff";
  } else {
    style.background = disabled ? "#f5f5f5" : hover ? "#e5e7eb" : "#f5f5f5";
    style.color = disabled ? "#9ca3af" : "#374151";
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

/** 🔹 Main Quiz Component */
const Quiz: React.FC = () => {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const searchParams = useSearchParams();
const moduleId = searchParams.get("moduleId") || "";
const courseDocId = searchParams.get("courseDocId") || "";

  const [quizId, setQuizId] = useState<string>(null);
  const [courseText, setCourseText] = useState<any>(null);  
  const [quizResult, setQuizResult] = useState<any>(null);
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quiz?moduleId=${moduleId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        console.log("✅ Quiz Fetch Success:", json);
        const raw = json?.data[0]?.questions || [];
       setQuizId(json?.data[0]?.documentId || null);
       setCourseText(json?.data[0]?.recorderd_lecture || null);
        // 🧩 Normalize Strapi structure
        const formatted = raw.map((q: any) => {
          const options = [
            q.option_1,
            q.option_2,
            q.option_3,
            q.option_4,
          ].filter(Boolean);
          const correctIndex =
            Number(q.correct_answer?.replace("option_", "")) - 1;
          return {
            id: q.id,
            question: q.question,
            options,
            correctAnswer: options[correctIndex],
          };
        });

        setQuizData(formatted);
        setError(null);
      } catch (err: any) {
        console.error("❌ Quiz Fetch Error:", err);
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);


  const quizQuestions = useMemo(() => {
  if (!quizData.length) return [];

  // Shuffle the whole quiz & pick 259 questions
  const selected = [...quizData]
    .sort(() => Math.random() - 0.5)
    // .slice(0, 5);
   console.log("Selected Questions:", {selected});
  return selected.map((q) => {
    // Convert option_1…option_4 into key/value array
    const optionList = [
      { key: "option_1", value: q?.options[0] },
      { key: "option_2", value: q?.options[1] },
      { key: "option_3", value: q?.options[2] },
      { key: "option_4", value: q?.options[3] },
    ];
 
    // Shuffle options
    const shuffledOptions = optionList.sort(() => Math.random() - 0.5);

    return {
      ...q,
      text: q.question,
      shuffledOptions,   // ← final shuffled options WITH KEYS
    };
  });
}, [quizData]);


  /** 🔹 Initialize timer & answers when questions loaded */
  useEffect(() => {
    if (quizQuestions.length > 0) {
      // setSelectedAnswers(new Array(quizQuestions.length).fill(null));
      setStartTime(Date.now());
    }
  }, [quizQuestions]);

  const handleSelectAnswer = useCallback(
  (questionId: any, answerIndex: any) => {
    if (reviewMode) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,  // update only this question
    }));
  },
  [reviewMode, currentQuestion]
);


  /** 🔹 Navigation handlers */
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((p) => p + 1);
      if (!reviewMode) setTimerKey((k) => k + 1);
    }
  }, [currentQuestion, quizQuestions.length, reviewMode]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((p) => p - 1);
      if (!reviewMode) setTimerKey((k) => k + 1);
    }
  }, [currentQuestion, reviewMode]);

  const handleTimeUp = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) handleNextQuestion();
    else handleSubmit(selectedAnswers);
  }, [currentQuestion, quizQuestions.length, handleNextQuestion]);

  /** 🔹 Score calculation */
  console.log("Selected Answers:", selectedAnswers);
 
  const handleSubmit = useCallback( async(optAnswers:any) => {
    if (startTime) {
      const endTime = Date.now();
      setTotalTime(Math.round((endTime - startTime) / 1000));
    }
  
      try {
        setLoading(true);
        const res = await fetch(`/api/quiz/submit`, {
          method: "POST",
          body: JSON.stringify({
            quizId: quizId,
            answers: optAnswers,
            moduleId
          }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        if(!res.status || res.status !== 200 ){
          throw new Error(result.error || "Failed to submit quiz");
        }
        // const raw = json?.data[0]?.questions || [];
        setQuizResult(result);
        setShowResults(true);

        console.log("✅ Quiz Fetch Success:",result);

        // setError(null);
      } catch (err: any) {
        console.error("❌ Quiz Fetch Error:", err);
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
  }, [startTime]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(null));
    setShowResults(false);
    setReviewMode(false);
    setTimerKey((k) => k + 1);
    setStartTime(Date.now());
    setTotalTime(0);
  }, [quizQuestions.length]);

  const handleReview = useCallback(() => {
    setReviewMode(true);
    setShowResults(false);
    setCurrentQuestion(0);
  }, []);

  const handleBackToResults = useCallback(() => {
    setReviewMode(false);
    setShowResults(true);
  }, []);

  /** 🔹 Loading & Error states */
  if (loading) return <div className="p-8 text-center">Loading quiz...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!quizQuestions.length)
    return <div className="p-8 text-center">No quiz available.</div>;

  /** 🔹 Show results */
  if (showResults) {
    // const score = calculateScore();
    return (
      <Results
        score={quizResult?.correct}
        totalQuestions={quizResult.total}
        totalTime={totalTime}
        onRetry={handleRetry}
        onReview={handleReview}
        courseDocId={courseDocId}
      />
    );
  }

  /** 🔹 Current question */
  const currentQ = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  // const canProceed = selectedAnswers[currentQuestion] !== null;
  const questionId = quizData[currentQuestion]?.id;
  const answerIndex = currentQ.id;
const canProceed = selectedAnswers[answerIndex] !== undefined;

const selectedValueIndex = selectedAnswers[answerIndex] ?? null;
  /** 🔹 UI Rendering */
  

  const handleStart = () => {
    setShowInstructions(false);
  };

  const handleSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    setCurrent((prev) => prev + 1);
  };
  const course_title = courseText?.course_title ? `${courseText?.course_title} Quiz`: "Module Quiz"
  if (showInstructions) {
    return <QuizInstructions onStart={handleStart} course_title={course_title}/>;
  }
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-black">
            {/* {reviewMode ? UI_TEXT.reviewTitle : UI_TEXT.quizTitle} */}
           {course_title}
          </h1>
          <p className="text-gray-600 mt-1">
            {reviewMode ? UI_TEXT.quiz.reviewSubtitle : UI_TEXT.quiz.subtitle}
          </p>
        </div>
        {!reviewMode && (
          <Timer
            key={timerKey}
            duration={60}
            onTimeUp={handleTimeUp}
            isActive={!showResults}
          />
        )}
      </div>

      {/* Question Card */}
      <div className="panel rounded-2xl shadow-sm border border-gray-300 p-8 mb-6 ">
        <Question
          question={{
            id: currentQ.id,
            text: currentQ.text,
            options: currentQ.shuffledOptions,
            correct: currentQ.shuffledCorrect,
          }}
          selectedAnswer={selectedValueIndex}
          onSelectAnswer={handleSelectAnswer}
          questionNumber={currentQuestion + 1}
          totalQuestions={quizQuestions.length}
          reviewMode={reviewMode}
        />

        {/* Review Mode */}
        {reviewMode && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {UI_TEXT.quiz.correctAnswerLabel}
              </span>
              <span className="font-medium text-green-600">
                {currentQ.shuffledOptions[currentQ.shuffledCorrect]}
              </span>
              {selectedAnswers[currentQuestion] ===
              currentQ.shuffledCorrect ? (
                <span className="text-green-600 font-medium">
                  {UI_TEXT.quiz.correctStatus}
                </span>
              ) : selectedAnswers[currentQuestion] !== null ? (
                <span className="text-red-600 font-medium">
                  {UI_TEXT.quiz.incorrectStatus}
                </span>
              ) : (
                <span className="text-gray-500 font-medium">
                  {UI_TEXT.quiz.notAnsweredStatus}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end pr-12">
      

        <div style={{ display: "flex", gap: 12 }}>
          {reviewMode ? (
            isLastQuestion ? (
              <InlineButton onClick={handleBackToResults} variant="primary">
                {UI_TEXT.buttons.backToResults}
              </InlineButton>
            ) : (
              <InlineButton onClick={handleNextQuestion} variant="primary">
                {UI_TEXT.buttons.next}
                <ChevronRight size={16} />
              </InlineButton>
            )
          ) : isLastQuestion ? (
            <InlineButton
              onClick={()=>handleSubmit(selectedAnswers)}
              disabled={!canProceed}
              variant="primary"
            >
              <Send size={16} />
              {UI_TEXT.buttons.submit}
            </InlineButton>
          ) : (
            <InlineButton
              onClick={handleNextQuestion}
              disabled={!canProceed}
              variant="primary"
            >
              {UI_TEXT.buttons.next}
              <ChevronRight size={16} />
            </InlineButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
