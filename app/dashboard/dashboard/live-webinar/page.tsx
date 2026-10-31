
"use client";
import IconDownload from '@/components/icon/icon-download'
import IconMenuComponents from '@/components/icon/menu/icon-menu-components'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Swal from 'sweetalert2';
import ZohoMeetingEmbed from './zohoMeetingEmbed';


export default function page() {
  const message3 = '22991';
  const showMessage = (message: string = '') => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    });

    toast.fire({
      icon: 'success',
      title: message || 'Download successfully.',
      padding: '10px 10px',
      didOpen: (toast) => {
        const titleEl = toast.querySelector(".swal2-title") as HTMLElement;
        if (titleEl) {
          titleEl.style.fontSize = "16px"; // smaller font
        }
      },
    });
  };

  const [startLink, setStartLink] = useState("");

  const createMeeting = async () => {
    const res = await fetch("/api/zoho/meeting/create", { method: "POST" });
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Failed to parse meeting JSON:", err);
      data = { error: "Invalid JSON response" };
    }
    console.log(data);
    if (data.startLink) setStartLink(data.startLink);
  };


  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
       

        {/* {!startLink ? (
          <>
            <button
              onClick={createMeeting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Create & Start Meeting
            </button>
          </>
        ) : (
          <iframe
            title="Zoho Meeting"
            src="https://meeting.zoho.in/meeting/meeting-start?key=1347172408&x-meeting-org=60053833905"
            allow="camera; microphone; clipboard-read; clipboard-write"
            className="w-full h-[80vh] rounded-2xl shadow-lg"
          />
        )} */}
         <ZohoMeetingEmbed
          startLink="https://meeting.zoho.in/meeting/meeting-start?key=1347172408&x-meeting-org=60053833905"
          orgId="60053833905"
        />
      </div>
      {/* <a
        href="https://meeting.zoho.in/meeting/meeting-start?key=1347172408&x-meeting-org=60053833905"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Start Zoho Meeting
      </a> */}

      {/* <iframe
        title="Zoho Meeting"
        src="https://meeting.zoho.in/meeting/meeting-start?key=1347172408&x-meeting-org=60053833905"
        allow="camera; microphone; clipboard-read; clipboard-write"
        className="w-full h-[80vh] rounded-2xl shadow-lg"
      /> */}
      
      <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4">
        <li>
          <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70 bg-white">
            <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
          </button>
        </li>
        <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4 bg-white">
          <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center text-primary dark:border-0 dark:bg-[#191e3a] gap-2">
            <IconMenuComponents />
            Live Webinar
          </button>
        </li>
        {/* <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4 bg-white">
                    <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center text-primary dark:border-0 dark:bg-[#191e3a] gap-2">
                        Details
                    </button>
                </li> */}
      </ol>
      <div className="panel grid grid-cols-1 lg:grid-cols-6 gap-6 p-6 mt-4 ">
        <div className="lg:col-span-5">

          <div>
            <h1 className='font-semibold text-lg my-3'>Introduction of Forex Trading</h1>
            <p className="text-xs text-gray-500">In this lecture, you will learn what the Forex market is, how it works, and why it is the largest and most liquid financial market in the world. We will explore the history of currency exchange, the major participants including central banks and retail traders, and the benefits of trading Forex. This session explains the structure of currency pairs, including major, minor, and exotic pairs. You will also understand the meaning of bid, ask, spreads, and pips, along with how the 24-hour Forex market operates through global sessions such as London, New York, and Tokyo.
              {/* the major participants including central banks and retail traders, and the benefits of trading Forex. */}
            </p>
          </div>

        </div>



      </div>


    </div>
  )
}
