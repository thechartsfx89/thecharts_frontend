"use client";

import React from "react";
// import './quiz.css';



import Quiz from "@/component/quiz/Quiz";

export default function QuizPage() {
  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 panel">
      {/* <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        The Charts Quiz
      </h1> */}
      <div className="max-w-3xl mx-auto">
        <Quiz  />
      </div>
    </div>
  );
}