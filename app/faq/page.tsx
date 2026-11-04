"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHero, TcPage } from "@/components/pages/Landing/page-shell";
import NoDataComponent from "@/utils/common/noDataComponent";

type FaqRow = {
  title: string;
  content: string;
};

export default function FAQPage() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  return (
    <TcPage>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Frequently Asked <span className="text-[#16c75f]">Questions</span>
          </>
        }
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : rows.length > 0 ? (
          <div className="space-y-4">
            {rows.map((row, index) => (
              <details key={index} className="group rounded-2xl border border-slate-200 bg-white transition open:border-[#16c75f]/50 open:shadow-xl open:shadow-slate-900/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-[#0b1b33] [&::-webkit-details-marker]:hidden">
                  {row.title}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-45 group-open:bg-[#0b1b33] group-open:text-[#16c75f]">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="px-6 pb-6 leading-relaxed text-slate-600">{row.content}</p>
              </details>
            ))}
          </div>
        ) : (
          <NoDataComponent />
        )}
      </section>
    </TcPage>
  );
}
