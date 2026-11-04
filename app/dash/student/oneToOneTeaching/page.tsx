"use client";

import { GraduationCap } from "lucide-react";
import { DashPageHeader } from "@/components/layouts/dash-ui";

export default function page() {
  return (
    <div className="flex w-full flex-col">
      <DashPageHeader title="One To One Teaching" icon={GraduationCap} />

      <div className="space-y-6">
        {/* Video / Meeting section */}
        <div className="h-[75vh] overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <iframe
            title="Zoho Meeting"
            src="https://meeting.zoho.in/meeting/meeting-start?key=1347172408&x-meeting-org=60053833905"
            allow="camera; microphone; clipboard-read; clipboard-write"
            className="h-full w-full"
          ></iframe>
        </div>

        {/* Webinar Topic */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="tc-serif text-xl font-black text-[#0b1b33]">Introduction of Forex Trading</h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">
            In this lecture, you will learn what the Forex market is, how it works,
            and why it is the largest and most liquid financial market in the world.
            We will explore the history of currency exchange, the major participants
            including central banks and retail traders, and the benefits of trading Forex.
            You will also understand currency pairs, spreads, pips, and the 24-hour
            global trading sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
