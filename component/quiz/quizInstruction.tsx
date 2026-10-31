import React from "react";

export default function QuizInstructions({ onStart, course_title }: { onStart: () => void, course_title: string }) {
    return (
        <React.Fragment>
        <div>
            <h1 className="text-xl font-semibold text-black text-center dark:text-white">
                {course_title}
            </h1>
        </div>
        <div
            style={{
                maxWidth: 700,
                margin: "20px auto",
                padding: 32,
                borderRadius: 16,
                background: "#ffffff",
                border: "2px solid #e5e7eb",
            }}
        >
            <h2
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "#1f2937",
                }}
            >
                Quiz Instructions
            </h2>

            <p style={{ color: "#4b5563", marginBottom: 20, fontSize: 14 }} className="border-b pb-4">
                Please read the instructions carefully before starting the quiz.
            </p>

            <ul style={{ color: "#374151", lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
                <li>✔ Each question has only one correct answer.</li>
                <li>✔ You cannot go back once the answer is submitted.</li>
                <li>✔ You will get <b>60 seconds</b> for each question.</li>
                <li>✔ If time runs out, it will move to the next question automatically.</li>
                <li>✔ Minimum <b>60% score</b> is required to unlock the next module.</li>
                <li>✔ You can reattempt the quiz <b>unlimited times</b>.</li>
                {/* <li>✔ Timer will begin immediately after you click <b>Start Quiz</b>.</li> */}
                <li>✔ Do not refresh/back or close the browser during the quiz.</li>
                {/* <li>✔ Your progress will be saved automatically.</li> */}
            </ul>
           <div className="flex justify-end items-center w-full">
            <button
                onClick={onStart}
                className="btn-dark px-6 py-2  font-semibold rounded-lg "
                // style={{
                //     width: "100%",
                //     padding: "14px 20px",
                //     background: "#2563eb",
                //     color: "#fff",
                //     fontSize: 16,
                //     fontWeight: 600,
                //     borderRadius: 12,
                //     border: "none",
                //     cursor: "pointer",
                // }}
            >
                Start Quiz
            </button>
            </div>
        </div>
        </React.Fragment>
    );
}
