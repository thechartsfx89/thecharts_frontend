// // app/api/quiz/submit/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import apiService from "@/lib/axios";
// import { getToken } from "next-auth/jwt";
// import { API_ENDPOINTS } from "@/api-constant";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { quizId, answers, moduleId } = body;

//     const token: any = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//     });

//     if (!token?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = token.user.id;

//     // Fetch quiz with questions
//     const quizRes = await apiService.get(`${API_ENDPOINTS.quiz}/${quizId}?populate=questions`);
//     const quiz = quizRes.data.data;
//     const questions = quiz.questions;

//     let correct = 0;
//     let total = questions.length;

//     questions.forEach((q: any) => {
//       const correctOption = q.correct_answer;
//       const userAnswerIndex = answers[q.id];

//       if (userAnswerIndex === undefined) return;

//       const userOptionKey = userAnswerIndex;

//       if (userOptionKey === correctOption) correct++;
//     });

//     const percentage = (correct / total) * 100;
//     const passed = percentage >= quiz.passing_percentage;

//     console.log(
//       `Quiz Result - Correct: ${correct}, Total: ${total}, Percentage: ${percentage}, Passed: ${passed}`
//     );
//     console.log("User Answers:", moduleId, quizId, answers);
//     // ---------------------------------------------------------
//     // 🔍 1. Check if record already exists (same user + module + quiz)
//     // ---------------------------------------------------------
//     const existingRes = await apiService.get(
//       `${API_ENDPOINTS.quizScores}?filters[user][id][$eq]=${userId}&filters[course][documentId][$eq]=${moduleId}&filters[quiz][documentId][$eq]=${quizId}`
//     );
//     console.log("Existing quiz score response:", existingRes.data);
//     const existing = existingRes.data.data?.[0]; // if exists
//     console.log("Existing quiz score response:", existing);

//     if (existing) {
//       // ---------------------------------------------------------
//       // 🔁 2. If exists → UPDATE (increase attempt number)
//       // ---------------------------------------------------------
//       const currentAttempt = existing.attempt_no ?? 1;

//       const updated = await apiService.put(`${API_ENDPOINTS.quizScores}/${existing.documentId}`, {
//         data: {
//           score: percentage,
//           is_passed: passed,
//           answers,
//           attempt_no: currentAttempt + 1,

//         },
//       });

//       return NextResponse.json({
//         status: 200,
//         message: "Updated previous attempt",
//         attempt_no: currentAttempt + 1,
//         correct,
//         total,
//         percentage,
//         passed,
//       },{ status: 200 });
//     }

//     // ---------------------------------------------------------
//     // 🆕 3. If not exists → CREATE new record
//     // ---------------------------------------------------------
//     await apiService.post(`${API_ENDPOINTS.quizScores}`, {
//       data: {
//         quiz: quizId,
//         score: percentage,
//         is_passed: passed,
//         answers,
//         user: userId,
//         attempt_no: 1,
//         course_modules: moduleId,
//         // purchased_course: moduleId,
//       },
//     });

//     return NextResponse.json({
//       message: "New quiz attempt created",
//       attempt_no: 1,
//       correct,
//       total,
//       percentage,
//       passed,
//     });
//   } catch (err: any) {
//     console.log("Quiz Submit Error:", err);
//     return NextResponse.json({ error: "Quiz submission failed" }, { status: 500 });
//   }
// }                   


// app/api/quiz/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizId, answers, moduleId } = body;

    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    // Fetch quiz with questions
    const quizRes = await apiService.get(`${API_ENDPOINTS.quiz}/${quizId}?populate=questions`);
    const quiz = quizRes.data.data;
    const questions = quiz.questions;

    let correct = 0;
    let total = questions.length;

    questions.forEach((q: any) => {
      const correctOption = q.correct_answer;
      const userAnswerIndex = answers[q.id];
      if (userAnswerIndex === undefined) return;
      if (userAnswerIndex === correctOption) correct++;
    });

    const percentage = (correct / total) * 100;
    const passed = percentage >= quiz.passing_percentage;

    // ---------------------------------------------------------
    // 🔍 1. Check if record already exists
    // ENSURE: filters use 'course_modules' if that is your relation name
    // ---------------------------------------------------------
    const existingRes = await apiService.get(
      `${API_ENDPOINTS.quizScores}?filters[user][id][$eq]=${userId}&filters[course_modules][documentId][$eq]=${moduleId}&filters[quiz][documentId][$eq]=${quizId}`
    );
    
    const existing = existingRes.data.data?.[0];

    if (existing) {
      // ---------------------------------------------------------
      // 🔁 2. If exists → UPDATE
      // ---------------------------------------------------------
      const currentAttempt = existing.attempt_no ?? 1;

      // We include course_modules and quiz in the PUT to ensure the relation stays intact
      await apiService.put(`${API_ENDPOINTS.quizScores}/${existing.documentId}`, {
        data: {
          score: percentage,
          is_passed: passed,
          answers,
          attempt_no: currentAttempt + 1,
          
                         
        },
      });

      return NextResponse.json({
        message: "Updated previous attempt",
        attempt_no: currentAttempt + 1,
        correct,
        total,
        percentage,
        passed,
      }, { status: 200 });
    }

    // ---------------------------------------------------------
    // 🆕 3. If not exists → CREATE new record
    // ---------------------------------------------------------
    await apiService.post(`${API_ENDPOINTS.quizScores}`, {
      data: {
        quiz: quizId,
        score: percentage,
        is_passed: passed,
        answers,
        user: userId,
        attempt_no: 1,
        course_modules: moduleId,
      },
    });

    return NextResponse.json({
      message: "New quiz attempt created",
      attempt_no: 1,
      correct,
      total,
      percentage,
      passed,
    }, { status: 200 });

  } catch (err: any) {
    console.error("Quiz Submit Error:", err.response?.data || err.message);
    return NextResponse.json({ error: "Quiz submission failed" }, { status: 500 });
  }
}