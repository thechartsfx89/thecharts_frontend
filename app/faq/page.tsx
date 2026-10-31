"use client";

import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import HeaderLanding from "../dashboard/landing/headerLanding";
import Footer from "@/components/pages/Footer/footer";

type FaqRow = {
  title: string;
  content: string;
};

export default function FAQPage() {
  const [rows, setRows] = useState<FaqRow[]>([]);

  const styles = {
    bgColor: "white",
    titleTextColor: "#2b2b2b",
    rowTitleColor: "#0d9488",
    rowContentColor: "#475569",
    arrowColor: "#0d9488",
    rowContentPaddingBottom: "15px",
  };

  const config = {
    animate: true,
    tabFocus: true,
    expandIcon: "+",
    collapseIcon: "-",
  };

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await fetch("/api/faqs", { cache: "no-store" });
        const json = await res.json();

        const faqsArray = json?.data?.faqs;

        if (faqsArray && Array.isArray(faqsArray)) {
          const updatedRows: FaqRow[] = faqsArray.map((item: any) => ({
            title: item.question?.trim() || "Untitled Question",
            content:
              item.answer?.[0]?.children?.[0]?.text ||
              "No answer available.",
          }));

          setRows(updatedRows);
        }
      } catch (error) {
        console.error("FAQ Fetch Error:", error);
      }
    }

    fetchFAQs();
  }, []);

  // Pass rows directly (no title)
  const data = { rows };

  return (
    <>
      <HeaderLanding />
      <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white panel p-8">

          {/* Only custom H1 */}
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
            Frequently Asked Questions
          </h1>

          <Faq data={data} styles={styles} config={config} />
        </div>
      </div>
      <Footer />
    </>
  );
}
