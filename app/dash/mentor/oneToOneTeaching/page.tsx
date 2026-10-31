"use client";

import IconMenuComponents from "@/components/icon/menu/icon-menu-components";
import IconMenuDashboard from "@/components/icon/menu/icon-menu-dashboard";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function page() {
    const { data: session, status } = useSession();
  return (
    <div className="w-full min-h-screen flex flex-col">
      
      {/* Top Header / Breadcrumb */}
     <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4">
                <li>
                    <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "mentor" ? `/dash/student` : "#"}>
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70 bg-white">
                            <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                        </button>
                    </Link>
                </li>
                <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <button className="p-2.5 border border-gray-500/20 text-primary rounded-md shadow flex gap-2 items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        <IconMenuComponents className="shrink-0 group-hover:!text-primary" />
                        One To One Teaching
                    </button>
                </li>
            </ol>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 p-6 flex-1">

        {/* LEFT: Webinar Player */}
        <div className="lg:col-span-5 space-y-4">

          {/* Video / Meeting section */}
          <div className="bg-white rounded-xl shadow p-3 h-[75vh]">
            <iframe
              title="Zoho Meeting"
              src="https://meeting.zoho.in/meeting/meeting-start?key=1347172408&x-meeting-org=60053833905"
              allow="camera; microphone; clipboard-read; clipboard-write"
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>

          {/* Webinar Topic */}
          <div className="bg-white rounded-xl shadow p-4">
            <h1 className="font-semibold text-lg">Introduction of  Trading</h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              In this lecture, you will learn what the trading market is, how it works,
              and why it is the largest and most liquid financial market in the world.
              We will explore the history of currency exchange, the major participants
              including central banks and retail traders, and the benefits of trading.
              You will also understand currency pairs, spreads, pips, and the 24-hour
              global trading sessions.
            </p>
          </div>
        </div>

        {/* RIGHT: (Optional future content) */}
        <div className="hidden lg:block">
          {/* Add Chat / Notes / Upcoming Webinars Later */}
        </div>
      </div>
    </div>
  );
}
