

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
// import Question from './Question';
import Results from './Results';
import Timer from './Timer';
import { QUESTIONS } from '@/utils/constant/questions';
import { UI_TEXT } from '@/utils/constant/ui-texts';
import Question from './question';
// import { QUESTIONS } from '../data/questions';
// import { UI_TEXT } from '../constants/ui-texts';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);

  // Start timing when component mounts
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Shuffle options for each question consistently
  const questionsWithShuffled = useMemo(() => {
    return QUESTIONS.map(question => {
      const shuffled = [...question.options];
      const correctAnswer = question.correctAnswer;

      // Simple deterministic shuffle using question ID as seed
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (question.id * (i + 1)) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Find new correct index
      const newCorrectIndex = shuffled.indexOf(correctAnswer);

      return {
        ...question,
        text: question.question,
        shuffledOptions: shuffled,
        shuffledCorrect: newCorrectIndex
      };
    });
  }, []);

  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (reviewMode) return; // Prevent selection in review mode
      setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = answerIndex;
        return newAnswers;
      });
    },
    [currentQuestion, reviewMode]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      if (!reviewMode) {
        setTimerKey(prev => prev + 1);
      }
    }
  }, [currentQuestion, reviewMode]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      if (!reviewMode) {
        setTimerKey(prev => prev + 1);
      }
    }
  }, [currentQuestion, reviewMode]);

  const handleTimeUp = useCallback(() => {
    // Auto-advance to next question when time is up
    if (currentQuestion < QUESTIONS.length - 1) {
      handleNextQuestion();
    } else {
      handleSubmit();
    }
  }, [currentQuestion, handleNextQuestion]);

  const calculateScore = useCallback((): number => {
    return selectedAnswers.reduce((score: number, selectedAnswer, index) => {
      if (selectedAnswer !== null) {
        const question = questionsWithShuffled[index];
        return selectedAnswer === question.shuffledCorrect ? score + 1 : score;
      }
      return score;
    }, 0);
  }, [selectedAnswers, questionsWithShuffled]);

  const handleSubmit = useCallback(() => {
    if (startTime) {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      setTotalTime(timeTaken);
    }
    setShowResults(true);
  }, [startTime]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(QUESTIONS.length).fill(null));
    setShowResults(false);
    setReviewMode(false);
    setTimerKey(prev => prev + 1);
    setStartTime(Date.now());
    setTotalTime(0);
  }, []);

  const handleReview = useCallback(() => {
    setReviewMode(true);
    setShowResults(false);
    setCurrentQuestion(0);
  }, []);

  const handleBackToResults = useCallback(() => {
    setReviewMode(false);
    setShowResults(true);
  }, []);

  if (showResults) {
    const score = calculateScore();
    return (
      <Results
        score={score}
        totalQuestions={QUESTIONS.length}
        totalTime={totalTime}
        onRetry={handleRetry}
        onReview={handleReview}
      />
    );
  }

  const currentQ = questionsWithShuffled[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const canProceed = selectedAnswers[currentQuestion] !== null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {reviewMode ? UI_TEXT.reviewTitle : UI_TEXT.quizTitle}
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <Question
          question={{
            id: currentQ.id,
            text: currentQ.text,
            options:[],
            correct: currentQ.shuffledCorrect
          }}
          selectedAnswer={selectedAnswers[currentQuestion]}
          onSelectAnswer={handleSelectAnswer}
          questionNumber={currentQuestion + 1}
          totalQuestions={QUESTIONS.length}
          reviewMode={reviewMode}
        />

        {reviewMode && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">{UI_TEXT.quiz.correctAnswerLabel}</span>
              <span className="font-medium text-green-600">
                {currentQ.shuffledOptions[currentQ.shuffledCorrect]}
              </span>
              {selectedAnswers[currentQuestion] === currentQ.shuffledCorrect ? (
                <span className="text-green-600 font-medium">{UI_TEXT.quiz.correctStatus}</span>
              ) : selectedAnswers[currentQuestion] !== null ? (
                <span className="text-red-600 font-medium">{UI_TEXT.quiz.incorrectStatus}</span>
              ) : (
                <span className="text-gray-500 font-medium">{UI_TEXT.quiz.notAnsweredStatus}</span>
              )}
            </div>
            {selectedAnswers[currentQuestion] !== null &&
              selectedAnswers[currentQuestion] !== currentQ.shuffledCorrect && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span className="text-gray-600">{UI_TEXT.quiz.yourAnswerLabel}</span>
                  <span className="font-medium text-red-600">
                    {currentQ.shuffledOptions[selectedAnswers[currentQuestion]!]}
                  </span>
                </div>
              )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft size={16} />
          {UI_TEXT.buttons.previous}
        </button>

        <div className="flex gap-3">
          {reviewMode ? (
            isLastQuestion ? (
              <button
                onClick={handleBackToResults}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                {UI_TEXT.buttons.backToResults}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                {UI_TEXT.buttons.next}
                <ChevronRight size={16} />
              </button>
            )
          ) : isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                canProceed
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
              {UI_TEXT.buttons.submit}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                canProceed
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {UI_TEXT.buttons.next}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;